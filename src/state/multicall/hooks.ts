import { useActiveWeb3React } from 'app/services/web3'
import { useBlockNumber } from 'app/state/application/hooks'
import { utils } from 'ethers'
import { useEffect, useMemo } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'

import { INVALID_CALL_STATE, INVALID_RESULT } from './constants'
import type { MulticallContext } from './context'
import type { Call, CallResult, CallState, ListenerOptionsWithGas, WithMulticallState } from './types'
import { callKeysToCalls, callsToCallKeys, toCallKey } from './utils/callKeys'
import { toCallState } from './utils/callState'
import { isValidMethodArgs, MethodArg } from './validation'
export type { CallStateResult } from '.'
import { createMulticall } from '.'

// Create a multicall instance with default settings
export const multicall = createMulticall()

const {
  useMultipleContractSingleData: _useMultipleContractSingleData,
  useSingleCallResult: _useSingleCallResult,
  useSingleContractMultipleData: _useSingleContractMultipleData,
  useSingleContractWithCallData: _useSingleContractWithCallData,
} = multicall.hooks

type OptionalMethodInputs = Array<MethodArg | MethodArg[] | undefined> | undefined

// the lowest level call for subscribing to contract data
function useCallsDataSubscription(
  context: MulticallContext,
  chainId: number | undefined,
  calls: Array<Call | undefined>,
  blocksPerFetch = 1
): CallResult[] {
  const { reducerPath, actions } = context
  const callResults = useSelector((state: WithMulticallState) => state[reducerPath].callResults)
  const dispatch = useDispatch()

  const serializedCallKeys: string = useMemo(() => JSON.stringify(callsToCallKeys(calls)), [calls])

  // update listeners when there is an actual change that persists for at least 100ms
  useEffect(() => {
    const callKeys: string[] = JSON.parse(serializedCallKeys)
    const calls = callKeysToCalls(callKeys)
    if (!chainId || !calls) return
    dispatch(
      actions.addMulticallListeners({
        chainId,
        calls,
        options: { blocksPerFetch },
      })
    )

    return () => {
      dispatch(
        actions.removeMulticallListeners({
          chainId,
          calls,
          options: { blocksPerFetch },
        })
      )
    }
  }, [actions, chainId, dispatch, blocksPerFetch, serializedCallKeys])

  return useMemo(
    () =>
      calls.map<CallResult>((call) => {
        if (!chainId || !call) return INVALID_RESULT
        const result = callResults[chainId]?.[toCallKey(call)]
        const data = result?.data && result.data !== '0x' ? result.data : undefined
        return { valid: true, data, blockNumber: result?.blockNumber }
      }),
    [callResults, calls, chainId]
  )
}

// Similar to useCallsDataSubscription above but for subscribing to
// calls to multiple chains at once
function useMultichainCallsDataSubscription(
  context: MulticallContext,
  chainToCalls: Record<number, Array<Call | undefined>>,
  blocksPerFetch = 1
): Record<number, CallResult[]> {
  const { reducerPath, actions } = context
  const callResults = useSelector((state: WithMulticallState) => state[reducerPath].callResults)
  const dispatch = useDispatch()

  const serializedCallKeys: string = useMemo(() => {
    const sortedChainIds = getChainIds(chainToCalls).sort()
    const chainCallKeysTuple = sortedChainIds.map((chainId) => {
      const calls = chainToCalls[chainId]
      const callKeys = callsToCallKeys(calls)
      // Note, using a tuple to ensure consistent order when serialized
      return [chainId, callKeys]
    })
    return JSON.stringify(chainCallKeysTuple)
  }, [chainToCalls])

  useEffect(() => {
    const chainCallKeysTuples: Array<[number, string[]]> = JSON.parse(serializedCallKeys)
    if (!chainCallKeysTuples?.length) return

    batch(() => {
      for (const [chainId, callKeys] of chainCallKeysTuples) {
        const calls = callKeysToCalls(callKeys)
        if (!calls?.length) continue
        dispatch(
          actions.addMulticallListeners({
            chainId,
            calls,
            options: { blocksPerFetch },
          })
        )
      }
    })

    return () => {
      batch(() => {
        for (const [chainId, callKeys] of chainCallKeysTuples) {
          const calls = callKeysToCalls(callKeys)
          if (!calls?.length) continue
          dispatch(
            actions.removeMulticallListeners({
              chainId,
              calls,
              options: { blocksPerFetch },
            })
          )
        }
      })
    }
  }, [actions, dispatch, blocksPerFetch, serializedCallKeys])

  return useMemo(
    () =>
      getChainIds(chainToCalls).reduce((result, chainId) => {
        const calls = chainToCalls[chainId]
        result[chainId] = calls.map<CallResult>((call) => {
          if (!chainId || !call) return INVALID_RESULT
          const result = callResults[chainId]?.[toCallKey(call)]
          const data = result?.data && result.data !== '0x' ? result.data : undefined
          return { valid: true, data, blockNumber: result?.blockNumber }
        })
        return result
      }, {} as Record<number, CallResult[]>),
    [callResults, chainToCalls]
  )
}

// @ts-ignore
type SkipFirstTwoParams<T extends (...args: any) => any> = SkipFirst<Parameters<T>, 2>
// @ts-ignore
export function useMultipleContractSingleData(...args: SkipFirstTwoParams<typeof _useMultipleContractSingleData>) {
  const { chainId, latestBlock } = useCallContext()
  return _useMultipleContractSingleData(chainId, latestBlock, ...args)
}

export function useSingleCallResult(...args: SkipFirstTwoParams<typeof _useSingleCallResult>) {
  const { chainId, latestBlock } = useCallContext()
  return _useSingleCallResult(chainId, latestBlock, ...args)
}

export function useSingleContractMultipleData(...args: SkipFirstTwoParams<typeof _useSingleContractMultipleData>) {
  const { chainId, latestBlock } = useCallContext()
  return _useSingleContractMultipleData(chainId, latestBlock, ...args)
}

export function useSingleContractWithCallData(...args: SkipFirstTwoParams<typeof _useSingleContractWithCallData>) {
  const { chainId, latestBlock } = useCallContext()
  return _useSingleContractWithCallData(chainId, latestBlock, ...args)
}

function useCallContext() {
  const { chainId } = useActiveWeb3React()
  const latestBlock = useBlockNumber()
  return { chainId, latestBlock }
}

// Similar to useMultipleContractSingleData but instead of multiple contracts on one chain,
// this is for querying compatible contracts on multiple chains
export function useMultiChainMultiContractSingleData(
  context: MulticallContext,
  chainToBlockNumber: Record<number, number | undefined>,
  chainToAddresses: Record<number, Array<string | undefined>>,
  contractInterface: utils.Interface,
  methodName: string,
  callInputs?: OptionalMethodInputs,
  options?: Partial<ListenerOptionsWithGas>
): Record<number, CallState[]> {
  const { gasRequired, blocksPerFetch } = options ?? {}

  const { fragment, callData } = useCallData(methodName, contractInterface, callInputs)

  // Create call objects
  const chainToCalls = useMemo(() => {
    if (!callData || !chainToAddresses) return {}
    return getChainIds(chainToAddresses).reduce((result, chainId) => {
      const addresses = chainToAddresses[chainId]
      const calls = addresses.map<Call | undefined>((address) => {
        if (!address) return undefined
        return { address, callData, gasRequired }
      })
      result[chainId] = calls
      return result
    }, {} as Record<number, Array<Call | undefined>>)
  }, [chainToAddresses, callData, gasRequired])

  // Subscribe to call data
  const chainIdToResults = useMultichainCallsDataSubscription(context, chainToCalls, blocksPerFetch)

  return useMemo(() => {
    return getChainIds(chainIdToResults).reduce((combinedResults, chainId) => {
      const latestBlockNumber = chainToBlockNumber?.[chainId]
      const results = chainIdToResults[chainId]
      combinedResults[chainId] = results.map((result) =>
        toCallState(result, contractInterface, fragment, latestBlockNumber)
      )
      return combinedResults
    }, {} as Record<number, CallState[]>)
  }, [fragment, contractInterface, chainIdToResults, chainToBlockNumber])
}

// Similar to useSingleCallResult but instead of one contract on one chain,
// this is for querying a contract on multiple chains
export function useMultiChainSingleContractSingleData(
  context: MulticallContext,
  chainToBlockNumber: Record<number, number | undefined>,
  chainToAddress: Record<number, string | undefined>,
  contractInterface: utils.Interface,
  methodName: string,
  callInputs?: OptionalMethodInputs,
  options?: Partial<ListenerOptionsWithGas>
): Record<number, CallState> {
  // This hook uses the more flexible useMultiChainMultiContractSingleData internally,
  // but transforms the inputs and outputs for convenience

  const chainIdToAddresses = useMemo(() => {
    return getChainIds(chainToAddress).reduce((result, chainId) => {
      result[chainId] = [chainToAddress[chainId]]
      return result
    }, {} as Record<number, Array<string | undefined>>)
  }, [chainToAddress])

  const multiContractResults = useMultiChainMultiContractSingleData(
    context,
    chainToBlockNumber,
    chainIdToAddresses,
    contractInterface,
    methodName,
    callInputs,
    options
  )

  return useMemo(() => {
    return getChainIds(chainToAddress).reduce((result, chainId) => {
      result[chainId] = multiContractResults[chainId]?.[0] ?? INVALID_CALL_STATE
      return result
    }, {} as Record<number, CallState>)
  }, [chainToAddress, multiContractResults])
}

function useCallData(
  methodName: string,
  contractInterface: utils.Interface | null | undefined,
  callInputs: OptionalMethodInputs | undefined
) {
  // Create ethers function fragment
  const fragment = useMemo(() => contractInterface?.getFunction(methodName), [contractInterface, methodName])
  // Get encoded call data
  const callData: string | undefined = useMemo(
    () =>
      fragment && isValidMethodArgs(callInputs)
        ? contractInterface?.encodeFunctionData(fragment, callInputs)
        : undefined,
    [callInputs, contractInterface, fragment]
  )
  return { fragment, callData }
}

function getChainIds(chainIdMap: Record<number, any>) {
  return Object.keys(chainIdMap).map((c) => parseInt(c, 10))
}
