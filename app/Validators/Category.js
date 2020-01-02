'use strict'

class Category {
  get rules() {
    return {
      name: 'required',
      color: 'csscolor'
    }
  }
  get sanitizationRules() {
    return {}
  }

  async fails(error_messages) {
    return this.ctx.response.status(400).json(error_messages)
  }
}

module.exports = Category
