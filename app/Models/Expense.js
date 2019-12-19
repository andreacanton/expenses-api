'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Expense extends Model {
  user() {
    return this.belongsTo('App/Model/User');
  }
  categories() {
    return this.belongsToMany('App/Model/Category');
  }
}

module.exports = Expense;
