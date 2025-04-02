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

  const fetchFeedData = async () => {
    try {
      if (posts.length === 0) {
        setLoading(true);
      }
      
      // Fetch all users for mapping user IDs to names
      const usersData = await apiService.getUsers();
      const usersMap = {};
      usersData.forEach(user => {
        usersMap[user.id] = user.name;
      });
      setUsers(usersMap);
      
      // Fetch all posts
      const allPosts = await apiService.getAllPosts();
      
      // Add image URLs and sort by ID (newest first)
      const enhancedPosts = allPosts.map(post => ({
        ...post,
        userAvatar: getUserAvatarById(post.userid),
        postImage: getPostImageById(post.id)
      })).sort((a, b) => b.id - a.id);
      
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
    
    // Set up polling to refresh data every 10 seconds
    const intervalId = setInterval(() => {
      fetchFeedData();
    }, 10000);
    
    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
          <small className="text-muted">Refreshing data...</small>
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
                      <h5 className="mb-0">{users[post.userid] || `User ${post.userid}`}</h5>
                      <small className="text-muted">Post ID: {post.id}</small>
                    </div>
                  </div>
                  
                  <Card.Text className="mt-3">{post.content}</Card.Text>
                </Card.Body>
                <Card.Footer className="text-muted">
                  <Badge bg="secondary" className="me-2">User ID: {post.userid}</Badge>
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
