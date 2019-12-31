'use strict'

const Mail = use('Mail')
const Factory = use('Factory')
const User = use('App/Models/User')

const { test, trait } = use('Test/Suite')('Authentication')

trait('Test/ApiClient')

test('registration should run successufully - happy path', async ({
  client,
  assert
}) => {
  Mail.fake()

  const user_email = 'fake@email.com'
  const user_pass = 'password'

  const register_response = await client
    .post('register')
    .send({
      email: user_email,
      password: user_pass
    })
    .end()

  register_response.assertStatus(200)
  register_response.assertJSON({
    message: 'User successfully registered check your email for confirmation'
  })

  const recentEmail = Mail.pullRecent()
  assert.equal(recentEmail.message.to[0].address, user_email)

  const user = await User.findBy('email', user_email)
  const confirmation_token = await user
    .tokens()
    .where('type', 'email_confirmation')
    .where('is_revoked', false)
    .first()

  const confirm_response = await client
    .get(`email-confirmation/${confirmation_token.token}`)
    .end()

  confirm_response.assertStatus(200)
  confirm_response.assertJSON({
    message: 'User email confirmed'
  })

  await user.reload()
  assert.equal(user.status, 'active')

  Mail.restore()
})

test('registration with not unique email', async ({ client }) => {
  const response = await client
    .post('register')
    .send({
      email: 'fake@email.com',
      password: 'password'
    })
    .end()

  response.assertStatus(400)
  response.assertJSON([
    {
      message: 'unique validation failed on email',
      field: 'email',
      validation: 'unique'
    }
  ])
})

test('registration with invalid email', async ({ client }) => {
  const response = await client
    .post('register')
    .send({
      email: 'wrong email',
      password: 'password'
    })
    .end()

  response.assertStatus(400)
  response.assertJSON([
    {
      message: 'email validation failed on email',
      field: 'email',
      validation: 'email'
    }
  ])
})

test('email is required', async ({ client }) => {
  const response = await client
    .post('register')
    .send({
      email: '',
      password: 'password'
    })
    .end()

  response.assertStatus(400)
  response.assertJSON([
    {
      message: 'required validation failed on email',
      field: 'email',
      validation: 'required'
    }
  ])
})
test('password is required', async ({ client }) => {
  const response = await client
    .post('register')
    .send({
      email: 'testing@test.com',
      password: ''
    })
    .end()

  response.assertStatus(400)
  response.assertJSON([
    {
      message: 'required validation failed on password',
      field: 'password',
      validation: 'required'
    }
  ])
})

test('should login successufully', async ({ client }) => {
  const response = await client
    .post('login')
    .send({
      email: 'fake@email.com',
      password: 'password'
    })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    message: 'Logged in successfully',
    user_email: 'fake@email.com',
    access_token: {
      type: 'bearer'
    }
  })
})

test('login should fail with wrong password', async ({ client }) => {
  const response = await client
    .post('login')
    .send({
      email: 'fake@email.com',
      password: 'wrongpassword'
    })
    .end()

  response.assertStatus(401)
  response.assertJSONSubset({
    message: 'Something went wrong in login!'
  })
})

test('login should fail without confirmation', async ({ client }) => {
  const user = await User.find(1)
  user.status = 'pending'
  user.save()

  const response = await client
    .post('login')
    .send({
      email: user.email,
      password: 'password'
    })
    .end()

  response.assertStatus(401)
  response.assertJSONSubset({
    message: 'User is not confirmed, please check your email!'
  })
})
