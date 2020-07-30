import { useEffect, useRef, useCallback, useContext } from 'react'
import debounce from 'lodash/debounce'
import get from 'lodash/get'

import { useFormState } from 'react-final-form'

import usePreviousValue from './use-previous-value'

import { ValuesSubscriptionControllerContext } from './values-subscription-controller'

import { DEFAULT_IDENTIFIER_KEY, DEFAULT_ON_CHANGE_DEBOUNCE } from './constants'

type ValuesSubscriptionConfigArgs = {
  silencedFieldNames?: string[]
  /* This property is needed to identify an object uniquely. 
     For example, if subscription values is an array item, onChange callback must not be fired when it's deleted.
     It's not possible to rely on subscription path (index).
   */
  identifierKey?: string
}

export type UseValuesSubscriptionArgs = {
  subscriptionPath: string
  onChange: (values: any) => void
  onChangeDebounce?: number
  config?: ValuesSubscriptionConfigArgs
}

const subscriptionFieldsValuesChanged = (
  subscriptionValues: any,
  previousSubscriptionValues: any,
  subscriptionFields: string[]
) => {
  return subscriptionFields.some((subscriptionField) => {
    return (
      get(subscriptionValues, subscriptionField) !==
      get(previousSubscriptionValues, subscriptionField)
    )
  })
}

const getSubscriptionFields = (
  subscriptionValues: any = {},
  config?: ValuesSubscriptionConfigArgs
) => {
  const subscriptionFields = Object.keys(subscriptionValues)

  if (config?.silencedFieldNames) {
    return subscriptionFields.filter(
      (subscriptionField) =>
        !config.silencedFieldNames?.includes(subscriptionField)
    )
  }

  return subscriptionFields
}

const subscriptionValuesChanged = (
  subscriptionValues: any,
  previousSubscriptionValues: any,
  config?: ValuesSubscriptionConfigArgs
) => {
  if (subscriptionValues === previousSubscriptionValues) {
    return false
  }

  const identifierKey =
    config?.identifierKey || DEFAULT_IDENTIFIER_KEY
  return (
    get(subscriptionValues, identifierKey) ===
    get(previousSubscriptionValues, identifierKey)
  )
}

const useValuesSubscription = ({
  subscriptionPath,
  onChange,
  onChangeDebounce = DEFAULT_ON_CHANGE_DEBOUNCE,

  config
}: UseValuesSubscriptionArgs) => {
  const firstRender = useRef(true)
  const { values } = useFormState({ subscription: { values: true } })

  const subscriptionValues = get(values, subscriptionPath)
  const previousSubscriptionValues = usePreviousValue(subscriptionValues)
  const debouncedOnChange = useCallback(debounce(onChange, onChangeDebounce), [
    onChange
  ])

  const { subscriptionsPaused } = useContext(
    ValuesSubscriptionControllerContext
  )

  useEffect(() => {
    if (subscriptionsPaused) {
      return
    }

    if (firstRender.current) {
      firstRender.current = false
    } else if (
      subscriptionValuesChanged(
        subscriptionValues,
        previousSubscriptionValues,
        config
      )
    ) {
      const subscriptionFields = getSubscriptionFields(
        subscriptionValues,
        config
      )
      const previousSubscriptionFields = getSubscriptionFields(
        previousSubscriptionValues,
        config
      )

      // Final form state doesn't store null or empty values, it removes the key instead
      if (subscriptionFields.length !== previousSubscriptionFields.length) {
        debouncedOnChange(subscriptionValues)
      }

      if (
        subscriptionFieldsValuesChanged(
          subscriptionValues,
          previousSubscriptionValues,
          subscriptionFields
        )
      ) {
        debouncedOnChange(subscriptionValues)
      }
    }
  }, [
    subscriptionValues,
    previousSubscriptionValues,
    config,
    subscriptionsPaused,
    debouncedOnChange
  ])
}

export default useValuesSubscription
