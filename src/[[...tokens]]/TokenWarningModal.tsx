import React, { useCallback } from 'react'

import { ImportToken } from '../zap/CurrencyInputPanel/CurrencySearchModal/ImportToken'
import Modal from '../_app/Default/Header/Web3Network/NetworkModal/Modal'
import { Token } from '@sushiswap/sdk'

export default function TokenWarningModal({
  isOpen,
  tokens,
  onConfirm,
}: {
  isOpen: boolean
  tokens: Token[]
  onConfirm: () => void
}) {
  const handleDismiss = useCallback(() => null, [])

  return (
    <Modal isOpen={isOpen} onDismiss={handleDismiss} maxHeight={90}>
      <ImportToken tokens={tokens} handleCurrencySelect={onConfirm} />
    </Modal>
  )
}
