'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ExpenseSchema extends Schema {
  up() {
    this.create('expenses', table => {
      table.increments();
      table.float('amount').notNullable();
      table
        .date('when')
        .notNullable()
        .defaultTo(this.fn.now());
      table.text('description');
      table.integer('user_id').unsigned();
      table
        .foreign('user_id')
        .references('users.id')
        .onDelete('cascade');
      table.timestamps();
    });
  }

  down() {
    this.drop('expenses');
  }
}

module.exports = ExpenseSchema;
