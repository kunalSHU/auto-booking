import React from 'react';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';

interface ScheduleBannerProps {
  serviceName?: string;
  vehicleName?: string;
}

const ScheduleBanner: React.FC<ScheduleBannerProps> = ({
  serviceName = 'Oil Change',
  vehicleName = '2022 Dodge Durango Sport',
}) => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(90deg, #f7f9f6 0%, #f1f8e9 60%, #e8f5e9 100%)',
        py: { xs: 4, sm: 5, md: 6 },
        px: { xs: 2.5, sm: 4, md: 8 },
        borderBottom: '1px solid #e8f0e8',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          separator="/"
          aria-label="breadcrumb"
          sx={{
            mb: 2,
            '& .MuiBreadcrumbs-separator': { color: '#aaa', fontSize: '0.8rem' },
          }}
        >
          <Link
            underline="hover"
            color="inherit"
            href="/"
            sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#888', letterSpacing: '1px' }}
          >
            HOME
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href="/vehicle"
            sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#888', letterSpacing: '1px' }}
          >
            VEHICLE
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href="/services"
            sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#888', letterSpacing: '1px' }}
          >
            SERVICES
          </Link>
          <Typography
            sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#4a7c2c', letterSpacing: '1px' }}
          >
            SCHEDULE
          </Typography>
        </Breadcrumbs>

        {/* Eyebrow Header */}
        <Typography
          variant="caption"
          sx={{
            color: '#4a7c2c',
            fontWeight: 800,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            display: 'block',
            mb: 1,
            fontSize: '0.8rem',
          }}
        >
          BOOK YOUR APPOINTMENT
        </Typography>

        {/* Title */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            color: '#1a1a1a',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            lineHeight: 1.1,
            mb: 1.5,
          }}
        >
          Schedule a <span style={{ color: '#4a7c2c' }}>Service</span>
        </Typography>

        {/* Selected Service & Vehicle Summary */}
        <Typography
          variant="body1"
          sx={{
            color: '#666',
            fontSize: { xs: '0.9rem', sm: '1rem' },
            maxWidth: '680px',
            lineHeight: 1.5,
          }}
        >
          You've selected: <strong>{serviceName}</strong> for your{' '}
          <strong>{vehicleName}</strong>. Now choose a date, location, and time.
        </Typography>
      </Box>
    </Box>
  );
};

export default ScheduleBanner;