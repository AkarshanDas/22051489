import axios from 'axios';

// Base URL for your backend API (not the test server)
const BASE_URL = 'http://localhost:3000/api';

const apiService = {
  // Fetch all users
  getUsers: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
  
  // Fetch posts for a specific user
  getUserPosts: async (userId) => {
    try {
      const response = await axios.get(`${BASE_URL}/users/${userId}/posts`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching posts for user ${userId}:`, error);
      throw error;
    }
  },
  
  // Fetch all posts
  getAllPosts: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/posts`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all posts:', error);
      throw error;
    }
  },
  
  // Fetch comments for a specific post
  getPostComments: async (postId) => {
    try {
      const response = await axios.get(`${BASE_URL}/posts/${postId}/comments`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      throw error;
    }
  }
};

export default apiService;
