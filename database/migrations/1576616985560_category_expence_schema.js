'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CategoryExpenceSchema extends Schema {
  up() {
    this.create('category_expences', table => {
      table
        .integer('category_id')
        .unsigned()
        .index('category_id')
      table
        .foreign('category_id')
        .references('categories.id')
        .onDelete('cascade')
      table
        .integer('expense_id')
        .unsigned()
        .index('expense_id')
      table
        .foreign('expense_id')
        .references('expenses.id')
        .onDelete('cascade')
    })
  }

  down() {
    this.drop('category_expences')
  }
}

module.exports = CategoryExpenceSchema
