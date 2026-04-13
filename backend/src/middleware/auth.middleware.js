const authenticate = (req, res, next) => {
  // JWT authentication middleware
  // const token = req.headers.authorization?.split(' ')[1];
  // if (!token) {
  //   return res.status(401).json({ success: false, message: 'No token provided' });
  // }
  // try {
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   req.user = decoded;
  //   next();
  // } catch (error) {
  //   return res.status(401).json({ success: false, message: 'Invalid token' });
  // }
  next();
};

const authorize = (roles = []) => {
  // Role-based authorization middleware
  return (req, res, next) => {
    // if (!roles.includes(req.user.role)) {
    //   return res.status(403).json({ success: false, message: 'Access denied' });
    // }
    next();
  };
};

const validate = (schema) => {
  // Request validation middleware
  return (req, res, next) => {
    // const { error } = schema.validate(req.body);
    // if (error) {
    //   return res.status(400).json({ success: false, message: error.details[0].message });
    // }
    next();
  };
};

module.exports = { authenticate, authorize, validate };
