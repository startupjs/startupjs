import express from 'express'

export function getReactDatepickerHead () {
  return `
    <link rel="stylesheet" type="text/css" href="/vendor/react-datepicker/react-datepicker.css">
    <link rel="stylesheet" type="text/css" href="/vendor/react-datepicker/react-datepicker-custom.css">
  `
}

export function initReactDatepicker (ee, options) {
  ee.on('logs', expressApp => {
    expressApp.use(
      '/vendor/react-datepicker/react-datepicker.css',
      express.static(
        options.dirname + '/node_modules/react-datepicker/dist/react-datepicker.css',
        { maxAge: '1h' }
      )
    )
  })

  ee.on('logs', expressApp => {
    expressApp.use(
      '/vendor/react-datepicker/react-datepicker-custom.css',
      express.static(
        options.dirname + '/node_modules/@startupjs/ui/components/forms/DateTimePicker/react-datepicker-custom.css',
        { maxAge: '1h' }
      )
    )
  })
}
