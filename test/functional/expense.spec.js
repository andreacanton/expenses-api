'use strict'

const User = use('App/Models/User')
const Expense = use('App/Models/Expense')
const Factory = use('Factory')

const { test, trait } = use('Test/Suite')('Expense')

trait('Test/ApiClient')
trait('Auth/Client')
const expenseData = {
  amount: 13.2,
  when: '2020-01-01',
  description: 'Test expense description'
}

const categoryData = {
  name: 'Test category',
  description: 'Test category description',
  icon: 'test-icon',
  color: '#000000'
}

let otherExpenseId
let otherCategoryId

test('should create expense', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create({
    status: 'active'
  })

  const category = await user.categories().create(categoryData)
  otherCategoryId = category.id

  const response = await client
    .post('expenses')
    .send({
      ...expenseData,
      category_id: category.id
    })
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(201)
  response.assertJSONSubset({
    message: 'Expense successfully created',
    expense: expenseData
  })
})
test('should not create expense with other category id', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create({
    status: 'active'
  })
  const response = await client
    .post('expenses')
    .send({
      ...expenseData,
      category_id: otherCategoryId
    })
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(401)
  response.assertJSON({
    message: "Category not found in user's categories",
    category_id: otherCategoryId
  })
})

test('should list expenses', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create({
    status: 'active'
  })
  const category = await user.categories().create(categoryData)
  const expense = await user
    .expenses()
    .create({ ...expenseData, category_id: category.id })
  const response = await client
    .get('expenses')
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSON([expense.toJSON()])
})

test('should show expense', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create({
    status: 'active'
  })
  const expense = await user.expenses().create(expenseData)
  otherExpenseId = expense.id

  const response = await client
    .get(`expenses/${expense.id}`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSON({ ...expense.toJSON(), category_id: null })
})
test('should throw error showing expense of other users', async ({
  client
}) => {
  const user = await Factory.model('App/Models/User').create({
    status: 'active'
  })
  const response = await client
    .get(`expenses/${otherExpenseId}`)
    .loginVia(user)
    .end()

  response.assertStatus(404)
  response.assertJSON({
    message: 'Expense not found',
    id: `${otherExpenseId}`
  })
})

test('should update expense', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create({
    status: 'active'
  })
  const expense = await user.expenses().create(expenseData)
  const response = await client
    .put(`expenses/${expense.id}`)
    .send({
      amount: 18.45
    })
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    message: 'Expense updated'
  })
})

test('should not update expense with other category id', async ({
  client,
  assert
}) => {
  const user = await Factory.model('App/Models/User').create({
    status: 'active'
  })
  const expense = await user.expenses().create(expenseData)
  const response = await client
    .put(`expenses/${expense.id}`)
    .send({
      amount: 18.45,
      category_id: otherCategoryId
    })
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(401)
  response.assertJSON({
    message: "Category not found in user's categories",
    category_id: otherCategoryId
  })
})

test('should not update other users expense', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create({
    status: 'active'
  })
  const response = await client
    .put(`expenses/${otherExpenseId}`)
    .send({
      name: 'Test expense edited'
    })
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(404)
  response.assertJSON({
    message: 'Expense not found',
    id: `${otherExpenseId}`
  })
})

test('should delete expense', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create({
    status: 'active'
  })
  const expense = await user.expenses().create(expenseData)
  const response = await client
    .delete(`expenses/${expense.id}`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    message: 'Expense deleted',
    id: `${expense.id}`
  })
})

test("should not delete other user's expense", async ({ client }) => {
  const user = await Factory.model('App/Models/User').create({
    status: 'active'
  })
  const response = await client
    .delete(`expenses/${otherExpenseId}`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(404)
  response.assertJSON({
    message: 'Expense not found',
    id: `${otherExpenseId}`
  })
})
