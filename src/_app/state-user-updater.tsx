import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from './bootstrap/Fraction/functions/contract/validate/hooks/state'
import { updateMatchesDarkMode } from './bootstrap/Fraction/functions/contract/validate/hooks/state/reducer/state-user-reducer/actions'

export default function Updater(): null {
  const dispatch = useDispatch<AppDispatch>()

  // keep dark mode in sync with the system
  useEffect(() => {
    const darkHandler = (match: MediaQueryListEvent) => {
      dispatch(updateMatchesDarkMode({ matchesDarkMode: match.matches }))
    }

    const match = window?.matchMedia('(prefers-color-scheme: dark)')
    dispatch(updateMatchesDarkMode({ matchesDarkMode: match.matches }))

    if (match?.addListener) {
      match?.addListener(darkHandler)
    } else if (match?.addEventListener) {
      match?.addEventListener('change', darkHandler)
    }

    return () => {
      if (match?.removeListener) {
        match?.removeListener(darkHandler)
      } else if (match?.removeEventListener) {
        match?.removeEventListener('change', darkHandler)
      }
    }
  }, [dispatch])

  return null
}
