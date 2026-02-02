import React from 'react'
import AppointmentSummary from './appointmentSummary';
import { Box, Button, Card, CardContent, Divider, Typography } from '@mui/material';
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
            <Box sx={{ pl: 3, pb: 3 }}>
                <Button onClick={props.onBack} variant="outlined" sx={{ color: 'black', borderColor: 'black',textTransform: 'none' }}>Back</Button>
                <Button disabled={props.selectedTime ? false : true} onClick={props.nextToBookingConfirmed} variant="contained" sx={{ bgcolor: '#bef264', textTransform: 'none', ml: 2, color: 'black', fontWeight: 'bold', '&:hover': { bgcolor: '#a3e635' } }}>
                    Confirm Booking
                </Button>
            </Box>
        </Card>
    )
}

export default ReviewBooking;