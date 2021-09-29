import React, { FC } from 'react'
import {
  attemptingTxnAtom,
  outputToWalletAtom,
  poolAtom,
  showReviewAtom,
  spendFromWalletAtom,
} from '../../context/atoms'
import ListPanel from '../../../../components/ListPanel'
import { useRecoilState, useRecoilValue } from 'recoil'
import Typography from '../../../../components/Typography'
import { t } from '@lingui/macro'
import Divider from '../../../../components/Divider'
import { useLingui } from '@lingui/react'
import HeadlessUIModal from '../../../../components/Modal/HeadlessUIModal'
import Button from '../../../../components/Button'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import useZapPercentageInput from '../../context/hooks/useZapPercentageInput'
import { useClassicZapRemoveExecute } from '../../context/hooks/useClassicZapRemoveExecute'
import { usePoolDetailsRemove } from '../../context/hooks/usePoolDetails'

interface RemoveTransactionReviewZapModal {}

const RemoveTransactionReviewZapModal: FC<RemoveTransactionReviewZapModal> = () => {
  const { i18n } = useLingui()
  const [, pool] = useRecoilValue(poolAtom)

  const { parsedOutputAmount, parsedSLPAmount } = useZapPercentageInput()
  const { currentLiquidityValue, liquidityValue, currentPoolShare, poolShare } = usePoolDetailsRemove(parsedSLPAmount)
  const [showReview, setShowReview] = useRecoilState(showReviewAtom)
  const outputToWallet = useRecoilValue(outputToWalletAtom)
  const attemptingTxn = useRecoilValue(attemptingTxnAtom)

  const { execute } = useClassicZapRemoveExecute()

  return (
    <HeadlessUIModal.Controlled isOpen={showReview} onDismiss={() => setShowReview(false)}>
      <div className="flex flex-col gap-8 h-full">
        <div className="relative">
          <div className="pointer-events-none absolute w-full h-full bg-gradient-to-r from-opaque-blue to-opaque-pink opacity-20" />
          <div className="px-5 pt-5 pb-8 flex flex-col gap-4">
            <div className="flex flex-row justify-between">
              <Button
                color="blue"
                variant="outlined"
                size="sm"
                className="rounded-full py-1 pl-2 cursor-pointer"
                startIcon={<ChevronLeftIcon width={24} height={24} />}
                onClick={() => setShowReview(false)}
              >
                {i18n._(t`Back`)}
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              <Typography variant="h2" weight={700} className="text-high-emphesis">
                {i18n._(t`Confirm Withdrawal`)}
              </Typography>
              <Typography variant="sm">
                {i18n._(t`Output is estimated. If the price changes by more than 0.5% your transaction will revert.`)}
              </Typography>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 px-5">
            <Typography weight={700} variant="lg">
              {i18n._(t`Which will be converted to...`)}
            </Typography>
            <ListPanel items={[<ListPanel.CurrencyAmountItem amount={parsedOutputAmount} key={0} />]} />
          </div>
          <div className="flex flex-row justify-between px-5">
            <Typography weight={700} variant="lg">
              {i18n._(t`...and deposited to your:`)}
            </Typography>
            <Typography weight={700} variant="lg" className="text-high-emphesis">
              {outputToWallet ? i18n._(t`Wallet`) : i18n._(t`BentoBox`)}
            </Typography>
          </div>
        </div>
        <div className="flex flex-col px-5 gap-5">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <Typography variant="sm">{i18n._(t`Rates:`)}</Typography>
              <Typography variant="sm" className="text-right">
                1 {pool?.token0?.symbol} = {pool?.token1Price?.toSignificant(6)} {pool?.token1?.symbol}
              </Typography>
            </div>
            <div className="flex justify-end">
              <Typography variant="sm" className="text-right">
                1 {pool?.token1?.symbol} = {pool?.token0Price?.toSignificant(6)} {pool?.token0?.symbol}
              </Typography>
            </div>
          </div>
          <Divider />
          <div className="flex flex-col gap-1">
            {currentLiquidityValue.map((currentLiquidityValue, index) => (
              <div className="flex justify-between" key={index}>
                <Typography variant="sm" className="text-secondary">
                  {i18n._(t`${currentLiquidityValue?.currency.symbol} Deposited:`)}
                </Typography>
                <Typography variant="sm" weight={700} className="text-high-emphesis text-right">
                  {currentLiquidityValue?.toSignificant(6)} →{' '}
                  {liquidityValue[index] ? liquidityValue[index].toSignificant(6) : '0.000'}
                  {currentLiquidityValue?.currency?.symbol}
                </Typography>
              </div>
            ))}
            <div className="flex justify-between">
              <Typography variant="sm" className="text-secondary">
                {i18n._(t`Share of Pool`)}
              </Typography>
              <Typography weight={700} variant="sm" className="text-high-emphesis text-right">
                {'<'} {currentPoolShare?.greaterThan(0) ? currentPoolShare?.toSignificant(6) : '0.000'} →{' '}
                <span className="text-green">{poolShare?.toSignificant(6) || '0.000'}%</span>
              </Typography>
            </div>
          </div>
          <Button disabled={attemptingTxn} color="gradient" size="lg" onClick={execute}>
            <Typography variant="sm" weight={700} className="text-high-emphesis">
              {i18n._(t`Confirm Withdrawal`)}
            </Typography>
          </Button>

          {/*spacer*/}
          <span />
        </div>
      </div>
    </HeadlessUIModal.Controlled>
  )
}

export default RemoveTransactionReviewZapModal