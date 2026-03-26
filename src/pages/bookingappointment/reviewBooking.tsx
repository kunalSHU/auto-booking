import React from 'react';
import { Box, Button, Typography, Stack, Divider } from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface IProps {
    selectedDate: string | undefined;
    selectedTime: string | null;
    onBack: () => void;
    userInformation: {
        fullName: string;
        email: string;
        phoneNumber: string;
        additionalNotes: string;
        address: string;
    }
    nextToBookingConfirmed: () => void;
}

const ReviewBooking: React.FC<IProps> = (props) => {

    // Helper for the Section Cards
    const ReviewSection = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
        <Box sx={{ 
            p: 2, 
            mb: 2, 
            borderRadius: '12px', 
            border: '1px solid #eee', 
            bgcolor: '#fff' 
        }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                <Box sx={{ display: 'flex', color: '#4a7c2c' }}>{icon}</Box>
                <Typography variant="caption" sx={{ fontWeight: 900, color: '#bdbdbd', letterSpacing: '1px' }}>
                    {title}
                </Typography>
            </Stack>
            {children}
        </Box>
    );

    return (
        <Box sx={{ 
            minHeight: '540px', 
            display: 'flex', 
            flexDirection: 'column',
            width: '100%' 
        }}>
            {/* 1. Header Section */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Box sx={{
                    bgcolor: '#e8f5e9', p: 1.5, borderRadius: '12px',
                    display: 'flex', border: '1px solid #c8e6c9'
                }}>
                    <EventAvailableIcon sx={{ color: '#4a7c2c' }} />
                </Box>
                <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', fontFamily: 'serif' }}>
                        Review Booking
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#888' }}>
                        Almost there! Just a quick check.
                    </Typography>
                </Box>
            </Stack>

            {/* 2. Review Content area */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 0.5 }}>
                
                {/* Appointment Card */}
                <ReviewSection title="APPOINTMENT" icon={<EventAvailableIcon fontSize="small" />}>
                    <Typography sx={{ fontWeight: 800 }}>{props.selectedDate}</Typography>
                    <Typography sx={{ fontWeight: 700, color: '#4a7c2c' }}>at {props.selectedTime}</Typography>
                </ReviewSection>

                {/* Service Location Card */}
                <ReviewSection title="SERVICE LOCATION" icon={<LocationOnIcon fontSize="small" />}>
                    <Typography sx={{ fontWeight: 800 }}>{props.userInformation.address}</Typography>
                </ReviewSection>

                {/* Your Information Card */}
                <ReviewSection title="YOUR INFORMATION" icon={<PersonIcon fontSize="small" />}>
                    <Typography sx={{ fontWeight: 800 }}>{props.userInformation.fullName}</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                        {props.userInformation.email} • {props.userInformation.phoneNumber}
                    </Typography>
                    {props.userInformation.additionalNotes && (
                        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#999', fontStyle: 'italic' }}>
                            Notes: {props.userInformation.additionalNotes}
                        </Typography>
                    )}
                </ReviewSection>

                {/* 3. Bottom Banner Requirement */}
                <Box sx={{ 
                    mt: 1, p: 2, borderRadius: '12px', bgcolor: '#f1f8e9', 
                    border: '1px solid #c8e6c9', display: 'flex', gap: 1.5 
                }}>
                    <Typography variant="caption" sx={{ color: '#2e7d32', fontWeight: 600, lineHeight: 1.4 }}>
                        ℹ️ Please review all details above. Once confirmed, a booking notification will be sent by SMS (and email if provided).
                    </Typography>
                </Box>
            </Box>

            {/* 4. Footer Buttons */}
            <Box sx={{ mt: 'auto', pt: 3, borderTop: '1px solid #f5f5f5' }}>
                <Stack direction="row" spacing={2}>
                    <Button 
                        fullWidth 
                        onClick={props.onBack}
                        sx={{ py: 2, borderRadius: '12px', color: '#666', fontWeight: 800, bgcolor: '#f5f5f5' }}
                    >
                        BACK
                    </Button>
                    <Button 
                        fullWidth 
                        onClick={props.nextToBookingConfirmed}
                        variant="contained" 
                        sx={{ 
                            py: 2, borderRadius: '12px', bgcolor: '#4a7c2c', color: '#fff', boxShadow: 'none',
                            fontWeight: 800, '&:hover': { bgcolor: '#3d6624' }
                        }}
                    >
                        CONFIRM BOOKING
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
};

export default ReviewBooking;