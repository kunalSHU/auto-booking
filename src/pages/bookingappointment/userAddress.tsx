import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  InputAdornment,
  Paper,
  List,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import ServiceLocationIcon from '../../icons/ServiceLocationIcon';
import DropOffInformationBanner from '../../banners/dropOffInformationBanner';
import { v4 as uuidv4 } from 'uuid';

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

interface IAutocompleteSuggestion {
  name: string;       // e.g., "123 Main St"
  place_formatted?: string;      // e.g., "Toronto"
}


const UserAddress: React.FC<IProps> = (props) => {
  const REACT_APP_API_MAPS_TOKEN = process.env.REACT_APP_API_MAPS_TOKEN;
  const [addressType, setAddressType] = useState('Home');
  const [suggesstions, setSuggestions] = useState([]);
  const [queryAddress, setQueryAddress] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [fullAddressDisabled, setFullAddressDisabled] = useState(false);
  const [sessionToken] = useState<string>(() => uuidv4());

  useEffect(() => {

    const debounceFn = setTimeout(async () => {
      // If the query is empty, don't fetch. This also prevents a fetch
      // when we clear the query after selecting an address.
      if (!queryAddress.trim()) {
        setSuggestions([]);
        return;
      }
      const url = `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodeURIComponent(queryAddress)}&session_token=${sessionToken}&access_token=${REACT_APP_API_MAPS_TOKEN}`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);

      const formattedSuggestions = data.suggestions?.map((suggestion: IAutocompleteSuggestion) => {
        const name = suggestion.name;
        const place = suggestion.place_formatted;
        return {name: name, place: place}
      })
      console.log(formattedSuggestions);
      setSuggestions(formattedSuggestions);
    }, 300); // setting debounce of 300ms so we don't hit rate limiter if the user spams the keyboard

    return () => clearTimeout(debounceFn);

  }, [queryAddress])

  const radioButtonClicked = (value: string) => {
    setAddressType(value);
    if (value === 'Other') {
      setFullAddressDisabled(true);
      setFullAddress('');
    } else {
      setFullAddressDisabled(false);
    }
  };

  const addressSelection = (e: any) => {
    setQueryAddress(e.target.value);
    setFullAddress(e.target.value); // Keep fullAddress in sync while typing
  }

  return (
    <Box sx={{ 
      /* Ensures the Paper container stays the same size regardless of content */
      minHeight: '540px', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative' // Needed for absolute banner positioning
    }}>
      
      {/* 1. Header Section */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <ServiceLocationIcon size={64} />
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', fontFamily: 'serif' }}>
            Service Location
          </Typography>
          <Typography variant="body2" sx={{ color: '#888' }}>
            Where should we perform the service?
          </Typography>
        </Box>
      </Stack>

      {/* 3. Radio Options Section */}
      <Typography variant="caption" sx={{ fontWeight: 900, color: '#bdbdbd', mb: 2, display: 'block', letterSpacing: '1px' }}>
        ADDRESS TYPE
      </Typography>
      
      <RadioGroup value={addressType} onChange={(e) => radioButtonClicked(e.target.value)} sx={{ mb: 4 }}>
        <Stack spacing={1.5}>
          {[
            { id: 'Home', title: 'MY HOME', sub: 'We come to your home address', icon: <HomeOutlinedIcon sx={{ fontSize: '1.1rem', color: '#4a7c2c' }} /> },
            { id: 'Work', title: 'ANOTHER LOCATION', sub: 'Office, parking lot, or any other address', icon: <LocationOnIcon sx={{ fontSize: '1.1rem', color: '#d32f2f' }} /> },
            { id: 'Other', title: 'DROP OFF AT AUTOVIVO SHOP', sub: '123 Road Dr. - bring your vehicle to us', icon: <BuildOutlinedIcon sx={{ fontSize: '1rem', color: '#757575' }} /> },
          ].map((item) => {
            const isSelected = addressType === item.id;
            return (
              <Box 
                key={item.id}
                onClick={() => radioButtonClicked(item.id)}
                sx={{ 
                  display: 'flex', alignItems: 'center', px: 2.5, py: 2, cursor: 'pointer', borderRadius: '12px',
                  border: '1px solid', borderColor: isSelected ? '#4a7c2c' : '#eeeeee',
                  bgcolor: isSelected ? '#f1f8e9' : 'transparent', transition: '0.2s ease',
                }}
              >
                <FormControlLabel 
                  value={item.id} 
                  sx={{ width: '100%', m: 0, alignItems: 'center' }}
                  control={<Radio sx={{ color: '#e0e0e0', mr: 1, '&.Mui-checked': { color: '#4a7c2c' } }} />} 
                  label={
                    <Box>
                      <Stack direction="row" alignItems="center" spacing={0.8}>
                        {item.icon}
                        <Typography sx={{ fontWeight: 900, color: isSelected ? '#1b5e20' : '#1a1a1a', fontSize: '0.85rem', letterSpacing: '1px' }}>
                          {item.title}
                        </Typography>
                      </Stack>
                      <Typography sx={{ fontWeight: 500, color: isSelected ? '#4a7c2c' : '#888', fontSize: '0.75rem', mt: 0.5, ml: 3 }}>
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

      {/* 4. Full Address Input */}
      <Typography variant="caption" sx={{ fontWeight: 900, color: '#bdbdbd', mb: 1, display: 'block', letterSpacing: '1px' }}>
        FULL ADDRESS
      </Typography>
      <Box sx={{ position: 'relative', mb: 2 }}>
        <TextField
          fullWidth
          disabled={fullAddressDisabled}
          placeholder={fullAddressDisabled ? "Car Drop-Off - AutoHub Shop, 123 Road Dr." : "Enter your street address..."}
          value={fullAddress || queryAddress}
          onChange={(e) => addressSelection(e)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOnIcon sx={{ color: '#4a7c2c' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px', bgcolor: '#fafafa',
              '& fieldset': { borderColor: '#eee' },
              '&:hover fieldset': { borderColor: '#4a7c2c' },
              '&.Mui-focused fieldset': { borderColor: '#4a7c2c' },
            }
          }}
        />
        {suggesstions && suggesstions.length > 0 && (
          <Paper elevation={3} sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 10,
            mt: 0.5,
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            <List disablePadding sx={{ 
              pb: 0.5,
              maxHeight: '240px', // Set a max height for the list
              overflowY: 'auto'   // Make it scrollable when content overflows
            }}>
              {suggesstions.map((suggestion: any, index: number) => (
                <Box
                  key={index}
                  onClick={() => {
                    const newAddress = `${suggestion.name}, ${suggestion.place}`;
                    setFullAddress(newAddress); // Set the final address for display and submission
                    setQueryAddress('');      // Clear the search query to prevent re-fetching
                    setSuggestions([]);       // Hide suggestions dropdown
                  }}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#f5f5f5' }
                  }}
                >
                  <Typography sx={{ fontWeight: 700 }}>{suggestion.name}</Typography>
                  <Typography variant="body2" sx={{ color: '#888' }}>{suggestion.place}</Typography>
                </Box>
              ))}
            </List>
          </Paper>
        )}
      </Box>

      {/* BANNER FIX: By using absolute positioning, the banner sits ON TOP 
          of the space instead of pushing the box bigger. */}
      <Box sx={{ height: '80px', position: 'relative', mt: 1 }}>
        {addressType === 'Other' && (
          <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            zIndex: 2,
            animation: 'fadeIn 0.2s ease-in' 
          }}>
            <DropOffInformationBanner />
          </Box>
        )}
      </Box>

      {/* 5. Footer Buttons */}
      <Box sx={{ mt: 'auto', pt: 4, borderTop: '1px solid #f5f5f5' }}>
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
            disabled={(addressType !== 'Other' && !fullAddress.trim())}
            onClick={() => {
              const finalAddr = addressType === 'Other' ? "Car Drop-Off - AutoHub Shop, 123 Road Dr." : fullAddress;
              props.setUserInformation({ ...props.userInformation, address: finalAddr }); 
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