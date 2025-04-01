
import Admin from '../models/Admin';
import bcrypt from 'bcryptjs';

// Initialize admin user
export const initAdminUser = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const admin = new Admin({
        username: 'admin',
        password: hashedPassword
      });
      
      await admin.save();
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists, skipping initialization');
    }
  } catch (error) {
    console.error('Error initializing admin user:', error);
  }
};
