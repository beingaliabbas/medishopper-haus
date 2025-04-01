
// This file is only kept for compatibility with the frontend
// The actual database connection happens in the server/utils/db.ts file

export const connectDB = async () => {
  console.log('Frontend connectDB function called - this is now handled by the backend');
  return Promise.resolve();
};

export const disconnectDB = async () => {
  console.log('Frontend disconnectDB function called - this is now handled by the backend');
  return Promise.resolve();
};
