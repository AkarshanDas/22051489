import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Badge, Image } from 'react-bootstrap';
import apiService from '../../api/apiService';
import Loader from '../common/Loader';
import { getUserAvatarById, getPostImageById } from '../../utils/imageUtils';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch feed data
  const fetchFeedData = async () => {
    try {
      // Fetch all users to map user IDs to names
      const usersData = await apiService.getUsers();
      const usersMap = {};
      usersData.forEach(user => {
        usersMap[user.id] = user.name;
      });
      setUsers(usersMap);
      
      // Fetch all posts
      const postsData = await apiService.getAllPosts();
      
      // Enhance posts with additional data and sort by newest (assuming higher ID means newer)
      const enhancedPosts = postsData.map(post => ({
        ...post,
        userAvatar: getUserAvatarById(post.userId),
        postImage: getPostImageById(post.id)
      })).sort((a, b) => b.id - a.id); // Sort by ID descending (newest first)
      
      setPosts(enhancedPosts);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching feed:', err);
      setError('Failed to load feed. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedData();
    
    // Set up polling for real-time updates every 10 seconds
    const interval = setInterval(() => {
      fetchFeedData();
    }, 10000);
    
    // Clean up on component unmount
    return () => clearInterval(interval);
  }, []);

  if (loading && posts.length === 0) return <Loader />;
  
  if (error) {
    return (
      <Container className="mt-4">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="page-title">Live Feed</h1>
      <p className="text-center text-muted mb-4">
        Real-time feed with the newest posts at the top. Updates every 10 seconds.
      </p>
      
      {loading && (
        <div className="text-center mb-3">
          <small className="text-muted">Refreshing feed...</small>
        </div>
      )}
      
      <Row>
        {posts.length > 0 ? (
          posts.map(post => (
            <Col lg={6} md={12} key={post.id} className="mb-4">
              <Card className="h-100">
                <div className="post-image-container">
                  <Image 
                    src={post.postImage} 
                    className="post-image-wide" 
                    alt="Post image" 
                  />
                </div>
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <Image 
                      src={post.userAvatar} 
                      className="user-avatar me-3" 
                      alt="User avatar" 
                    />
                    <div>
                      <h5 className="mb-0">{users[post.userId] || 'Unknown User'}</h5>
                      <small className="text-muted">Post ID: {post.id}</small>
                    </div>
                  </div>
                  
                  <Card.Title>{post.title}</Card.Title>
                  <Card.Text>{post.content || post.body}</Card.Text>
                </Card.Body>
                <Card.Footer className="text-muted">
                  <Badge bg="secondary" className="me-2">New</Badge>
                  <small>Posted by User ID: {post.userId}</small>
                </Card.Footer>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <div className="alert alert-info">No posts found in the feed</div>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Feed;
