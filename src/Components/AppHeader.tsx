import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box,
  Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const AppHeader = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: '100%', bgcolor: 'white' }}>
      <AppBar 
        position="static" 
        color="transparent" 
        elevation={0} 
        sx={{ borderBottom: '1px solid #f0f0f0', py: { xs: 1, md: 1.5 } }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
          <Typography 
            onClick={() => navigate('/')}
            variant="h6" 
            sx={{ 
                fontWeight: 900, 
                letterSpacing: '-0.5px', 
                color: '#000', 
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                cursor: 'pointer'
            }}
          >
            AUTO<span style={{ color: '#4a7c2c' }}>VIVO.</span>
          </Typography>

          <Link
            component="button"
            variant="body2"
            onClick={() => navigate('/')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: '#666',
              textDecoration: 'none',
              fontWeight: 600,
              '&:hover': { color: '#000' }
            }}
          >
            <ChevronLeftIcon fontSize="small" />
            Back to Home
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default AppHeader;