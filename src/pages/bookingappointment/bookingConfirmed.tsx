import { Box, Button, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { publishEmailNotifcation } from '../../apiServer/api';

interface IProps {
    selectedDate: string | undefined;
    selectedTime: string | null;
    email: string;
    activeStep: number;
}

interface ISMSNotifcation {
    phoneNumber: string;
    message: string;
}

export interface IEmailNotification {
    toEmail: string;
    message: string;
    subject: string;
}

const BookingConfirmed: React.FC<IProps> = (props) => {

    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=> {
        console.log("Booking confirmed use effect")
    
        // Construct the payload matching your Avro schema
        const notification: IEmailNotification = {
            toEmail: props.email,
            message: `Your appointment is confirmed for ${props.selectedDate} at ${props.selectedTime}`,
            subject: "Booking Confirmation"
        };
        console.log("Payload ready for Pub/Sub:", notification);
        emailNotificationApiCall(notification);
    }, [props.email, props.selectedDate, props.selectedTime])

    const emailNotificationApiCall = async (notification: IEmailNotification) => {
        let res = await publishEmailNotifcation(notification);
        setIsLoading(false);
    }

    return (
        <Card sx={{ width: '100%', boxShadow: 3 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                        <CircularProgress sx={{ color: 'lightgreen' }} />
                    </Box>
                ) : (
                    <>
                        <CheckCircleIcon sx={{ fontSize: 60, color: 'lightgreen', mb: 2 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
                            Booking Confirmed!
                        </Typography>
                        <Typography sx={{ mb: 2, textAlign: 'center' }}>
                            You maintanence appointment has been scheduled for:
                        </Typography>
                        <Box sx={{ bgcolor: '#f5f5f5', p: 2, mt: 3, borderRadius: 1, width: '100%', maxWidth: 400 }}>
                            <Box sx={{ gap: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography sx={{ fontWeight: 'bold' }}>{props.selectedDate}</Typography>
                                <Typography sx={{ fontWeight: 'bold', mb: 1 }}>{props.selectedTime}</Typography>
                            </Box>
                        </Box>
                        <Typography sx={{ mt: 4, textAlign: 'center' }}>
                            A confirmation email has been sent to {props.email}
                        </Typography>
                        <Button variant="contained" sx={{ bgcolor: 'lightgreen', mt: 2, color: 'black', '&:hover': { bgcolor: '#90ee90' }, textTransform: 'none' }}>
                            Book another appointment
                        </Button>
                    </>
                )}
            </CardContent>
        </Card>
    )
}

export default BookingConfirmed;