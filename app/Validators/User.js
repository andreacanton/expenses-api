'use strict'

class User {
  get rules() {
    return {
      email: 'required|email|unique:users,email',
      password: 'required'
    }
  }
  get sanitizationRules() {
    return {
      email: 'normalize_email'
    }
  }

  async fails(error_messages) {
    return this.ctx.response.status(400).json(error_messages)
  }
}

module.exports = User
