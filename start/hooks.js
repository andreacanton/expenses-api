const { hooks } = require('@adonisjs/ignitor')
const colorString = require('color-string')

hooks.after.providersRegistered(() => {
  const View = use('View')
  const Env = use('Env')

  View.global('appUrl', path => {
    const appUrl = Env.get('APP_URL')

    return path ? `${appUrl}/${path}` : appUrl
  })

  const Validator = use('Validator')

  const colorValidator = async (data, field, message, args, get) => {
    const value = get(data, field)
    if (!value) {
      return
    }

    const color = colorString.get(value)

    if (!color) {
      throw message
    }
  }

  Validator.extend('csscolor', colorValidator)
})
