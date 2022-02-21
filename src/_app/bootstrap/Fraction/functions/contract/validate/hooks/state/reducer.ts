import application from './reducer/reducer'
import burn from './reducer/state-burn-reducer'
import { combineReducers } from '@reduxjs/toolkit'
import create from './reducer/state-create-reducer'
import limitOrder from './reducer/state-limit-order-reducer'
import lists from './reducer/state-lists-reducer'
import mint from './reducer/state-mint-reducer'
import multicall from './reducer/state-multicall-reducer'
import swap from './reducer/state-swap-reducer'
import transactions from './reducer/state-transactions-reducer'
import user from './reducer/state-user-reducer'
import zap from './reducer/state-zap-reducer'
import inari from './reducer/state-inari-reducer'

const reducer = combineReducers({
  application,
  user,
  transactions,
  swap,
  mint,
  burn,
  multicall,
  lists,
  zap,
  limitOrder,
  create,
  inari,
})

export default reducer
