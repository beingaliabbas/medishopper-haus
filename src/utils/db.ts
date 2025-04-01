
// Database connection utility

// MongoDB connection string 
const MONGODB_URI = 'mongodb://aliabbaszounr4:Aliabbas321@cluster0-shard-00-00.ze5uw.mongodb.net:27017,cluster0-shard-00-01.ze5uw.mongodb.net:27017,cluster0-shard-00-02.ze5uw.mongodb.net:27017/whatsapp_sessions?replicaSet=atlas-bdpqnp-shard-0&ssl=true&authSource=admin';

// Since we're in a browser environment, we can't use real MongoDB connections
// Instead, we'll simulate a connection with an in-memory store
let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing connection');
    return Promise.resolve();
  }
  
  console.log('Establishing mock DB connection');
  console.log(`Would connect to: ${MONGODB_URI} in a server environment`);
  
  isConnected = true;
  return Promise.resolve();
};

export const disconnectDB = async () => {
  if (!isConnected) {
    return Promise.resolve();
  }
  
  console.log('Closing mock DB connection');
  isConnected = false;
  return Promise.resolve();
};
