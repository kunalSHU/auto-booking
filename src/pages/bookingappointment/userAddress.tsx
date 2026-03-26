import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  InputAdornment,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MapIcon from '@mui/icons-material/Map';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import ServiceLocationIcon from '../../icons/ServiceLocationIcon';

interface IProps {
  handleBack: () => void;
  handleNext: () => void;
  selectedDate: string | undefined;
  userInformation: {
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    additionalNotes: string;
  }
  setUserInformation: (values: any) => void;
}

const UserAddress: React.FC<IProps> = (props) => {
  const [addressType, setAddressType] = useState('Home');
  const [fullAddress, setFullAddress] = useState(props.userInformation.address || '');

  return (
    <Box>
      {/* 1. Header Section */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <ServiceLocationIcon/>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', fontFamily: 'serif' }}>
            Where should we come to? 
          </Typography>
          <Typography variant="body2" sx={{ color: '#888' }}>
            Choose your service location
          </Typography>
        </Box>
      </Stack>

      {/* 3. Radio Options Section */}
      <Typography variant="caption" sx={{ fontWeight: 900, color: '#bdbdbd', mb: 2, display: 'block', letterSpacing: '1px' }}>
        ADDRESS TYPE
      </Typography>
      
      <RadioGroup
        value={addressType}
        onChange={(e) => setAddressType(e.target.value)}
        sx={{ mb: 4 }}
      >
        <Stack spacing={1.5}>
          <RadioGroup
  value={addressType}
  onChange={(e) => setAddressType(e.target.value)}
  sx={{ mb: 4 }}
>
  <Stack spacing={1.5}>
    {[
      { 
        id: 'Home', 
        title: 'MY HOME', 
        sub: 'We come to your home address',
        icon: <HomeOutlinedIcon sx={{ fontSize: '1.1rem', color: '#4a7c2c' }} />
      },
      { 
        id: 'Work', 
        title: 'ANOTHER LOCATION', 
        sub: 'Office, parking lot, or any other address',
        icon: <LocationOnIcon sx={{ fontSize: '1.1rem', color: '#d32f2f' }} /> // Red Pin
      },
      { 
        id: 'Other', 
        title: 'DROP OFF AT AUTOVIVO SHOP', 
        sub: '123 Road Dr. - bring your vehicle to us',
        icon: <BuildOutlinedIcon sx={{ fontSize: '1rem', color: '#757575' }} /> // Grey Wrench
      },
    ].map((item) => {
      const isSelected = addressType === item.id;
      return (
        <Box 
          key={item.id}
          onClick={() => setAddressType(item.id)}
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            px: 2.5,
            py: 2, 
            cursor: 'pointer',
            borderRadius: '12px',
            border: '1px solid',
            transition: '0.2s ease',
            borderColor: isSelected ? '#4a7c2c' : '#eeeeee',
            bgcolor: isSelected ? '#f1f8e9' : 'transparent',
            '&:hover': {
              borderColor: '#4a7c2c',
              bgcolor: isSelected ? '#f1f8e9' : '#fafafa',
            }
          }}
        >
          <FormControlLabel 
            value={item.id} 
            sx={{ width: '100%', m: 0, alignItems: 'center' }}
            control={
              <Radio 
                sx={{ 
                  color: '#e0e0e0', 
                  mr: 1,
                  '&.Mui-checked': { color: '#4a7c2c' } 
                }} 
              />
            } 
            label={
              <Box>
                <Typography sx={{ 
                  fontWeight: 900, 
                  color: isSelected ? '#1b5e20' : '#1a1a1a',
                  fontSize: '0.85rem',
                  lineHeight: 1.1,
                  letterSpacing: '1px' // Matches the "Editorial" tracking
                }}>
                  {item.icon} {item.title}
                </Typography>
                <Typography sx={{ 
                  fontWeight: 500, 
                  color: isSelected ? '#4a7c2c' : '#888',
                  fontSize: '0.75rem',
                  mt: 0.4
                }}>
                  {item.sub}
                </Typography>
              </Box>
            } 
          />
        </Box>
      );
    })}
  </Stack>
</RadioGroup>
        </Stack>
      </RadioGroup>

      {/* 4. Full Address Input */}
      <Typography variant="caption" sx={{ fontWeight: 900, color: '#bdbdbd', mb: 1, display: 'block', letterSpacing: '1px' }}>
        FULL ADDRESS
      </Typography>
      <TextField
        fullWidth
        placeholder="Enter your street address..."
        value={fullAddress}
        onChange={(e) => setFullAddress(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocationOnIcon sx={{ color: '#4a7c2c' }} />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 4,
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            bgcolor: '#fafafa',
            '& fieldset': { borderColor: '#eee' },
            '&:hover fieldset': { borderColor: '#4a7c2c' },
            '&.Mui-focused fieldset': { borderColor: '#4a7c2c' },
          }
        }}
      />

      {/* 5. Footer Buttons */}
      <Box sx={{ mt: 2, pt: 4, borderTop: '1px solid #f5f5f5' }}>
        <Stack direction="row" spacing={2}>
          <Button 
            fullWidth 
            onClick={props.handleBack}
            sx={{ py: 2, borderRadius: '12px', color: '#666', fontWeight: 800, bgcolor: '#f5f5f5' }}
          >
            BACK
          </Button>
          <Button 
            fullWidth 
            disabled={!fullAddress}
            onClick={() => {
              props.setUserInformation({ ...props.userInformation, address: `${addressType}: ${fullAddress}` }); 
              props.handleNext();
            }}
            variant="contained" 
            sx={{ 
                py: 2, borderRadius: '12px', bgcolor: '#c5e1a5', color: '#1b5e20', boxShadow: 'none',
                fontWeight: 800, '&:hover': { bgcolor: '#aed581' }
            }}
          >
            CONTINUE →
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default UserAddress;