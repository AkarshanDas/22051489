import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Badge, Image } from 'react-bootstrap';
import apiService from '../../api/apiService';
import Loader from '../common/Loader';
import { getUserAvatarById, getPostImageById } from '../../utils/imageUtils';

const TrendingPosts = () => {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [maxCommentCount, setMaxCommentCount] = useState(0);

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        setLoading(true);
        
        // Fetch all users to map user IDs to names
        const usersData = await apiService.getUsers();
        const usersMap = {};
        usersData.forEach(user => {
          usersMap[user.id] = user.name;
        });
        setUsers(usersMap);
        
        // Fetch all posts
        const postsData = await apiService.getAllPosts();
        
        // For each post, fetch the comment count
        const postsWithComments = [];
        let highestCommentCount = 0;
        
        for (const post of postsData) {
          const commentsData = await apiService.getPostComments(post.id);
          const commentCount = commentsData.length || 0;
          
          // Update highest comment count if needed
          if (commentCount > highestCommentCount) {
            highestCommentCount = commentCount;
          }
          
          postsWithComments.push({
            ...post,
            commentCount,
            userAvatar: getUserAvatarById(post.userId),
            postImage: getPostImageById(post.id)
          });
        }
        
        setMaxCommentCount(highestCommentCount);
        
        // Filter only posts with the maximum comment count
        const trending = postsWithComments.filter(
          post => post.commentCount === highestCommentCount
        );
        
        setTrendingPosts(trending);
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
        Posts with the highest number of comments ({maxCommentCount})
      </p>
      
      <Row>
        {trendingPosts.length > 0 ? (
          trendingPosts.map(post => (
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
                      <Badge bg="info">Post ID: {post.id}</Badge>
                    </div>
                  </div>
                  
                  <Card.Title>{post.title}</Card.Title>
                  <Card.Text>{post.content || post.body}</Card.Text>
                  
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
