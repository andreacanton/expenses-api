'use strict';

const User = use('App/Models/User');

class AuthController {
  async register({ request, auth, response }) {
    const { email, password } = request.only(['email', 'password']);

    const user = await User.create({ email, password });
    const token = await auth.generate(user);

    return response.status(200).json({
      message: 'User successfully registered',
      access_token: token
    });
  }
  async login({ request, auth, response }) {
    const { email, password } = request.only(['email', 'password']);
    try {
      if (await auth.attempt(email, password)) {
        const user = await User.findBy('email', email);
        const access_token = await auth.generate(user);
        return response
          .status(200)
          .json({
            message: 'Logged in successfully',
            user_email: user.email,
            access_token
          });
      }
    } catch (e) {
      return response
        .status(401)
        .json({ message: 'Something went wrong in login!' });
    }
  }
}

module.exports = AuthController;
