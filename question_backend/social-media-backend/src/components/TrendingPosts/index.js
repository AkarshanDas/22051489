import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Badge, Image } from 'react-bootstrap';
import apiService from '../../api/apiService';
import Loader from '../common/Loader';
import { getUserAvatarById, getPostImageById } from '../../utils/imageUtils';

const TrendingPosts = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        setLoading(true);
        
        // Fetch all users for mapping user IDs to names
        const usersData = await apiService.getUsers();
        const usersMap = {};
        usersData.forEach(user => {
          usersMap[user.id] = user.name;
        });
        setUsers(usersMap);
        
        // Fetch all posts
        const allPosts = await apiService.getAllPosts();
        
        // For each post, fetch comments to determine trending status
        const postsWithCommentCounts = [];
        let maxComments = 0;
        
        for (const post of allPosts) {
          const comments = await apiService.getPostComments(post.id);
          const commentCount = comments.length;
          
          // Track the maximum comment count
          if (commentCount > maxComments) {
            maxComments = commentCount;
          }
          
          postsWithCommentCounts.push({
            ...post,
            commentCount,
            userAvatar: getUserAvatarById(post.userid),
            postImage: getPostImageById(post.id)
          });
        }
        
        // Filter to show only posts with the highest comment count
        const trendingPosts = postsWithCommentCounts.filter(
          post => post.commentCount === maxComments
        );
        
        setPosts(trendingPosts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching trending posts:', err);
        setError('Failed to load trending posts. Please try again later.');
        setLoading(false);
      }
    };

    fetchTrendingPosts();
  }, []);

  if (loading) return <Loader />;
  
  if (error) {
    return (
      <Container className="mt-4">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="page-title">Trending Posts</h1>
      <p className="text-center text-muted mb-4">
        Posts with the highest number of comments
      </p>
      
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
                      <Badge bg="info">Post ID: {post.id}</Badge>
                    </div>
                  </div>
                  
                  <Card.Text className="mt-3">{post.content}</Card.Text>
                  
                  <div className="stat-box">
                    <div className="stat-number">{post.commentCount}</div>
                    <div className="stat-label">Comments</div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <div className="alert alert-info">No trending posts found</div>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default TrendingPosts;
