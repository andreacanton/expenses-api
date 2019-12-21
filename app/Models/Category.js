'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Category extends Model {
  user() {
    return this.belongsTo('App/Model/User')
  }
  expenses() {
    return this.belongsToMany('App/Models/Expense')
  }
}

module.exports = Category
