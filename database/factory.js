'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Hash = use('Hash')

Factory.blueprint('App/Models/User', async faker => {
  return {
    email: faker.email(),
    password: faker.password()
  }
})
Factory.blueprint('App/Models/Category', async faker => {
  return {
    name: faker.word(),
    description: faker.sentence(),
    color: faker.color({ format: 'hex' }),
    icon: faker.word()
  }
})
