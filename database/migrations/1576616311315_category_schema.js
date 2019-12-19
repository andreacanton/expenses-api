'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class CategorySchema extends Schema {
  up() {
    this.create('categories', table => {
      table.increments();
      table.string('name');
      table.text('description');
      table.string('icon');
      table.string('color');
      table.integer('user_id').unsigned();
      table
        .foreign('user_id')
        .references('users.id')
        .onDelete('cascade');
      table.timestamps();
    });
  }

  down() {
    this.drop('categories');
  }
}

module.exports = CategorySchema;
