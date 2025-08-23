import React, { useEffect } from 'react';
import './App.css';
import { Box, Container, CssBaseline, Typography } from '@mui/material';
import Footer from './Footer';
import { callNodeHelloWorld } from './apiServer/api';

const App: React.FC = () => {

  useEffect(() => {
    testApiCall();
  },[]);
  
  const testApiCall = async () => {
    let response = await callNodeHelloWorld();
    setNodeResponse(response?.data.message);
  }
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <CssBaseline/>
      <Container component="main" sx={{ mt: 8, mb: 2 }} maxWidth="md">
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Our Website!
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          {'This is the main content area. You can put anything you want here.'}
        </Typography>
        <Typography paragraph>
          Here is some text to demonstrate scrolling. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Nullamiquet, purus ut convallis laoreet, est mi maximus nisl, vitae
          sodales justo quam eget ex. Curabitur et orci in nunc commodo placerat.
          Donec ac feugiat mi.
        </Typography>
        
        <Box sx={{ my: 4, display: 'flex', justifyContent: 'center' }}>
          <img
            src="https://via.placeholder.com/600x400"
            alt="placeholder"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </Box>

        <Typography paragraph>
          More content to ensure the page scrolls...
          Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
          Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.
          Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est.
          Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra.
          Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi.
          Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci,
          sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis.
          Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue,
          eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis,
          accumsan porttitor, facilisis luctus, metus.
        </Typography>
      </Container>
      <Footer />
    </Box>
  )
}

export default App;
function setNodeResponse(message: any) {
  throw new Error('Function not implemented.');
}

