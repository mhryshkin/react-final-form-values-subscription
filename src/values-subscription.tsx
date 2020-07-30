import React, { FunctionComponent, ReactNode } from 'react'

import useValuesSubscription, {
  UseValuesSubscriptionArgs
} from './use-values-subscription'

type ValuesSubscriptionProps = {
  children: ReactNode
} & UseValuesSubscriptionArgs

const ValuesSubscription: FunctionComponent<ValuesSubscriptionProps> = ({
  children,
  ...otherProps
}) => {
  useValuesSubscription(otherProps)

  return <React.Fragment>{children}</React.Fragment>
}

export default React.memo(ValuesSubscription)
