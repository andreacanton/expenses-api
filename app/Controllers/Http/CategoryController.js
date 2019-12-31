'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with categories
 */
class CategoryController {
  /**
   * Show a list of all categories.
   * GET categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, auth }) {
    const user = await auth.getUser()
    const categories = await user.categories().fetch()
    return response.status(200).json(categories)
  }

  /**
   * Create/save a new category.
   * POST categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth }) {
    const user = await auth.getUser()
    const categoryData = request.only(['name', 'description', 'icon', 'color'])
    const category = await user.categories().create(categoryData)
    return response.status(201).json({
      message: 'Category successfully created',
      category
    })
  }

  /**
   * Display a single category.
   * GET categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {params: { id }} ctx.params.id
   */
  async show({ request, response }) {
    return response.status(200).json(request.category)
  }

  /**
   * Update category details.
   * PUT or PATCH categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ request, response }) {
    const { name, description, icon, color } = request.post()
    const category = request.category

    category.name = name || category.name
    category.description = description || category.description
    category.icon = icon || category.icon
    category.color = color || category.color

    await category.save()

    return response.status(200).json({
      message: 'Category updated',
      category
    })
  }

  /**
   * Delete a category with id.
   * DELETE categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params: { id }, request, response }) {
    const category = request.category
    await category.delete()
    return response.status(200).json({
      message: 'Category deleted',
      id
    })
  }
}

module.exports = CategoryController
