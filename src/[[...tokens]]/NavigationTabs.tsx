import { ArrowLeftIcon } from '@heroicons/react/solid'
import HistoryLink from 'next/link'
import { Percent } from '@sushiswap/sdk'
import React from 'react'
import { RowBetween } from '../_app/Default/Popups/PopupItem/TransactionPopup/Row'
import SettingsTab from '../zap/Settings'
import { resetMintState } from '../_app/bootstrap/Fraction/functions/contract/validate/hooks/state/reducer/state-mint-reducer/actions'
import styled from 'styled-components'
import { t } from '@lingui/macro'
import { useAppDispatch } from '../_app/bootstrap/Fraction/functions/contract/validate/hooks/state/reducer/state-inari-reducer/actions/types/useBentoBoxTrait/hooks/hooks'
import { useLingui } from '@lingui/react'

const Tabs = styled.div`
  display: flex;
  flex-wrap: no-wrap;
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
`

export function FindPoolTabs() {
  const { i18n } = useLingui()

  return (
    <Tabs>
      <RowBetween className="items-center text-xl">
        <HistoryLink href="/pool">
          <a>
            <ArrowLeftIcon width="1em" height="1em" />
          </a>
        </HistoryLink>
        <div className="font-semibold">{i18n._(t`Import Pool`)}</div>
      </RowBetween>
    </Tabs>
  )
}

export function AddRemoveTabs({
  adding,
  creating,
  defaultSlippage,
}: {
  adding: boolean
  creating: boolean
  defaultSlippage: Percent
}) {
  const { i18n } = useLingui()

  // reset states on back
  const dispatch = useAppDispatch()

  return (
    <Tabs>
      <RowBetween className="items-center text-xl">
        <HistoryLink href="/add">
          <a
            onClick={() => {
              if (adding) {
                // not 100% sure both of these are needed
                dispatch(resetMintState())
              }
            }}
            className="flex items-center"
          >
            <ArrowLeftIcon width="1em" height="1em" />
          </a>
        </HistoryLink>
        <div className="font-semibold">
          {creating ? i18n._(t`Create a pair`) : adding ? i18n._(t`Add Liquidity`) : i18n._(t`Remove Liquidity`)}
        </div>
        <SettingsTab placeholderSlippage={defaultSlippage} />
      </RowBetween>
    </Tabs>
  )
}
