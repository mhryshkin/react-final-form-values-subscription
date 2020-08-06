# react-final-form-values-subscription

A component to subscribe to any values of react final form in declarative way.

## Installation

Install from npm:

```bash
$ npm install react-final-form-values-subscription --save
```

## The problem

Let's suppose there are some values in a final form state with the following shape:

```json
{
  "firstName": "Tam",
  "lastName": "Richard",
  "employeeID": 896586,
  "designation": "Senior Manager",
  "languageExpertise": [
    {
      "name": "JavaScript"
    },
    {
      "name": "C#"
    }
  ],
  "car": {
    "model": "Hyundai Verna",
    "makeYear": 2015,
    "color": "Black",
    "type": "Sedan"
  }
}
```

and you want to subscribe to some part of values such as objects, array elements or specific field values to perform a granular update, for example.
Final Form field allows to subscribe only to one field value by specifying path to the field, for instance 'car.type' or 'languageExpertise[0].name'.

You might end up with something like this:

```jsx
const FormSpyFieldValues = ({ children, fieldNames }: Props) =>
  fieldNames.reduce(
    (acc, fieldName) => (values) => (
      <Field name={fieldName} subscription={{ value: true }}>
        {({ input: { value } }) => acc({ ...values, [fieldName]: value })}
      </Field>
    ),
    children
  )

const App = () => (
  <FormSpyFieldValues
    fieldNames={[
      'car.type',
      'car.makeYear',
      'car.color',
      'car.type',
      'languageExpertise[0].name'
    ]}
  >
    {(values) => <div>{values[field1]}</div>}
  </FormSpyFieldValues>
)
```

But this approach has an obvious number of drawbacks:

- necessity to pass path to a field rather than just path to an object
- every field name would mean a separate subscription which might be too expensive
- no possibility to disable or enable subscriptions if needed

This package solves the problems listed above by providing a few components which help to subscribe to values and control subscriptions,
do it fast, declaratively and in React way.

## Usage

The are two ways to subscribe to react final form values: with hook and with render props component.
Each of them must be used inside Final Form component.

### Usage with hook

```jsx
import { useValuesSubscription } from 'react-final-form-values-subscription'

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

const App = () => (
  <ReactFinalForm
    onSubmit={onSubmit}
    subscription={{}}
    initialValues={initialValues}
  >
    {() => <Car />}
  </ReactFinalForm>
)
```

### Usage with render props component

```jsx
import { ValuesSubscription } from 'react-final-form-values-subscription'

const App = () => (
  <ReactFinalForm
    onSubmit={onSubmit}
    subscription={{}}
    initialValues={initialValues}
  >
    {() => (
      <ValuesSubscription subscriptionPath='car' onChange={onCarInfoChange}>
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
      </ValuesSubscription>
    )}
  </ReactFinalForm>
)
```

Values Subscription is just a render props wrapper and uses useValuesSubscription thus they have the same options

## Options

| Option           |  Type  | Required | Default | Description                                                                 |
| :--------------- | :----: | :------: | :-----: | --------------------------------------------------------------------------- |
| subscriptionPath | String |    +     |    -    | Path to value, object or an array element you want to subscribe             |
| onChange         |  func  |    +     |    -    | `function (newValues) {}` callback for when subscription values are changed |
| onChangeDebounce | number |    -     |   200   | debounce for onChange callback                                              |
| config           | Config |    -     |  null   |                                                                             |

## Config Options

| Option             |      Type       | Required | Default | Description                                                                                                                                                                   |
| :----------------- | :-------------: | :------: | :-----: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| silencedFieldNames | Array of String |    -     |    -    | Change of a fieldName won't fire onChange callback, might be useful when subscribing to object partially                                                                      |
| identifierKey      |     String      |    -     |  'id'   | Field name of key. Think of it as `key` in React, if you subscribe to an array element it must be identified to prevent firing onChange when deleting, index is not reliable. |

### Values Subscription Controller

Sometimes it is might be necessary to pause subscriptions while doing some form state mutations.
Values Subscription Controller is a render prop component which provides `controller` to manipulate subscriptions, currently it supports only
`pauseSubscription` functionality.

**_Values Subscription controller affects only children subscriptions, you can have as many controllers as you need_**

```jsx
const App = () => (
  <ReactFinalForm
    onSubmit={onSubmit}
    subscription={{}}
    initialValues={initialValues}
  >
    {({ form }) => (
      <ValuesSubscriptionController>
        {(subscriptionController) => (
          <ValuesSubscription subscriptionPath='car' onChange={onCarInfoChange}>
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
            <button
              onClick={() => {
                subscriptionController.pauseSubscriptions(() => {
                  // all form values changes which are made in pauseSubscription don't trigger onInfoCarChange
                  form.change('car.makeYear', '')
                })
              }}
            >
              pause subscriptions
            </button>
          </ValuesSubscription>
        )}
      </ValuesSubscriptionController>
    )}
  </ReactFinalForm>
)
```
