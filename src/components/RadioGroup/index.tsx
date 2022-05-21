import { RadioGroup as HeadlessRadioGroup } from '@headlessui/react'
import { ComponentProps } from 'react'

import { classNames } from 'app/functions'
import Typography from '../Typography'

// @ts-ignore
const RadioGroup = (props: ComponentProps<typeof HeadlessRadioGroup>) => {
  // @ts-ignore
  return <HeadlessRadioGroup {...props} />
}

// @ts-ignore
RadioGroup.Option = ({
  // @ts-ignore
  value,
  // @ts-ignore
  children,
  // @ts-ignore
  className = 'space-y-3.5',
  // @ts-ignore
}: ComponentProps<typeof HeadlessRadioGroup.Option>) => {
  return (
    <HeadlessRadioGroup.Option // @ts-ignore
value={value} className={classNames('outline-none', className)}>
      {({ checked }) => (
        <>
          <div className="flex items-center text-sm cursor-pointer gap-3.5">
            <div className="min-h-6 min-w-6">
              <span
                className={classNames(
                  checked ? 'bg-gradient-to-r from-blue to-pink' : 'border border-dark-700 bg-dark-800',
                  'h-6 w-6 rounded-full flex items-center justify-center'
                )}
                aria-hidden="true"
              >
                {checked && <span className="rounded-full bg-white w-2.5 h-2.5" />}
              </span>
            </div>
            <HeadlessRadioGroup.Label as="span">
              <Typography className="text-high-emphesis" weight={checked ? 700 : 400}>
                {children}
              </Typography>
            </HeadlessRadioGroup.Label>
          </div>
        </>
      )}
    </HeadlessRadioGroup.Option>
  )
}

export default RadioGroup
