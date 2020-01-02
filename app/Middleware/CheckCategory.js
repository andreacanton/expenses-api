'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class CheckCategory {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ response, request, auth }, next) {
    const { category_id } = request.only(['category_id'])
    if (category_id) {
      const user = await auth.getUser()
      const categories = await user
        .categories()
        .where('id', category_id)
        .fetch()
      if (!categories.first()) {
        return response.status(401).json({
          message: `Category not found in user's categories`,
          category_id
        })
      }
    }

    await next()
  }
}

module.exports = CheckCategory
