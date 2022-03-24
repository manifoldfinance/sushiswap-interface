import { ChainId } from '@sushiswap/core-sdk'
import { SUSHIGUARD_RELAY } from 'app/config/sushiguard'
import { PrivateTxState, PrivateTxStatus } from 'app/entities/SushiGuard'
import { retry, RetryableError, RetryOptions } from 'app/functions/retry'
import { txMinutesPending } from 'app/functions/transactions'
import { routingInfo } from 'app/hooks/useBestTridentTrade'
import { useActiveWeb3React } from 'app/services/web3'
import { updateBlockNumber } from 'app/state/application/actions'
import { useAddPopup, useBlockNumber } from 'app/state/application/hooks'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import { selectTransactions } from 'app/state/transactions/selectors'
import { fetchJsonRpc } from 'lib/jsonrpc'
import { useCallback, useEffect, useMemo } from 'react'

import {
  checkedTransaction,
  finalizeTransaction,
  SerializableTransactionReceipt,
  updatePrivateTxStatus,
} from './actions'
import { TransactionDetails } from './reducer'
import { sendRevertTransactionLog } from './sentryLogger'

export function shouldCheck(lastBlockNumber: number, tx: TransactionDetails): boolean {
  if (tx.privateTx) {
    if (
      (tx.privateTx?.state === PrivateTxState.OK && tx.receipt) ||
      tx.privateTx?.state === PrivateTxState.INDETERMINATE ||
      tx.privateTx?.state === PrivateTxState.ERROR
    )
      return false

    if (!tx.lastCheckedBlockNumber) return true

    const blocksSinceCheck = lastBlockNumber - tx.lastCheckedBlockNumber
    if (blocksSinceCheck < 1) return false

    if (tx.privateTx?.state === PrivateTxState.UNCHECKED || tx.privateTx?.state === PrivateTxState.PROCESSING) {
      const minutesPending = txMinutesPending(tx)
      if (minutesPending > 10) {
        // every 2 blocks if pending for longer than 10 minutes
        return blocksSinceCheck > 2
      } else if (minutesPending > 15) {
        // every 3 blocks if pending more than 15 minutes
        return blocksSinceCheck > 3
      } else {
        // otherwise every block
        return true
      }
    }

    // otherwise continue like a regular TX (we shouldn't reach this state though)
  }

  if (tx.receipt) return false
  if (!tx.lastCheckedBlockNumber) return true
  const blocksSinceCheck = lastBlockNumber - tx.lastCheckedBlockNumber
  if (blocksSinceCheck < 1) return false
  const minutesPending = txMinutesPending(tx)
  if (minutesPending > 60) {
    // every 10 blocks if pending for longer than an hour
    return blocksSinceCheck > 9
  } else if (minutesPending > 5) {
    // every 3 blocks if pending more than 5 minutes
    return blocksSinceCheck > 2
  } else {
    // otherwise every block
    return true
  }
}

const RETRY_OPTIONS_BY_CHAIN_ID: { [chainId: number]: RetryOptions } = {
  [ChainId.HARMONY]: { n: 10, minWait: 250, maxWait: 1000 },
  [ChainId.ARBITRUM]: { n: 10, minWait: 250, maxWait: 1000 },
}
const DEFAULT_RETRY_OPTIONS: RetryOptions = { n: 3, minWait: 1000, maxWait: 3000 }

const SUSHIGUARD_RETRY_OPTIONS: RetryOptions = { n: 3, minWait: 2000, maxWait: 5000 }

export default function Updater(): null {
  const { chainId, library } = useActiveWeb3React()

  const lastBlockNumber = useBlockNumber()

  const dispatch = useAppDispatch()
  const state = useAppSelector(selectTransactions)

  const transactions = useMemo(() => (chainId ? state[chainId as ChainId] ?? {} : {}), [chainId, state])

  // show popup on confirm
  const addPopup = useAddPopup()

  const getReceipt = useCallback(
    (hash: string) => {
      if (!library || !chainId) throw new Error('No library or chainId')
      const retryOptions = RETRY_OPTIONS_BY_CHAIN_ID[chainId] ?? DEFAULT_RETRY_OPTIONS
      return retry(
        () =>
          library.getTransactionReceipt(hash).then((receipt) => {
            if (receipt === null) {
              console.debug('Retrying for hash', hash)
              throw new RetryableError()
            }
            return receipt as SerializableTransactionReceipt
          }),
        retryOptions
      )
    },
    [chainId, library]
  )

  const getPrivateTxStatus = useCallback(
    (hash: string) => {
      if (!chainId) throw new Error('No chainId')
      if (!SUSHIGUARD_RELAY[chainId]) throw Error('SushiGuard is not available for the selected network.')
      return retry(
        () =>
          fetchJsonRpc<PrivateTxStatus>(SUSHIGUARD_RELAY[chainId] ?? '', {
            method: 'manifold_transactionStatus',
            params: [hash],
          }),
        SUSHIGUARD_RETRY_OPTIONS
      )
    },
    [chainId]
  )

  const routeInfo = useRecoilValue(routingInfo)

  useEffect(() => {
    if (!chainId || !library || !lastBlockNumber) return

    const cancels = Object.keys(transactions)
      .filter((hash) => shouldCheck(lastBlockNumber, transactions[hash]))
      .map((hash) => {
        const transaction = transactions[hash]
        const privateTx = transaction.privateTx ?? false

        let cancellation: () => void

        if (!privateTx) {
          const { promise, cancel } = getReceipt(hash)
          cancellation = cancel
          promise
            .then((receipt) => {
              if (receipt) {
                dispatch(
                  finalizeTransaction({
                    chainId,
                    hash,
                    receipt: { ...receipt },
                  })
                )

                addPopup(
                  {
                    txn: {
                      hash,
                      success: receipt.status === 1,
                      summary: transactions[hash]?.summary,
                    },
                  },
                  hash
                )

                // the receipt was fetched before the block, fast forward to that block to trigger balance updates
                if (receipt.blockNumber > lastBlockNumber) {
                  dispatch(updateBlockNumber({ chainId, blockNumber: receipt.blockNumber }))
                }

                if (receipt.status === 0) {
                  // @ts-ignore TYPE NEEDS FIXING
                  sendRevertTransactionLog(hash, routeInfo)
                }
              } else {
                dispatch(checkedTransaction({ chainId, hash, blockNumber: lastBlockNumber }))
              }
            })
            .catch((error) => {
              if (!error.isCancelledError) {
                console.error(`Failed to check transaction hash: ${hash}`, error)
              }
            })
        } else {
          // tx is private
          const { promise, cancel } = getPrivateTxStatus(hash)
          cancellation = cancel
          promise
            .then((res) => {
              if (!res) throw Error('Private tx status is undefined')
              if (res.error) throw res.error
              if (!res.result) throw new Error('Undefined result returned')

              const status = res.result as PrivateTxStatus

              dispatch(
                updatePrivateTxStatus({
                  chainId,
                  hash,
                  status,
                })
              )

              // mark latest block where tx was checked against last block number
              dispatch(checkedTransaction({ chainId, hash, blockNumber: lastBlockNumber }))

              return status
            })
            .then((status) => {
              if (!status.minedAt) return undefined

              // fetch transaction receipt only if minedAt is present
              return library.getTransactionReceipt(hash).then((receipt) => {
                if (!receipt) return

                dispatch(
                  finalizeTransaction({
                    chainId,
                    hash,
                    receipt: { ...receipt },
                  })
                )

                addPopup(
                  {
                    txn: {
                      hash,
                      success: receipt.status === 1,
                      summary: transactions[hash]?.summary,
                    },
                  },
                  hash
                )

                // the receipt was fetched before the block, fast forward to that block to trigger balance updates
                if (receipt.blockNumber > lastBlockNumber) {
                  dispatch(updateBlockNumber({ chainId, blockNumber: receipt.blockNumber }))
                }

                if (receipt.status === 0) {
                  // @ts-ignore TYPE NEEDS FIXING
                  sendRevertTransactionLog(hash, routeInfo)
                }
              })
            })
            .catch((error) => {
              if (!error.isCancelledError) {
                console.error(`Failed to check transaction hash: ${hash}`, error)
              }
            })
        }

        return cancellation
      })

    return () => {
      cancels.forEach((cancel) => cancel())
    }
  }, [chainId, library, transactions, lastBlockNumber, dispatch, addPopup, getPrivateTxStatus, getReceipt, routeInfo])

  return null
}
