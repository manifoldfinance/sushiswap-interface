import React, { FC, useCallback } from 'react'
import { Field } from '../_app/bootstrap/Fraction/functions/contract/validate/hooks/state/reducer/state-swap-reducer/actions'
import { useDerivedLimitOrderInfo, useLimitOrderActionHandlers } from '../open-order/useLimitOrderApproveCallback/hooks'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../_app/bootstrap/Fraction/functions/contract/validate/hooks/state'
import { setFromBentoBalance } from '../_app/bootstrap/Fraction/functions/contract/validate/hooks/state/reducer/state-limit-order-reducer/actions'
import { maxAmountSpend } from '../_app/bootstrap/Fraction/functions'
import Typography from '../_app/Default/Header/Web3Network/NetworkModal/ModalHeader/Typography'

const BalancePanel: FC = () => {
  const { i18n } = useLingui()
  const { walletBalances, bentoboxBalances, currencies } = useDerivedLimitOrderInfo()
  const { onUserInput } = useLimitOrderActionHandlers()
  const maxAmountInput = maxAmountSpend(walletBalances[Field.INPUT])
  const dispatch = useDispatch<AppDispatch>()

  const handleMaxInput = useCallback(
    (bento) => {
      if (bento) {
        onUserInput(Field.INPUT, bentoboxBalances[Field.INPUT].toExact())
        dispatch(setFromBentoBalance(true))
      } else {
        maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact())
        dispatch(setFromBentoBalance(false))
      }
    },
    [bentoboxBalances, dispatch, maxAmountInput, onUserInput]
  )

  return (
    <div className="grid grid-cols-2 bg-dark-700 rounded-b px-5 py-1">
      <div className="flex gap-2">
        <Typography variant="sm" weight={700}>
          {i18n._(t`In Bento:`)}
        </Typography>
        <Typography variant="sm" className="text-secondary" onClick={() => handleMaxInput(true)}>
          {bentoboxBalances[Field.INPUT]?.toSignificant(6, { groupSeparator: ',' })} {currencies[Field.INPUT]?.symbol}
        </Typography>
      </div>
      <div className="flex gap-2">
        <Typography variant="sm" weight={700}>
          {i18n._(t`In Wallet:`)}
        </Typography>
        <Typography variant="sm" className="text-secondary" onClick={() => handleMaxInput(false)}>
          {walletBalances[Field.INPUT]?.toSignificant(6, { groupSeparator: ',' })} {currencies[Field.INPUT]?.symbol}
        </Typography>
      </div>
    </div>
  )
}

export default BalancePanel
