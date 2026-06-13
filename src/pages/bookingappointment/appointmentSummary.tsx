import { Box, Typography, TextField, Button, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import React, { useState } from 'react'

interface IProps {
    onBack?: () => void;
}

const AppointmentSummary: React.FC<IProps> = ({ onBack }) => {
    const [searchEmail, setSearchEmail] = useState('');

    return (
        <Box sx={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 1, fontFamily: 'serif' }}>
                Find Your Appointment
            </Typography>
            <Typography variant="body2" sx={{ color: '#888', mb: 4 }}>
                Enter your email address to view or manage your current booking.
            </Typography>

            <Box sx={{ mb: 4 }}>
                <TextField
                    fullWidth
                    placeholder="email@example.com"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#4a7c2c' }} />
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
                <Button 
                    fullWidth 
                    variant="contained" 
                    sx={{ 
                        mt: 2, py: 1.5, borderRadius: '12px', bgcolor: '#4a7c2c', color: '#fff', 
                        boxShadow: 'none', fontWeight: 800, '&:hover': { bgcolor: '#3d6624' }
                    }}
                >
                    SEARCH APPOINTMENT
                </Button>
            </Box>

            {onBack && (
                <Button 
                    fullWidth 
                    onClick={onBack}
                    sx={{ mt: 'auto', py: 1.5, borderRadius: '12px', color: '#666', fontWeight: 800, bgcolor: '#f5f5f5' }}
                >
                    BACK TO BOOKING
                </Button>
            )}
        </Box>
    )
}

export default AppointmentSummary;