import React from 'react';
import { Container, Card, CardContent, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Grid from '@mui/material/Grid2';
const FeatureCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  margin: theme.spacing(2),
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Resume Builder',
      description: 'Create a professional resume with our easy-to-use builder.',
      route: '/resume-builder',
    },
    {
      title: 'Resume Analyzer',
      description: 'Analyze your resume and get feedback to improve it.',
      route: '/resume-analyzer',
    },
    {
      title: 'Portfolio Builder',
      description: 'Build a stunning portfolio to showcase your work.',
      route: '/resume-builder',
    },
  ];

  return (
    <Container>
      <Box textAlign="center" my={4}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Resume Builder & Analyzer
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Enhance your career with our tools
        </Typography>
      </Box>
      <Grid container justifyContent="center">
        {features.map((feature, index) => (
          <Grid key={index} component={motion.div} whileHover={{ scale: 1.1 }}>
            <FeatureCard style={{height: '100%'}}>
              <CardContent  style={{height: '100%'}}>
                <Typography variant="h5" component="h2">
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {feature.description}
                </Typography>
                <Box mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(feature.route)}
                  >
                    Get Started
                  </Button>
                </Box>
              </CardContent>
            </FeatureCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
