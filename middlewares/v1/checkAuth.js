import User from '../../models/v1/User.js';
import jwt from 'jsonwebtoken';

const checkAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  let token;
  if (authorization && authorization.startsWith('Bearer')) {
    try {
      token = authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id)
        .select('-password -tokenConfirm -tokenRecoverPassword -tokenCreateRestaurant -confirmationCode -isConfirmed -createdAt -updatedAt -__v')
        .populate({
          path: 'restaurant',
          select: 'name slug',
        });

      if (!user) {
        const error = new Error('No existe el usuario');
        return res.status(404).json({ message: error.message });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({ message: 'Token no valido' });
    }
  }

  if (!token) {
    const error = new Error('Token requerido');
    return res.status(401).json({ message: error.message });
  }
  next();
};

export default checkAuth;
