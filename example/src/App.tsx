import React from 'react'

import {
  Form as ReactFinalForm,
  Field as ReactFinalFormField
} from 'react-final-form'

import ValuesSubscription, {
  useValuesSubscription
} from 'react-final-form-values-subscription'

const initialValues = {}
const onSubmit = () => {}

const onCarInfoChange = () => {}

const Car = () => {
  useValuesSubscription({ subscriptionPath: 'car', onChange: onCarInfoChange })

  return (
    <>
      <ReactFinalFormField name='car.makeYear'>
        {({ input }) => (
          <input
            value={input.value}
            type='text'
            onChange={input.onChange}
          ></input>
        )}
      </ReactFinalFormField>
      <ReactFinalFormField name='car.color'>
        {({ input }) => (
          <input
            value={input.value}
            type='text'
            onChange={input.onChange}
          ></input>
        )}
      </ReactFinalFormField>
    </>
  )
}

const App = () => {
  return (
    <ReactFinalForm
      onSubmit={onSubmit}
      subscription={{}}
      initialValues={initialValues}
    >
      {() => <Car />}
    </ReactFinalForm>
  )
}

export default App
