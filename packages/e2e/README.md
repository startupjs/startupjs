# Testing

For e2e testing on mobile platforms, uses the [Detox](https://github.com/wix/Detox) library and test-runner [Jest](https://jestjs.io/)

## Running tests

To run the commands `@startupjs/e2e`, you need to globally install `detox-cli` - `npm i detox-cli -g`


To run testing locally, you need to run the following commands:
- `npx statrupjs test --init` - will create the necessary configuration files for Detox in the root of the project (folder e2e, .detoxrc.js, .env.detox)
- `npx statrupjs test --build` - build the iOS application (required in the first times or after installing new packages)
- `npx statrupjs test --ios` - will run the tests in the iOS simulator. (with the flag `--artifacts` during tests, screenshots of the application will appear during tests in the folder `/artifacts`)

## Writing tests

First of all, you need to read the [API Detox documentation](https://github.com/wix/Detox/tree/master/docs#api-reference). All standard test commands can be found in this docs.

### Creating a file with tests

At the `e2e` folder, create a file `* .e2e.js` and add a minimal template to it:

```js
describe('Example', () => {
  it('should visible button', async () => {
    await x('#button').toBeVisible()
  })
})
```

### testID

detox can find elements by `id` like in traditional` html`. To assign an `id` to a component, pass it the` testID` props with the `id` value. For example:

```pug
Button(
  testID='confirmButton'
  onPress=() => console.log('confirm')
) Confirm
```

This way we can find the given component by `x('# confirmButton')`.

### Function `x`

To select the required component in the application, the `x` function is used, it can take the following values:
- Search by `testID` - must start with`#`, for example:`x('# myButton')`
- Text search - must start with `=`, for example: `x ('= Subscribe')`
- Search by type - just the name of the type, for example: `x('UIPickerView')` for `Select`

This feature simplifies interaction with the Detox API. It completely replaces the functions of searching for an element in the project.

Also `x` supports searching for nested elements. For example, we have a component with the text `Test text`, which is nested within a component with `testID = 'parentComponent'`:

```pug
Div(testID='parentComponent')
  Span Test text
```

Then to get the component `Span Test text` we need to call `x` as follows:

```js
await x('#parentComponent ="Test text"')
```

This is extremely useful in situations where the same nested elements have different parents. For example:

```pug
Div(testID='grandParent')
  Div(testID='parentComponent1')
    Span Test text
  Div(testID='parentComponent2')
    Span Test text
```

In this case, we have the same text in different parents. To get the `Span`, which is nested in` parentComponent2`, use:

```js
await x('#parentComponent2 ="Test text"')
```

# Actions

After we have found the element, we can apply some actions to it. For example, click on it, enter text, and so on. All available actions on the element can be seen in the [relevant section of the Detox documentation](https://github.com/wix/Detox/blob/master/docs/APIRef.ActionsOnElement.md).

Let's take a look at a few basic steps to understand how they work.

## .tap()
`.tap ()` allows you to click on an element. That is, in order to check the work, for example, of a button, you must click on it and so on. It is important to remember that this action can be applied to any element. Let's say we have a form that contains two buttons (accept and dismiss):

```pug
Div(testID='userForm')
  // any code
  Button(
    testID='acceptButton'
    onPress=() => console.log('accept')
  ) Accept
  Button(
    testID='dismissButton'
    onPress=() => console.log('dismiss')
  ) Dismiss
```

In order to check the behavior of the application after clicking on the `Accept` button, you need to do the following:
1. Find the element that matches the button `Accept`
2. Call the `.tap` method on it.

```js
await x('#acceptButton').tap()
```

Thus, we have made a click on the `Accept` button.

## .typeText(text)
`.typeText (text)` allows you to enter text into an element. This is necessary to check the completion of the input fields. Let's say we have a form that contains input fields:

```pug
Div(testID='userForm')
  TextInput(
    testID='userNameInput'
    label='Name'
    value=userName
    onChangeText=setUserName
  )
  TextInput(
    testID='userSurnameInput'
    label='Surname'
    value=userSurname
    onChangeText=setUserSurname
  )
```

Let's fill in the water fields `Name` and `Surname`.

```js
await x('#userNameInput').typeText('Harry')
await x('#userSurnameInput').typeText('Potter')
```

## .scroll(offset, direction, startPositionX, startPositionY)
Scrolls the element based on the passed parameters. The method is very important, because in order to find an element located below or above the current area of ​​visibility, you need to scroll until the required element appears in the visibility field.

Parameters:
`offset` - offset for scrolling in units
`direction` - scrolling direction (valid values: `left`/`right`/`up`/`down`)
`startPositionX` - normalized x percentage of the item that will be used as the starting point of the scroll (optional, valid values: [0.0, 1.0], `NaN` - will choose the optimal value automatically, by default - `NaN`)
`startPositionY` - the normalized percentage of y of the element that will be used as the starting point of the scroll (optional, valid values: [0.0, 1.0], `NaN` - will choose the optimal value automatically, the default is `NaN`)

Let's take an example. For example, we know for sure that in the form `userForm`, after about 100 scrolling units, the element` userEmail` that interests us will appear. The form looks like this:

```pug
Div(testID='userForm')
  // any other components
  TextInput(
    testID='userEmail'
    label='Email'
    value=userName
    onChangeText=setUserEmail
  )
```

Then, in order to enter text into `userEmail`, you first need to scroll through the` userForm` element.

```pug
await x('#userForm').scroll(100, 'down')
await x('#userEmail').typeText('harryWizzard@test.com')
```

# Expectations

After we have found the element, performed some actions, we need to check the state of the elements. For example, is the element currently visible, contains specific text, and so on. All available waits for an item can be seen in the [pertinent section of the Detox documentation](https://github.com/wix/Detox/blob/master/docs/APIRef.Expect.md).

## .toBeVisible()
Checks if an element is in the current scope. Thus, we can check the appearance or disappearance of elements when performing actions.

Let's say we have an openModalButton button. When you click on it, the modal window `modal` appears. Then the test for this behavior is:

```pug
await x('#openModalButton').tap()
await x('#modal').toBeVisible()
```

## .toExist()
Checks if an element is on the current page (not scoping). This method is useful for simply finding out if there is an element on the page.

Let's say we have an `openModalButton` button. When you click on it, a long modal window `modal` appears and somewhere in this window there should be a `change` button. Then the test for this behavior is:

```pug
await x('#openModalButton').tap()
await x('#modal').toBeVisible()
await x('#change').toExist()
```

## .toHaveToggleValue(value)
Проверяет значение переключаемых элементов(Switch или a Check-Box). Предназначен спецально для элементов которые переключаются в два положения `true` и `false`.

Пусть у нас есть элемент `checkBox`, изначально он должен быть `false`, но после нажатия на него его значение становится `true`. Тест выглядит так:

```js
await x('#checkBox').toBeVisible()
await x('#checkBox').toHaveToggleValue(false)
await x('#checkBox').tap()
await x('#checkBox').toHaveToggleValue(true)
```

## .not
A property that produces logical negation. For example, if you need to check that the `invisiable` element is NOT visible at the moment, then you need to write:

```js
await x('#invisiable').not.toBeVisible()
```

Likewise for `.toExist ()`.

```js
await x('#invisiable').not.toExist()
```