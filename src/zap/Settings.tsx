import { ChainId, Percent } from '@sushiswap/sdk'
import React, { useRef, useState } from 'react'
import {
  useExpertModeManager,
  useUserArcherUseRelay,
  useUserSingleHopOnly,
  useUserTransactionTTL,
  useUserOpenMevRelay,
} from '../_app/bootstrap/Fraction/functions/contract/validate/hooks/state/reducer/state-inari-reducer/actions/types/useBentoBoxTrait/hooks/useStakeSushiToBentoStrategy/hooks/Tokens/hooks'
import { useModalOpen, useToggleSettingsMenu } from '../_app/bootstrap/Fraction/functions/contract/validate/hooks/state/reducer/state-inari-reducer/actions/types/useBentoBoxTrait/hooks/useStakeSushiToBentoStrategy/hooks/Tokens/hooks/hooks'

import { AdjustmentsIcon } from '@heroicons/react/outline'
import { ApplicationModal } from '../_app/bootstrap/Fraction/functions/contract/validate/hooks/state/reducer/reducer/actions'
import Button from '../_app/Default/Header/Web3Status/WalletModal/AccountDetails/Button'
import Modal from '../_app/Default/Header/Web3Network/NetworkModal/Modal'
import ModalHeader from '../_app/Default/Header/Web3Network/NetworkModal/ModalHeader'
import QuestionHelper from '../_app/Default/Header/QuestionHelper'
import Toggle from './Settings/Toggle'
import TransactionSettings from './Settings/TransactionSettings'
import Typography from '../_app/Default/Header/Web3Network/NetworkModal/ModalHeader/Typography'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../_app/bootstrap/Fraction/functions/contract/validate/hooks/state/reducer/state-inari-reducer/actions/types/useBentoBoxTrait/hooks/useStakeSushiToBentoStrategy/hooks-index'
import { useLingui } from '@lingui/react'
import { useOnClickOutside } from './CurrencyInputPanel/CurrencySearchModal/CurrencySearch/useOnClickOutside'

import { OPENMEV_SUPPORTED_NETWORKS } from '../_app/bootstrap/Fraction/functions/contract/validate/hooks/state/reducer/state-user-reducer/constants'

export default function SettingsTab({ placeholderSlippage }: { placeholderSlippage?: Percent }) {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()

  const node = useRef<HTMLDivElement>(null)
  const open = useModalOpen(ApplicationModal.SETTINGS)
  const toggle = useToggleSettingsMenu()

  const [expertMode, toggleExpertMode] = useExpertModeManager()

  const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()

  // show confirmation view before turning on
  const [showConfirmation, setShowConfirmation] = useState(false)

  useOnClickOutside(node, open ? toggle : undefined)

  const [ttl, setTtl] = useUserTransactionTTL()

  const [userUseArcher, setUserUseArcher] = useUserArcherUseRelay()

  const [userUseOpenMev, setUserUseOpenMev] = useUserOpenMevRelay()

  return (
    <div className="relative flex" ref={node}>
      <div
        className="flex items-center justify-center w-8 h-8 rounded cursor-pointer"
        onClick={toggle}
        id="open-settings-dialog-button"
      >
        <AdjustmentsIcon className="w-[26px] h-[26px] transform rotate-90" />
      </div>
      {open && (
        <div className="absolute top-14 right-0 z-50 -mr-2.5 min-w-20 md:m-w-22 md:-mr-5 bg-dark-900 border-2 border-dark-800 rounded w-80 shadow-lg">
          <div className="p-4 space-y-4">
            <Typography weight={700} className="text-high-emphesis">
              {i18n._(t`Transaction Settings`)}
            </Typography>

            <TransactionSettings placeholderSlippage={placeholderSlippage} />

            <Typography className="text-high-emphesis" weight={700}>
              {i18n._(t`Interface Settings`)}
            </Typography>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Typography variant="sm" className="text-primary">
                  {i18n._(t`Toggle Expert Mode`)}
                </Typography>
                <QuestionHelper
                  text={i18n._(t`Bypasses confirmation modals and allows high slippage trades. Use at your own risk.`)}
                />
              </div>
              <Toggle
                id="toggle-expert-mode-button"
                isActive={expertMode}
                toggle={
                  expertMode
                    ? () => {
                        toggleExpertMode()
                        setShowConfirmation(false)
                      }
                    : () => {
                        toggle()
                        setShowConfirmation(true)
                      }
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Typography variant="sm" className="text-primary">
                  {i18n._(t`Disable Multihops`)}
                </Typography>
                <QuestionHelper text={i18n._(t`Restricts swaps to direct pairs only.`)} />
              </div>
              <Toggle
                id="toggle-disable-multihop-button"
                isActive={singleHopOnly}
                toggle={() => (singleHopOnly ? setSingleHopOnly(false) : setSingleHopOnly(true))}
              />
            </div>
            {chainId == ChainId.MAINNET && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Typography variant="sm" className="text-primary">
                    {i18n._(t`ArcherDAO`)}
                  </Typography>
                  <QuestionHelper
                    text={i18n._(
                      t`Send transaction privately to avoid front-running and sandwich attacks. Requires a miner tip to incentivize miners`
                    )}
                  />
                </div>
                {/** @openmev UI Toggle */}
                <Toggle
                  id="toggle-use-archer"
                  isActive={userUseArcher}
                  toggle={() => {
                    if (userUseOpenMev) setUserUseOpenMev(false)
                    setUserUseArcher(!userUseArcher)
                  }}
                />
              </div>
            )}
            {OPENMEV_SUPPORTED_NETWORKS.includes(chainId) && (
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Typography variant="sm" className="text-primary">
                    {i18n._(t`OpenMEV Gas Refunder`)}
                  </Typography>
                  <QuestionHelper text={i18n._(t`OpenMEV refunds up to 95% of transaction costs in 35 blocks`)} />
                </div>
                <Toggle
                  id="toggle-use-openmev"
                  isActive={userUseOpenMev}
                  toggle={() => {
                    if (userUseArcher) setUserUseArcher(false)
                    setUserUseOpenMev(!userUseOpenMev)
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      <Modal isOpen={showConfirmation} onDismiss={() => setShowConfirmation(false)}>
        <div className="space-y-4">
          <ModalHeader title={i18n._(t`Are you sure?`)} onClose={() => setShowConfirmation(false)} />
          <Typography variant="lg">
            {i18n._(t`Expert mode turns off the confirm transaction prompt and allows high slippage trades
                                that often result in bad rates and lost funds.`)}
          </Typography>
          <Typography variant="sm" className="font-medium">
            {i18n._(t`ONLY USE THIS MODE IF YOU KNOW WHAT YOU ARE DOING.`)}
          </Typography>
          <Button
            color="red"
            size="lg"
            onClick={() => {
              // if (window.prompt(i18n._(t`Please type the word "confirm" to enable expert mode.`)) === 'confirm') {
              //   toggleExpertMode()
              //   setShowConfirmation(false)
              // }
              toggleExpertMode()
              setShowConfirmation(false)
            }}
          >
            <Typography variant="lg" id="confirm-expert-mode">
              {i18n._(t`Turn On Expert Mode`)}
            </Typography>
          </Button>
        </div>
      </Modal>
    </div>
  )
}
