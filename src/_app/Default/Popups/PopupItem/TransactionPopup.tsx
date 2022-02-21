import { AlertCircle, CheckCircle } from 'react-feather'

import { AutoRow } from './TransactionPopup/Row'
import ExternalLink from '../../Footer/ExternalLink'
import { getExplorerLink } from '../../Footer/Polling/explorer'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../../bootstrap/Fraction/functions/contract/validate/hooks/state/reducer/state-inari-reducer/actions/types/useBentoBoxTrait/hooks/useStakeSushiToBentoStrategy/hooks-index'
import { ExternalLinkIcon } from '@heroicons/react/outline'
import React from 'react'

const RowNoFlex = styled(AutoRow)`
  flex-wrap: nowrap;
`

export default function TransactionPopup({
  hash,
  success,
  summary,
}: {
  hash: string
  success?: boolean
  summary?: string
}) {
  const { chainId } = useActiveWeb3React()

  return (
    <RowNoFlex style={{ zIndex: 1000 }}>
      <div className="pr-4">
        {success ? <CheckCircle className="text-2xl text-green" /> : <AlertCircle className="text-2xl text-red" />}
      </div>
      <div className="flex flex-col gap-1">
        <div className="font-bold text-high-emphesis">
          {summary ?? 'Hash: ' + hash.slice(0, 8) + '...' + hash.slice(58, 65)}
        </div>
        {chainId && hash && (
          <ExternalLink
            className="text-blue hover:underline p-0 md:p-0"
            href={getExplorerLink(chainId, hash, 'transaction')}
          >
            <div className="flex flex-row items-center gap-1">
              View on explorer <ExternalLinkIcon width={20} height={20} />
            </div>
          </ExternalLink>
        )}
      </div>
    </RowNoFlex>
  )
}
