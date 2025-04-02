import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Badge, Image } from 'react-bootstrap';
import apiService from '../../api/apiService';
import Loader from '../common/Loader';
import { getUserAvatarById } from '../../utils/imageUtils';

const TopUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        setLoading(true);
        
        // Fetch all users
        const usersData = await apiService.getUsers();
        
        // Process each user to include post count
        const enhancedUsers = [];
        
        // For each user, fetch their posts
        for (const user of usersData) {
          const userPosts = await apiService.getUserPosts(user.id);
          enhancedUsers.push({
            ...user,
            postCount: userPosts.length,
            avatar: getUserAvatarById(user.id)
          });
        }
        
        // Sort users by post count (descending) and take top 5
        const topUsers = enhancedUsers
          .sort((a, b) => b.postCount - a.postCount)
          .slice(0, 5);
          
        setUsers(topUsers);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching top users:', err);
        setError('Failed to load user data. Please try again later.');
        setLoading(false);
      }
    };

    fetchTopUsers();
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
      <h1 className="page-title">Top 5 Most Active Users</h1>
      
      <Row>
        {users.map((user, index) => (
          <Col lg={4} md={6} sm={12} key={user.id} className="mb-4">
            <Card className="h-100">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <Image 
                    src={user.avatar} 
                    className="user-avatar me-3" 
                    alt={`${user.name}'s avatar`}
                  />
                  <div>
                    <h4 className="mb-0">{user.name}</h4>
                    <Badge bg="primary">Rank #{index + 1}</Badge>
                  </div>
                </div>
                
                <div className="stat-box">
                  <div className="stat-number">{user.postCount}</div>
                  <div className="stat-label">Total Posts</div>
                </div>
                
                <div className="mt-3">
                  <p className="text-muted mb-0">User ID: {user.id}</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default TopUsers;
