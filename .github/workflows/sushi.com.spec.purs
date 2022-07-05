module Spec where

import Quickstrom
import Data.Foldable (any)
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Data.String.CodeUnits (contains)
import Data.String.Pattern (Pattern(..))

readyWhen = "body"

actions = [ 
  Tuple 1 (Single $ Click "a[href^='/']")
]

patterns = [ "404", "500" ]

hasErrorCode = any (\x -> contains (Pattern x) pageText) patterns

pageText :: String
pageText = maybe "" _.textContent (queryOne "body" { textContent })

proposition = always (not hasErrorCode)
