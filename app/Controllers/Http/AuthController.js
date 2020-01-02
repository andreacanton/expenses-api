'use strict'

const User = use('App/Models/User')
const Token = use('App/Models/Token')
const Mail = use('Mail')
const Env = use('Env')
const randomstring = require('randomstring')
const Database = use('Database')

class AuthController {
  /**
   * The registration action
   * @param {request, auth, response }
   */
  async register({ request, auth, response }) {
    const { email, password } = request.only(['email', 'password'])
    const trx = await Database.beginTransaction()

    try {
      const user = await User.create(
        { email, password, status: 'pending' },
        trx
      )
      const token = randomstring.generate()
      user.tokens().create({ type: 'email_confirmation', token }, trx)

      await Mail.send('emails.welcome', { token }, message => {
        message
          .to(user.email)
          .from(Env.get('MAIL_NOREPLY', 'noreply@expenses.com'))
          .subject('Welcome to expenses')
      })
      await trx.commit()

      return response.status(200).json({
        message:
          'User successfully registered check your email for confirmation'
      })
    } catch (e) {
      await trx.rollback()
      return response.status(200).json({
        error: e
      })
    }
  }

  async confirm({ params: { token }, response }) {
    const email_token = await Token.query()
      .where('token', token)
      .where('is_revoked', false)
      .first()

    if (email_token == null) {
      return response.status(401).json({
        message: 'Confirmation token not valid'
      })
    }

    const user = await User.find(email_token.user_id)
    user.status = 'active'
    await user.save()

    email_token.is_revoked = true
    await email_token.save()

    response.status(200).json({
      message: 'User email confirmed'
    })
  }

  /**
   * The login action
   * @param {request, auth, response}
   */
  async login({ request, auth, response }) {
    const { email, password } = request.only(['email', 'password'])
    try {
      if (await auth.withRefreshToken().attempt(email, password)) {
        const user = await User.findBy('email', email)
        if (user.status === 'pending') {
          return response.status(401).json({
            message: 'User is not confirmed, please check your email!'
          })
        }
        const access_token = await auth.generate(user)
        return response.status(200).json({
          message: 'Logged in successfully',
          user_email: user.email,
          access_token
        })
      }
    } catch (e) {
      return response
        .status(401)
        .json({ message: 'Something went wrong in login!' })
    }
  }
}

module.exports = AuthController
