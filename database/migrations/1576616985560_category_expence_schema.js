'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class CategoryExpenceSchema extends Schema {
  up() {
    this.create('category_expences', table => {
      table.increments();
      table.timestamps();
      table.integer('category_id').unsigned();
      table
        .foreign('category_id')
        .references('categories.id')
        .onDelete('cascade');
      table.integer('expense_id').unsigned();
      table
        .foreign('expense_id')
        .references('expenses.id')
        .onDelete('cascade');
    });
  }

  down() {
    this.drop('category_expences');
  }
}

module.exports = CategoryExpenceSchema;
