import React from 'react'
import AppointmentSummary from './appointmentSummary';
import { Box, Button, Card, CardContent, Divider, Typography, Stack } from '@mui/material';
import UserInformationSummary from './userInformationSummary';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

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
    return (
        <Card sx={{ width: '100%', boxShadow: 3 }}>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EventAvailableIcon sx={{ mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Review Booking</Typography>
                </Box>
                <AppointmentSummary selectedDate={props.selectedDate} selectedTime={props.selectedTime} />
                <UserInformationSummary userInformation={props.userInformation} />
                <Divider sx={{ mt: 3, mb: 2 }} />
                <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>Please review your appointment details above. Once confirmed, we'll send a confirmation email to {props.userInformation.email}.</Typography>
            </CardContent>
            <Box sx={{ px: 3, pb: 3 }}>
                <Stack spacing={2}>
                    <Button 
                        onClick={props.onBack} 
                        variant="outlined" 
                        fullWidth
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
                        disabled={props.selectedTime ? false : true} 
                        onClick={props.nextToBookingConfirmed} 
                        variant="contained" 
                        fullWidth
                        sx={{ 
                            py: 1.5, 
                            borderRadius: 2, 
                            backgroundColor: '#ccff90', 
                            color: 'black', 
                            boxShadow: 'none', 
                            '&:hover': { backgroundColor: '#b2ff59', boxShadow: 'none' }, 
                            textTransform: 'none', 
                            fontSize: '1rem', 
                            fontWeight: 600
                        }}
                    >
                        Confirm Booking
                    </Button>
                </Stack>
            </Box>
        </Card>
    )
}

export default ReviewBooking;