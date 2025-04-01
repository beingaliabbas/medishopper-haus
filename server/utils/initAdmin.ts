
import Admin from '../models/Admin';

// Initialize admin user
export const initAdminUser = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    
    if (adminCount === 0) {
      const admin = new Admin({
        username: 'admin',
        password: 'admin123' // Will be hashed by pre-save hook
      });
      
      await admin.save();
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error initializing admin user:', error);
  }
};
