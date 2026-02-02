import jwt from 'jsonwebtoken';

/**
 * Generates a JSON Web Token.
 * @param {string} id - The user ID to embed in the token.
 * @returns {string} The generated JWT.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

export default generateToken;
