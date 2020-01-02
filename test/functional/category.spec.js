'use strict'

const User = use('App/Models/User')
const Category = use('App/Models/Category')
const Factory = use('Factory')

const { test, trait } = use('Test/Suite')('Category')

trait('Test/ApiClient')
trait('Auth/Client')
const categoryData = {
  name: 'Test category',
  description: 'Test category description',
  icon: 'test-icon',
  color: '#000000'
}

let otherCategoryId

test('should create category', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create({
    status: 'active'
  })

  const response = await client
    .post('categories')
    .send(categoryData)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(201)
  response.assertJSONSubset({
    message: 'Category successfully created',
    category: categoryData
  })
})

test('should not create category because empty name', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create({
    status: 'active'
  })

  const response = await client
    .post('categories')
    .send({ ...categoryData, name: '' })
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(400)
  response.assertJSON([
    {
      message: 'required validation failed on name',
      field: 'name',
      validation: 'required'
    }
  ])
})

test('should not create category because wrong color', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create({
    status: 'active'
  })

  const response = await client
    .post('categories')
    .send({ ...categoryData, color: 'wrong color' })
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(400)
  response.assertJSON([
    {
      message: 'csscolor validation failed on color',
      field: 'color',
      validation: 'csscolor'
    }
  ])
})

test('should list categories', async ({ client, assert }) => {
  const user = await Factory.model('App/Models/User').create({
    status: 'active'
  })
  const category = await user.categories().create(categoryData)
  const response = await client
    .get('categories')
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSON([category.toJSON()])
})

test('should show category', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create({
    status: 'active'
  })
  const category = await user.categories().create(categoryData)
  otherCategoryId = category.id

  const response = await client
    .get(`categories/${category.id}`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSON(category.toJSON())
})
test('should throw error showing category of other users', async ({
  client
}) => {
  const user = await Factory.model('App/Models/User').create({
    status: 'active'
  })
  const response = await client
    .get(`categories/${otherCategoryId}`)
    .loginVia(user)
    .end()

  response.assertStatus(404)
  response.assertJSON({
    message: 'Category not found',
    id: `${otherCategoryId}`
  })
})

test('should update category', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create({
    status: 'active'
  })
  const category = await user.categories().create(categoryData)
  const response = await client
    .put(`categories/${category.id}`)
    .send({
      name: 'Test category edited'
    })
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    message: 'Category updated'
  })
})
test('should not update category because empty name', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create({
    status: 'active'
  })

  const category = await user.categories().create(categoryData)
  const response = await client
    .put(`categories/${category.id}`)
    .send({
      name: ''
    })
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(400)
  response.assertJSON([
    {
      message: 'required validation failed on name',
      field: 'name',
      validation: 'required'
    }
  ])
})

test('should not update category because wrong color', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create({
    status: 'active'
  })

  const category = await user.categories().create(categoryData)
  const response = await client
    .put(`categories/${category.id}`)
    .send({
      name: 'test',
      color: 'wrong color'
    })
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(400)
  response.assertJSON([
    {
      message: 'csscolor validation failed on color',
      field: 'color',
      validation: 'csscolor'
    }
  ])
})

test('should not update other users category', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create({
    status: 'active'
  })
  const response = await client
    .put(`categories/${otherCategoryId}`)
    .send({
      name: 'Test category edited'
    })
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(404)
  response.assertJSON({
    message: 'Category not found',
    id: `${otherCategoryId}`
  })
})

test('should delete category', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create({
    status: 'active'
  })
  const category = await user.categories().create(categoryData)
  const response = await client
    .delete(`categories/${category.id}`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    message: 'Category deleted',
    id: `${category.id}`
  })
})

test("should not delete other user's category", async ({ client }) => {
  const user = await Factory.model('App/Models/User').create({
    status: 'active'
  })
  const response = await client
    .delete(`categories/${otherCategoryId}`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(404)
  response.assertJSON({
    message: 'Category not found',
    id: `${otherCategoryId}`
  })
})
