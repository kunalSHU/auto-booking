import {
  AppBar,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AppHeader = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: '100%', bgcolor: 'white' }}>
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
      >
        <nav className="nav" role="navigation" aria-label="Booking navigation">
          <a href="/" className="nav-logo" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
            AUTO <span>VIVO.</span>
          </a>
          <a href="/" className="nav-back" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10 3L5 8l5 5" />
            </svg>
            Back to Home
          </a>
        </nav>
      </AppBar>
    </Box>
  );
};

export default AppHeader;