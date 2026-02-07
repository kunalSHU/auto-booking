import { Box, Button, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { publishEmailNotifcation, publishSmsNotifcation } from '../../apiServer/api';

interface IProps {
    selectedDate: string | undefined;
    selectedTime: string | null;
    email: string;
    activeStep: number;
    phoneNumber: string;
    customerName: string;
    resetStepper: () => void;
}

const EmailTemplates = {
    customerEmail: 'customerEmail',
    technicianEmail: 'technicianEmail',
    adminEmail: 'adminEmail'
};

const SmsTemplates = {
    customerConfirmationSms: 'customerConfirmationSms',
    adminSms: 'adminSms'
};

export interface ISMSNotification {
    date: string | undefined;
    time: string | null;
    toNumber: string;
    templateType: string;
    customerName?: string;
}

export interface IEmailNotification {
    toEmail: string;
    ccEmail?: string[];
    date: string | undefined;
    time: string | null;
    templateType: string;
}

const BookingConfirmed: React.FC<IProps> = (props) => {

    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=> {
        console.log("Booking confirmed use effect")
        prepareEmailNotification();
        prepareSmsNotifcation();
    
       // setIsLoading(false)
    }, [props.email, props.selectedDate, props.selectedTime])


    const prepareEmailNotification = () => {
        // Construct the payload matching your Avro schema
        const customerNotification: IEmailNotification = {
            toEmail: props.email,
            date: props.selectedDate,
            time: props.selectedTime,
            templateType: EmailTemplates.customerEmail
        };
        const technicianNotification: IEmailNotification = {
            toEmail: props.email,
            date: props.selectedDate,
            time: props.selectedTime,
            templateType: EmailTemplates.technicianEmail
        };
        const adminNotification: IEmailNotification = {
            toEmail: props.email,
            date: props.selectedDate,
            time: props.selectedTime,
            templateType: EmailTemplates.adminEmail
        };
        console.log("Email Notification Payload ready for Pub/Sub:", customerNotification);
        emailNotificationApiCall(customerNotification);
        emailNotificationApiCall(technicianNotification);
        emailNotificationApiCall(adminNotification);
    }

    const prepareSmsNotifcation = () => {
        // Construct the payload matching your Avro schema
        const customerConfirmationSms: ISMSNotification = {
            toNumber: props.phoneNumber,
            date: props.selectedDate,
            time: props.selectedTime,
            templateType: SmsTemplates.customerConfirmationSms,
            customerName: props.customerName
        };
        const adminNotification: ISMSNotification = {
            toNumber: props.phoneNumber,
            date: props.selectedDate,
            time: props.selectedTime,
            templateType: SmsTemplates.adminSms,
            customerName: props.customerName
        };

        console.log("SMS Notification Payload ready for Pub/Sub");
        smsNotificationApiCall(customerConfirmationSms);
        smsNotificationApiCall(adminNotification);
        
    }

    const emailNotificationApiCall = async (notification: IEmailNotification) => {
        let res = await publishEmailNotifcation(notification);
        setIsLoading(false);
    }

    const smsNotificationApiCall = async (notification: ISMSNotification) => {
        let res = await publishSmsNotifcation(notification);
        setIsLoading(false);
    }

    const bookingConfirmedClick = () => {
        props.resetStepper();
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
                        <Button variant="contained" onClick={bookingConfirmedClick} sx={{ bgcolor: '#bef264', mt: 2, color: 'black', fontWeight: 'bold', '&:hover': { bgcolor: '#a3e635' }, textTransform: 'none' }}>
                            Book another appointment
                        </Button>
                    </>
                )}
            </CardContent>
        </Card>
    )
}

export default BookingConfirmed;