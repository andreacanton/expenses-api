'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class FindExpense {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ params: { id }, response, request, auth }, next) {
    const user = await auth.getUser()
    const expenses = await user
      .expenses()
      .where('id', id)
      .fetch()
    const expense = expenses.first()
    if (!expense) {
      return response.status(404).json({
        message: 'Expense not found',
        id
      })
    }

    request.expense = expense

    await next()
  }
}

module.exports = FindExpense
