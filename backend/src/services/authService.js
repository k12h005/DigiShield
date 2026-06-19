const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

class AuthService {
  async register(userData) {
    const { email, password, firstName, lastName, role } = userData;

    const userExists = await userRepository.findByEmail(email);
    if (userExists) {
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || 'individual'
    });

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token: this.generateToken(user.id, user.role)
    };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token: this.generateToken(user.id, user.role)
      };
    } else {
      throw new Error('Invalid email or password');
    }
  }

  generateToken(id, role) {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'hackathon_secret_key', {
      expiresIn: '30d'
    });
  }
}

module.exports = new AuthService();
