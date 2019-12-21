'use strict';

const { test, trait } = use('Test/Suite')('Authentication');
const User = use('App/Models/User');

trait('Test/ApiClient');

test('registration should run successufully', async ({ client, assert }) => {
  const response = await client
    .post('register')
    .send({
      email: 'fake@email.com',
      password: 'password'
    })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    message: 'User successfully registered',
    access_token: {
      type: 'bearer'
    }
  });
});

test('registration with not unique email', async ({ client, assert }) => {
  const response = await client
    .post('register')
    .send({
      email: 'fake@email.com',
      password: 'password'
    })
    .end();

  response.assertStatus(400);
  response.assertJSON([
    {
      message: 'unique validation failed on email',
      field: 'email',
      validation: 'unique'
    }
  ]);
});

test('registration with invalid email', async ({ client, assert }) => {
  const response = await client
    .post('register')
    .send({
      email: 'wrong email',
      password: 'password'
    })
    .end();

  response.assertStatus(400);
  response.assertJSON([
    {
      message: 'email validation failed on email',
      field: 'email',
      validation: 'email'
    }
  ]);
});

test('email is required', async ({ client, assert }) => {
  const response = await client
    .post('register')
    .send({
      email: '',
      password: 'password'
    })
    .end();

  response.assertStatus(400);
  response.assertJSON([
    {
      message: 'required validation failed on email',
      field: 'email',
      validation: 'required'
    }
  ]);
});
test('password is required', async ({ client, assert }) => {
  const response = await client
    .post('register')
    .send({
      email: 'testing@test.com',
      password: ''
    })
    .end();

  response.assertStatus(400);
  response.assertJSON([
    {
      message: 'required validation failed on password',
      field: 'password',
      validation: 'required'
    }
  ]);
});

test('should login successufully', async ({ client, assert }) => {
  const response = await client
    .post('login')
    .send({
      email: 'fake@email.com',
      password: 'password'
    })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    message: 'Logged in successfully',
    user_email: 'fake@email.com',
    access_token: {
      type: 'bearer'
    }
  });
});

test('login should fail', async ({ client, assert }) => {
  const response = await client
    .post('login')
    .send({
      email: 'fake@email.com',
      password: 'wrongpassword'
    })
    .end();

  response.assertStatus(401);
  response.assertJSONSubset({
    message: 'Something went wrong in login!'
  });
});
