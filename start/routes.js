'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

// Authentication
Route.group(() => {
  Route.post('register', 'AuthController.register').validator('User')
  Route.post('login', 'AuthController.login')
  Route.get('email-confirmation/:token', 'AuthController.confirm')
}).formats(['json'])

Route.group(() => {
  Route.resource('categories', 'CategoryController')
    .apiOnly()
    .middleware(new Map([[['show', 'update', 'destroy'], ['findCategory']]]))
  Route.resource('expenses', 'ExpenseController').apiOnly()
})
  .middleware(['auth'])
  .formats(['json'])
