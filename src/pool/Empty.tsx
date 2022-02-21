import React, { FC } from 'react'

import { classNames } from '../_app/bootstrap/Fraction/functions/styling'

const Empty: FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '' }) => (
  <div className={classNames('flex flex-col justify-center items-center py-4 px-3 rounded min-h-empty', className)}>
    {children}
  </div>
)

export default Empty
