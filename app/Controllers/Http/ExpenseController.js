'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with expenses
 */
class ExpenseController {
  /**
   * Show a list of all expenses.
   * GET expenses
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async index({ request, response, auth }) {
    // TODO add filters
    const user = await auth.getUser()
    const expenses = await user.expenses().fetch()
    response.status(200).json(expenses)
  }

  /**
   * Create/save a new expense.
   * POST expenses
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth }) {
    const user = await auth.getUser()
    const { amount, when, description, category_id } = request.post()
    const expense = await user
      .expenses()
      .create({ amount, when, description, category_id })

    response.status(201).json({
      message: 'Expense successfully created',
      expense
    })
  }

  /**
   * Display a single expense.
   * GET expenses/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async show({ request, response }) {
    return response.status(200).json(request.expense)
  }

  /**
   * Update expense details.
   * PUT or PATCH expenses/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ request, response }) {
    const { amount, when, description, category_id } = request.post()
    const expense = request.expense

    expense.amount = amount || 0
    expense.when = when
    expense.description = expense.description
    expense.category_id = expense.category_id

    await expense.save()

    return response.status(200).json({
      message: 'Expense updated',
      expense
    })
  }

  /**
   * Delete a expense with id.
   * DELETE expenses/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params: { id }, request, response }) {
    const expense = request.expense
    await expense.delete()
    return response.status(200).json({
      message: 'Expense deleted',
      id
    })
  }
}

module.exports = ExpenseController
