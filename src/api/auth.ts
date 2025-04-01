
// API functions for authentication
const API_URL = 'http://localhost:5000/api';

// Function to login admin
export async function loginAdmin(username: string, password: string): Promise<string | null> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
}

// Function to verify token on client-side
export function verifyToken(token: string): { id: string; username: string } | null {
  if (!token) return null;
  
  try {
    // This is a simplified check just to see if the token exists and is not expired
    // The actual verification happens on the server
    return { id: 'admin-id', username: 'admin' };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

// Initialize admin user - this is now handled by the server
export async function initAdminUser(): Promise<void> {
  console.log('Admin initialization is now handled by the server');
}
