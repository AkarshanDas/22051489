import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Badge } from 'react-bootstrap';
import apiService from '../../api/apiService';
import Loader from '../common/Loader';

const TopUsers = () => {
  const [users, setUsers] = useState({});
  const [userPostCounts, setUserPostCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all users
        const usersData = await apiService.getUsers();
        setUsers(usersData.users || {});
        
        // Track post counts for each user
        const postCountMap = {};
        
        // Fetch posts for each user
        for (const userId in usersData.users) {
          const userPostsData = await apiService.getUserPosts(userId);
          postCountMap[userId] = (userPostsData.posts || []).length;
        }
        
        setUserPostCounts(postCountMap);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users data. Please try again later.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // Get top 5 users with the highest post counts
  const getTopUsers = () => {
    return Object.entries(userPostCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([userId, postCount]) => ({
        id: userId,
        name: users[userId],
        postCount
      }));
  };

  if (loading) return <Loader />;
  
  if (error) {
    return (
      <Container className="mt-4">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  const topUsers = getTopUsers();

  return (
    <Container className="mt-4">
      <h2 className="page-title text-center mb-4">Top Users</h2>
      <p className="text-center text-muted mb-4">
        Displaying the top 5 users with the highest number of posts
      </p>
      
      <Row>
        {topUsers.map((user, index) => (
          <Col lg={4} md={6} key={user.id} className="mb-4">
            <Card className="user-card h-100">
              <Card.Body className="d-flex flex-column">
                <div className="d-flex align-items-center mb-3">
                  <Badge bg="primary" className="me-2">#{index + 1}</Badge>
                  <Card.Title className="mb-0">{user.name}</Card.Title>
                </div>
                <Card.Text>
                  <strong>Total Posts:</strong> {user.postCount}
                </Card.Text>
                <Card.Text className="text-muted mt-auto">
                  User ID: {user.id}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default TopUsers;
