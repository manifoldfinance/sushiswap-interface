import React, { FC } from 'react'
import Typography from '../_app/Default/Header/Web3Network/NetworkModal/ModalHeader/Typography'
import { useDerivedInariState } from '../_app/bootstrap/Fraction/functions/contract/validate/hooks/state/reducer/state-inari-reducer/actions/types/useBentoBoxTrait/hooks'

interface InariHeaderProps {}

const InariDescription: FC<InariHeaderProps> = () => {
  const { general } = useDerivedInariState()

  return (
    <div className="grid gap-2">
      <Typography variant="lg" className="text-high-emphesis" weight={700}>
        {general?.name}
      </Typography>
      <Typography>{general?.description}</Typography>
    </div>
  )
}

export default InariDescription
