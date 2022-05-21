// Bootstrap...

import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'
import { parseUnits } from '@ethersproject/units'
import { Integrations } from '@sentry/tracing'
import { Fraction } from 'app/entities/bignumber'
import React from 'react'

import * as Sentry from './sentry'
import { BrowserTracing } from "@sentry/tracing";

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render')

  // See https://github.com/welldone-software/why-did-you-render#options
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackHooks: true,
    logOwnerReasons: true,
    collapseGroups: true,
  })
}

BigNumber.prototype.mulDiv = function (multiplier: BigNumberish, divisor: BigNumberish): BigNumber {
  // console.log('mulDiv', multiplier, divisor)
  return BigNumber.from(divisor).gt(0) ? BigNumber.from(this).mul(multiplier).div(divisor) : Zero
}

BigNumber.prototype.toFraction = function (decimals: BigNumberish = 18): Fraction {
  return Fraction.from(this, decimals ? BigNumber.from(10).pow(decimals) : Zero)
}

BigNumber.prototype.toFixed = function (decimals: BigNumberish = 18, maxFractions: BigNumberish = 8): string {
  return this.toFraction(decimals, 10).toString(BigNumber.from(maxFractions).toNumber())
}

String.prototype.toBigNumber = function (decimals: BigNumberish): BigNumber {
  try {
    return parseUnits(this as string, decimals)
  } catch (error) {
    console.debug(`Failed to parse input amount: "${this}"`, error)
  }
  return BigNumber.from(0)
}

BigNumber.prototype.min = function (...values: BigNumberish[]): BigNumber {
  let lowest = BigNumber.from(values[0])
  for (let i = 1; i < values.length; i++) {
    const value = BigNumber.from(values[i])
    if (value.lt(lowest)) {
      lowest = value
    }
  }
  return lowest
}

BigNumber.prototype.max = function (...values: BigNumberish[]): BigNumber {
  let highest = BigNumber.from(values[0])
  for (let i = 1; i < values.length; i++) {
    const value = BigNumber.from(values[i])
    if (value.gt(highest)) {
      highest = value
    }
  }
  return highest
}

export const initializeSentry = (): void => {
	return Sentry.init({
        dsn: 'https://b3d1f140b36f441da22791ca98210c95@o1029417.ingest.sentry.io/6052500',
        integrations: [new Integrations.BrowserTracing()],
        tracesSampleRate: 1.0,
        release: 'sushiswap-interface@2022.05.21',
	});
};

export const DNT = DO_NOT_TRACK_ENABLED;

export async function logError(err: Error) {
  sentry.captureException(err);

  if (window.console && console.error) console.error(err);
}
