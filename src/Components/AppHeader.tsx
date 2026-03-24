import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Breadcrumbs, 
  Link, 
  Box, 
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const AppHeader = ({ selectedService = "Oil Change for your 2022 Dodge Durango Sport" }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navLinks = ['HOME', 'ALL SERVICES', 'ABOUT', 'CONTACT', 'SCHEDULE'];

  return (
    <Box sx={{ width: '100%', bgcolor: 'white', overflowX: 'hidden' }}>
      {/* 1. Top Navbar */}
      <AppBar 
        position="static" 
        color="transparent" 
        elevation={0} 
        sx={{ borderBottom: '1px solid #f0f0f0', py: { xs: 0.5, md: 1 } }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
          {/* Logo - Stays far left */}
          <Typography 
            variant="h6" 
            sx={{ fontWeight: 900, letterSpacing: '-0.5px', color: '#000', fontSize: { xs: '1.1rem', md: '1.25rem' } }}
          >
            AUTO<span style={{ color: '#4a7c2c' }}>VIVO.</span>
          </Typography>

          {/* Desktop Nav / Mobile Menu Toggle */}
          {isMobile ? (
            <IconButton onClick={() => setMobileOpen(true)} sx={{ color: '#333' }}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 4 }}>
              {navLinks.map((item) => (
                <Link
                  key={item}
                  component="button"
                  variant="body2"
                  underline="none"
                  sx={{
                    fontWeight: 600,
                    color: item === 'SCHEDULE' ? '#4a7c2c' : '#333',
                    '&:hover': { color: '#4a7c2c' }
                  }}
                >
                  {item}
                </Link>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Sidebar Menu */}
      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 250, pt: 2 }}>
          <List>
            {navLinks.map((text) => (
              <ListItem key={text} disablePadding>
                <ListItemButton onClick={() => setMobileOpen(false)}>
                  <ListItemText primary={text} primaryTypographyProps={{ fontWeight: 700, fontSize: '0.85rem' }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* 2. Hero Section */}
      <Box 
        sx={{ 
          pt: { xs: 6, md: 10 }, 
          pb: { xs: 8, md: 12 }, 
          px: { xs: 2, md: 4 },
          paddingLeft: { md: 24 },
          background: 'radial-gradient(circle at top right, #deecce 0%, #fcfbfb 70%)',
          width: '100%',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ maxWidth: '1200px' }}>
          {/* Breadcrumbs - Hidden on small mobile to keep it clean */}
          <Breadcrumbs 
            separator={<span style={{ color: '#ccc', margin: '0 4px' }}>/</span>}
            sx={{ mb: 3, display: { xs: 'none', sm: 'block' } }}
          >
            {['HOME', 'VEHICLE', 'SERVICES'].map((text) => (
              <Link key={text} underline="none" sx={{ fontSize: 11, color: '#aaa', fontWeight: 500 }}>
                {text}
              </Link>
            ))}
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#4a7c2c' }}>SCHEDULE</Typography>
          </Breadcrumbs>

          <Typography 
            variant="caption" 
            sx={{ color: '#4a7c2c', fontWeight: 700, letterSpacing: '1px', mb: 1.5, display: 'block' }}
          >
            BOOK YOUR APPOINTMENT
          </Typography>
          
          {/* Main Heading - Forced Single Line with responsive font size */}
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 800, 
              color: '#1a1a1a',
              whiteSpace: 'nowrap', // Prevents wrapping
              display: 'flex',
              alignItems: 'baseline',
              gap: { xs: 1, md: 1.5 },
              mb: 3,
              // This is the "Magic" fluid font size
              fontSize: { 
                xs: 'calc(1.5rem + 3vw)', // Scales based on phone width
                sm: '3rem', 
                md: '4rem' 
              }
            }}
          >
            <span style={{ fontFamily: 'serif', fontWeight: 400, fontStyle: 'italic' }}>Schedule a</span>
            <span style={{ color: '#4a7c2c' }}>Service</span>
          </Typography>

          {/* Subtext - Light weight (400) */}
          <Box sx={{ color: '#666', maxWidth: '500px' }}>
            <Typography variant="body2" sx={{ fontWeight: 400, mb: 0.5, fontSize: { xs: '0.85rem', md: '1rem' } }}>
              You've selected: {selectedService}.
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 400, fontSize: { xs: '0.85rem', md: '1rem' } }}>
              Now choose a date, location, and time.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AppHeader;