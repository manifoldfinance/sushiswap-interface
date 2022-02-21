import { FC, useCallback } from 'react'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import QuestionHelper from '../_app/Default/Header/QuestionHelper'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../_app/bootstrap/Fraction/functions/contract/validate/hooks/state'
import { setOrderExpiration } from '../_app/bootstrap/Fraction/functions/contract/validate/hooks/state/reducer/state-limit-order-reducer/actions'
import { useLimitOrderState } from '../open-order/useLimitOrderApproveCallback/hooks'
import { OrderExpiration } from '../_app/bootstrap/Fraction/functions/contract/validate/hooks/state/reducer/state-limit-order-reducer'
import NeonSelect, { NeonSelectItem } from './OrderExpirationDropdown/Select'

const OrderExpirationDropdown: FC = () => {
  const { i18n } = useLingui()
  const dispatch = useDispatch<AppDispatch>()
  const { orderExpiration } = useLimitOrderState()
  const items = {
    [OrderExpiration.never]: i18n._(t`Never`),
    [OrderExpiration.hour]: i18n._(t`1 Hour`),
    [OrderExpiration.day]: i18n._(t`24 Hours`),
    [OrderExpiration.week]: i18n._(t`1 Week`),
    [OrderExpiration.month]: i18n._(t`30 Days`),
  }

  const handler = useCallback(
    (e, item) => {
      dispatch(
        setOrderExpiration({
          label: items[item],
          value: item,
        })
      )
    },
    [dispatch, items]
  )

  return (
    <>
      <div className="flex items-center text-secondary gap-3 cursor-pointer">
        <div className="flex flex-row items-center">
          <span className="text-sm">{i18n._(t`Order Expiration`)}:</span>
          <QuestionHelper text={i18n._(t`Expiration is the time at which the order will become invalid`)} />
        </div>
        <NeonSelect value={orderExpiration.label}>
          {Object.entries(items).map(([k, v]) => (
            <NeonSelectItem key={k} value={k} onClick={handler}>
              {v}
            </NeonSelectItem>
          ))}
        </NeonSelect>
      </div>
    </>
  )
}

export default OrderExpirationDropdown
