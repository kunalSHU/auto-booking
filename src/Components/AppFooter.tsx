import React from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Link,
  Stack,
  IconButton,
  Divider,
} from '@mui/material';

const AppFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialIcons = [
    { label: 'IG', link: '#' },
    { label: 'FB', link: '#' },
    { label: 'X', link: '#' },
    { label: 'IN', link: '#' },
  ];

  const siteMap = ['Home', 'Services', 'About', 'Reviews', 'Contact'];

  const phoneNumber = '+16478784425';

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#f1f4f1',
        pt: { xs: 8, md: 12 },
        pb: 4,
        borderTop: '1px solid #f0f0f0',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 6, md: 10 }} sx={{ mb: { xs: 8, md: 12 } }}>
          
          {/* Column 1: Brand */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                letterSpacing: '-0.5px',
                color: '#000',
                mb: 3,
              }}
            >
              AUTO<span style={{ color: '#4a7c2c' }}>VIVO.</span>
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#888', mb: 4, lineHeight: 1.8, maxWidth: '300px' }}
            >
              Professional mobile auto repair and maintenance — 
              delivered directly to your doorstep. Wherever you are, 
              we've got you covered.
            </Typography>
            <Stack direction="row" spacing={1.5}>
              {socialIcons.map((social) => (
                <IconButton
                  key={social.label}
                  sx={{
                    width: 40,
                    height: 40,
                    border: '1px solid #eee',
                    borderRadius: 1.5,
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    color: '#444',
                    '&:hover': { bgcolor: '#f1f8e9', borderColor: '#c8e6c9' },
                  }}
                >
                  {social.label}
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {/* Column 2: Site Map */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 900,
                letterSpacing: '1.5px',
                color: '#000',
                display: 'block',
                mb: 4,
              }}
            >
              SITE MAP
            </Typography>
            <Stack spacing={2.5}>
              {siteMap.map((item) => (
                <Link
                  key={item}
                  href="#"
                  underline="none"
                  sx={{
                    color: '#888',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    transition: '0.2s',
                    '&:hover': { color: '#4a7c2c', pl: 0.5 },
                  }}
                >
                  {item}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Column 3: Get In Touch */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 900,
                letterSpacing: '1.5px',
                color: '#000',
                display: 'block',
                mb: 4,
              }}
            >
              GET IN TOUCH
            </Typography>
            <Stack spacing={2.5}>
              <Typography variant="body2" sx={{ color: '#888', fontWeight: 500 }}>
                <a href={`tel:${phoneNumber}`} className="phone-link">
                  {phoneNumber}
                </a>
              </Typography>
              <Typography variant="body2" sx={{ color: '#888', fontWeight: 500 }}>
                autovivohq@gmail.com
              </Typography>
              <Typography variant="body2" sx={{ color: '#888', fontWeight: 500 }}>
                50 Upper Rouge Trail, Scarborough, ON M1B 6K4
              </Typography>
              <Typography variant="body2" sx={{ color: '#888', fontWeight: 500 }}>
                Mon – Sat  ·  7am – 7pm
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 4, borderColor: '#f0f0f0' }} />

        {/* Footer Bottom */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="caption" sx={{ color: '#bbb', fontWeight: 500 }}>
            © {currentYear} Auto Vivo. All rights reserved.
          </Typography>
          <Typography
            variant="caption"
            sx={{ 
              color: '#bbb', 
              fontStyle: 'italic',
              display: { xs: 'none', sm: 'block' } 
            }}
          >
            Driven by passion. Delivered to your door.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default AppFooter;