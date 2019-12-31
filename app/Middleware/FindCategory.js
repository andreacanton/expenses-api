'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Category = use('App/Models/Category')

class FindCategory {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ params: { id }, response, request, auth }, next) {
    const user = await auth.getUser()
    const categories = await user
      .categories()
      .where('id', id)
      .fetch()
    const category = categories.first()
    if (!category) {
      return response.status(404).json({
        message: 'Category not found',
        id
      })
    }

    request.category = category

    await next()
  }
}

module.exports = FindCategory
