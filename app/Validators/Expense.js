'use strict'

class Expense {
  get rules() {
    return {
      amount: 'required|number',
      when: 'required|date'
    }
  }
  get sanitizationRules() {
    return {}
  }

  async fails(error_messages) {
    return this.ctx.response.status(400).json(error_messages)
  }
}

module.exports = Expense
