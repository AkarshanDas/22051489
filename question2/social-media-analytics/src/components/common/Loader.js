import React from 'react';
import { Spinner, Container } from 'react-bootstrap';

const Loader = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
      <div className="text-center">
        <Spinner animation="border" role="status" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3 text-muted">Loading data...</p>
      </div>
    </Container>
  );
};

export default Loader;
