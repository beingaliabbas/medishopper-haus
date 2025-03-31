
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';
import { connectDB, disconnectDB } from '../utils/db';

const JWT_SECRET = 'your-secret-key'; // In production, use environment variables

export async function loginAdmin(username: string, password: string): Promise<string | null> {
  try {
    await connectDB();
    const admin = await Admin.findOne({ username });
    
    if (!admin) {
      return null;
    }
    
    const isMatch = await admin.comparePassword(password);
    
    if (!isMatch) {
      return null;
    }
    
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    return token;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  } finally {
    await disconnectDB();
  }
}

export function verifyToken(token: string): { id: string; username: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string };
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

// Initialize admin user if not exists
export async function initAdminUser(): Promise<void> {
  try {
    await connectDB();
    const adminExists = await Admin.findOne({ username: 'admin' });
    
    if (!adminExists) {
      const admin = new Admin({
        username: 'admin',
        password: 'admin123' // This will be hashed by the pre-save hook
      });
      
      await admin.save();
      console.log('Admin user created');
    }
  } catch (error) {
    console.error('Error initializing admin user:', error);
  } finally {
    await disconnectDB();
  }
}
