import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import User from '../models/userModel.js';

export const authenticate = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw createError(401, 'Authorization header is missing');
    }

    const token = authorization.replace('Bearer ', '');
    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(id);
    if (!user) {
      throw createError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch {
    next(createError(401, 'Unauthorized'));
  }
};
