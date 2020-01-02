'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExpenseSchema extends Schema {
  up() {
    this.create('expenses', table => {
      table.increments()
      table.float('amount').notNullable()
      table.date('when').notNullable()
      table.text('description')
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
      table
        .foreign('user_id')
        .references('users.id')
        .onDelete('cascade')
      table.integer('category_id').unsigned()
      table
        .foreign('category_id')
        .references('categories.id')
        .onDelete('set null')
      table.timestamps()
    })
  }

  down() {
    this.drop('expenses')
  }
}

module.exports = ExpenseSchema
