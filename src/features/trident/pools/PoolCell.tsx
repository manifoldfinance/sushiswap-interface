import React, { FC } from 'react'
import { useCurrency } from '../../../hooks/Tokens'
import CurrencyLogo from '../../../components/CurrencyLogo'
import rssSVG from '../../../../public/rss.svg'
import Image from 'next/image'

const CurrencyLogoWrapper: FC<{ currencyId: string }> = ({ currencyId }) => {
  const currency = useCurrency(currencyId)
  return (
    <div className="-ml-2">
      <CurrencyLogo className="rounded-full" currency={currency} size={40} />
    </div>
  )
}

interface PoolCellProps {
  currencyIds: string[]
  symbols: string[]
  twapEnabled: boolean
}

export const PoolCell: FC<PoolCellProps> = ({ symbols, currencyIds, twapEnabled }) => {
  return (
    <>
      <div className="flex items-center gap-2">
        <div className="flex ml-2">
          {currencyIds.map((id, i) => (
            <CurrencyLogoWrapper key={i} currencyId={id} />
          ))}
        </div>
        <div className="text-high-emphesis font-bold">{symbols.join('-')}</div>
        {twapEnabled && (
          <div className="w-3.5">
            <Image src={rssSVG} alt="rss icon" layout="responsive" />
          </div>
        )}
      </div>
    </>
  )
}