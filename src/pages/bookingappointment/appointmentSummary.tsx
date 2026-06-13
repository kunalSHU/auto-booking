import { Box, Typography, TextField, Button, InputAdornment, CircularProgress, Alert } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import React, { useState } from 'react'
import { getAppointmentInRedisCache } from '../../apiServer/api';

interface IProps {
    onBack?: () => void;
}

const AppointmentSummary: React.FC<IProps> = ({ onBack }) => {
    const [searchEmail, setSearchEmail] = useState('');
    const [appointment, setAppointment] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const viewAppointment = async () => {
        if (!searchEmail) return;
        
        setLoading(true);
        setError(null);
        try {
            const res = await getAppointmentInRedisCache({ email: searchEmail });
            // Assuming the API returns data in res.data based on your other components
            setAppointment(res.data.appointment);
            console.log("Appointment found:", res.data.appointment);
        } catch (err: any) {
            console.error("Error fetching appointment:", err);
            setError("No active appointment found for this email.");
            setAppointment(null);
        } finally {
            setLoading(false);
        }
    }


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
                    disabled={loading || !searchEmail}
                    sx={{ 
                        mt: 2, py: 1.5, borderRadius: '12px', bgcolor: '#4a7c2c', color: '#fff', 
                        boxShadow: 'none', fontWeight: 800, '&:hover': { bgcolor: '#3d6624' }
                    }}
                    onClick={viewAppointment}
                >
                    {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'SEARCH APPOINTMENT'}
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 4, borderRadius: '12px' }}>{error}</Alert>}

            {appointment && (
                <Box sx={{ p: 3, bgcolor: '#f1f8e9', borderRadius: '16px', border: '1px solid #c8e6c9', mb: 4 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#4a7c2c', display: 'block', mb: 1 }}>
                        APPOINTMENT FOUND
                    </Typography>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.1rem' }}>
                        {appointment.date}
                    </Typography>
                    <Typography sx={{ color: '#4a7c2c', fontWeight: 700 }}>
                        at {appointment.time}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
                        Status: <b>{appointment.status?.toUpperCase()}</b>
                    </Typography>
                </Box>
            )}

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