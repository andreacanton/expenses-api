'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserStatusSchema extends Schema {
  up() {
    this.table('users', table => {
      table
        .string('status')
        .notNullable()
        .defaultTo('disabled')
    })
  }

  down() {
    this.table('users', table => {
      table.dropColumn('status')
    })
  }
}

module.exports = UserStatusSchema
