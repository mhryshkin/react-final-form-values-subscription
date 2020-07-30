import React, { ReactNode } from 'react'

const defaultValue = {
  subscriptionsPaused: false
}

export const ValuesSubscriptionControllerContext = React.createContext(
  defaultValue
)

export type ValuesSubscriptionControllerType = {
  pauseSubscriptions: (callback: () => void | Promise<void>) => void
}

type ValuesSubscriptionControllerProps = {
  children: (controller: ValuesSubscriptionControllerType) => ReactNode
}

type ValuesSubscriptionControllerState = {
  subscriptionsPaused: boolean
}

class ValuesSubscriptionController extends React.PureComponent<
  ValuesSubscriptionControllerProps,
  ValuesSubscriptionControllerState
> {
  controller: ValuesSubscriptionControllerType

  constructor(props: ValuesSubscriptionControllerProps) {
    super(props)

    this.state = {
      subscriptionsPaused: defaultValue.subscriptionsPaused
    }

    this.controller = {
      pauseSubscriptions: this.pauseSubscriptions
    }
  }

  pauseSubscriptions = (callback: () => void | Promise<void>) => {
    this.setState({ subscriptionsPaused: true }, () => {
      setTimeout(async () => {
        await Promise.resolve(callback())
        this.setState({ subscriptionsPaused: false })
      })
    })
  }

  render() {
    const { children } = this.props
    const { subscriptionsPaused } = this.state

    return (
      <ValuesSubscriptionControllerContext.Provider
        value={{ subscriptionsPaused }}
      >
        {children(this.controller)}
      </ValuesSubscriptionControllerContext.Provider>
    )
  }
}

export default ValuesSubscriptionController
