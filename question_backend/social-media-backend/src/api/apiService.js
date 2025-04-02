import axios from 'axios';

const BASE_URL = 'http://20.244.56.144/evaluation-service';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNTk5MDI3LCJpYXQiOjE3NDM1OTg3MjcsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImM2OWVhNWQzLWI2MDgtNGQ5YS04NGE1LTIwNzZjNjNiZDdiMSIsInN1YiI6IjIyMDUxNDg5QGtpaXQuYWMuaW4ifSwiZW1haWwiOiIyMjA1MTQ4OUBraWl0LmFjLmluIiwibmFtZSI6ImFrYXJzaGFuIGRhcyIsInJvbGxObyI6IjIyMDUxNDg5IiwiYWNjZXNzQ29kZSI6Im53cHdyWiIsImNsaWVudElEIjoiYzY5ZWE1ZDMtYjYwOC00ZDlhLTg0YTUtMjA3NmM2M2JkN2IxIiwiY2xpZW50U2VjcmV0IjoialVnQ2dYdndSQ2FDRXJzcCJ9.oV2upLptbly4qis1SK598SOeERfYaEBZStgB1U6VxAU';

// Create axios instance with default headers
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${AUTH_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

const apiService = {
  // Get all users
  getUsers: async () => {
    try {
      const response = await apiClient.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
  
  // Get posts by user ID
  getUserPosts: async (userId) => {
    try {
      const response = await apiClient.get(`/users/${userId}/posts`);
      // Based on the API response format from the image
      return response.data.posts || [];
    } catch (error) {
      console.error(`Error fetching posts for user ${userId}:`, error);
      throw error;
    }
  },
  
  // Get all posts (assuming this endpoint exists or construct from user posts)
  getAllPosts: async () => {
    try {
      const response = await apiClient.get('/posts');
      return response.data.posts || [];
    } catch (error) {
      console.error('Error fetching all posts:', error);
      throw error;
    }
  },
  
  // Get comments for a specific post
  getPostComments: async (postId) => {
    try {
      const response = await apiClient.get(`/posts/${postId}/comments`);
      // Based on the API response format from the image
      return response.data.comments || [];
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      throw error;
    }
  }
};

export default apiService;
