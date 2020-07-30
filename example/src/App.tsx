import React from 'react'

import {
  Form as ReactFinalForm,
  Field as ReactFinalFormField
} from 'react-final-form'

import ValuesSubscription, {
  ValuesSubscriptionController
} from 'react-final-form-values-subscription'

const App = () => {
  return (
    <ReactFinalForm
      onSubmit={() => {}}
      subscription={{}}
      initialValues={{
        data: {
          test: '222',
          test1: '2323'
        }
      }}
    >
      {({ form }) => {
        return (
          <ValuesSubscriptionController>
            {(controller) => {
              return (
                <ValuesSubscription
                  subscriptionPath='data'
                  onChange={(newValues) => console.log(newValues)}
                >
                  <ReactFinalFormField name='data.test'>
                    {({ input }) => {
                      return (
                        <>
                          <input
                            value={input.value}
                            type='text'
                            onChange={input.onChange}
                          ></input>
                        </>
                      )
                    }}
                  </ReactFinalFormField>
                  <button
                    onClick={() => {
                      controller.pauseSubscriptions(() => {
                        form.change('data.test', 'some')
                      })
                    }}
                  >
                    {' '}
                    pause subscriptions{' '}
                  </button>
                </ValuesSubscription>
              )
            }}
          </ValuesSubscriptionController>
        )
      }}
    </ReactFinalForm>
  )
}

export default App
