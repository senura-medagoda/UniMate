import jwt from 'jsonwebtoken';

const smAdminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Check if it's a study material admin
    if (decoded.role !== 'study_material_admin' || !decoded.isAdmin) {
      return res.status(401).json({ success: false, message: 'Unauthorized access' });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    console.error('SM Admin Auth Error:', error);
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

export default smAdminAuth;
