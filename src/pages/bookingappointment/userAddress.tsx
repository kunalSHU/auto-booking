import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Paper,
  Stack,
} from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

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
  const [address, setAddress] = useState('');
  const [label, setLabel] = useState('Home');

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 4, 
        maxWidth: 500, 
        mx: 'auto', 
        borderRadius: 3,
        fontFamily: 'Roboto, sans-serif' 
      }}
    >
      {/* Header Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
        <LocationOnOutlinedIcon sx={{ mr: 1, fontSize: 28 }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Enter Address
        </Typography>
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {props.selectedDate}
      </Typography>

      <Stack spacing={3}>
        {/* Full Address Textarea */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
            Full Address *
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={address}
            placeholder='Please enter home address'
            onChange={(e) => setAddress(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: '#fff',
              }
            }}
          />
        </Box>

        {/* Address Label Radio Group */}
        <FormControl>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
            Address Label *
          </Typography>
          <RadioGroup
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          >
            <FormControlLabel value="Home" control={<Radio />} label="Home" />
            <FormControlLabel value="Other" control={<Radio />} label="Other" />
            <FormControlLabel 
              value="Car Drop-Off" 
              control={<Radio />} 
              label="Car Drop-Off (AutoHub Shop - 123 Road Dr.)" 
            />
          </RadioGroup>
        </FormControl>

        {/* Navigation Buttons */}
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Button 
            variant="outlined" 
            fullWidth 
            onClick={props.handleBack}
            sx={{ 
              py: 1.5, 
              borderRadius: 2, 
              color: 'black', 
              borderColor: '#ccc',
              textTransform: 'none',
              fontSize: '1rem'
            }}
          >
            Back
          </Button>
          <Button 
            variant="contained" 
            fullWidth 
            onClick={() => {props.setUserInformation({...props.userInformation, address}); props.handleNext();}}
            sx={{ 
              py: 1.5, 
              borderRadius: 2, 
              backgroundColor: '#ccff90', // The lime green from your screenshot
              color: 'black',
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#b2ff59', boxShadow: 'none' },
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600
            }}
          >
            Next
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default UserAddress;