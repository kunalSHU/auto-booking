import { Box, Button, Typography, Stack, Divider, CircularProgress } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { publishEmailNotifcation, publishSmsNotifcation } from '../../apiServer/api';

interface IProps {
    selectedDate: string | undefined;
    selectedTime: string | null;
    email: string;
    activeStep: number;
    phoneNumber: string;
    customerName: string;
    address: string;
    notes: string;
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

export interface IPii {
    toEmail: string;
    customerPhone: string;
    customerName: string;
}

export interface IEmailNotification {
    pii: IPii;
    templateType: string;
    date: string;
    time: string;
    serviceAddress?: string | null | { string: string };
    notes?: string | null | { string: string };
    vehicleYear?: string | null | { string: string };
    vehicleMake?: string | null | { string: string };
    vehicleModel?: string | null | { string: string };
    estimatedPrice?: string | null | { string: string };
}

const BookingConfirmed: React.FC<IProps> = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const notificationSent = useRef(false);

    // RESTORED: Your original API call methods
    const emailNotificationApiCall = async (notification: IEmailNotification) => {
        await publishEmailNotifcation(notification);
        setIsLoading(false);
    }

    const smsNotificationApiCall = async (notification: ISMSNotification) => {
        await publishSmsNotifcation(notification);
        setIsLoading(false);
    }

    // RESTORED: The three-stage email preparation logic
    const prepareEmailNotification = () => {
        const commonPayload = {
            pii: {
                toEmail: props.email,
                customerPhone: props.phoneNumber,
                customerName: props.customerName
            },
            date: props.selectedDate || '',
            time: props.selectedTime || '',
            serviceAddress: props.address ? { string: props.address } : null,
            notes: props.notes ? { string: props.notes } : null,
            vehicleYear: null,
            vehicleMake: null,
            vehicleModel: null,
            estimatedPrice: null
        };

        const customerNotification: IEmailNotification = {
            ...commonPayload,
            templateType: EmailTemplates.customerEmail,
        };
        const technicianNotification: IEmailNotification = {
            ...commonPayload,
            templateType: EmailTemplates.technicianEmail,
        };
        const adminNotification: IEmailNotification = {
            ...commonPayload,
            templateType: EmailTemplates.adminEmail,
        };

        emailNotificationApiCall(customerNotification);
        emailNotificationApiCall(technicianNotification);
        emailNotificationApiCall(adminNotification);
    }

    const prepareSmsNotifcation = () => {
        const customerConfirmationSms: ISMSNotification = {
            toNumber: props.phoneNumber,
            date: props.selectedDate,
            time: props.selectedTime,
            templateType: SmsTemplates.customerConfirmationSms,
            customerName: props.customerName
        };
        smsNotificationApiCall(customerConfirmationSms);
    }

    useEffect(() => {
        if (notificationSent.current) return;
        notificationSent.current = true;
        
        prepareEmailNotification();
        prepareSmsNotifcation();
    }, [props.email, props.selectedDate, props.selectedTime]);

    if (isLoading) {
        return (
            <Box sx={{ minHeight: '540px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress sx={{ color: '#4a7c2c', mb: 2 }} />
                <Typography sx={{ fontWeight: 700, color: '#666' }}>Finalizing your booking...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            minHeight: '540px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            textAlign: 'center',
            pt: 4
        }}>
            {/* SUCCESS ICON */}
            <Box sx={{ 
                bgcolor: '#e8f5e9', p: 3, borderRadius: '50%', mb: 3,
                display: 'inline-flex', border: '2px solid #c8e6c9'
            }}>
                <CheckCircleIcon sx={{ color: '#4a7c2c', fontSize: '3.5rem' }} />
            </Box>

            <Box sx={{ bgcolor: '#2e7d32', color: '#fff', px: 2, py: 0.5, borderRadius: '20px', mb: 2 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '1px' }}>
                    BOOKING CONFIRMED
                </Typography>
            </Box>

            <Typography sx={{ fontWeight: 800, fontSize: '1.75rem', fontFamily: 'serif', mb: 1 }}>
                You're all set, {props.customerName.split(' ')[0]}!
            </Typography>
            
            <Typography sx={{ color: '#888', mb: 4, maxWidth: '300px', mx: 'auto', fontSize: '0.9rem' }}>
                Confirmation emails have been sent to <b>{props.email}</b>.
            </Typography>

            {/* SUMMARY BOX */}
            <Box sx={{ width: '100%', bgcolor: '#f9f9f9', borderRadius: '16px', p: 3, mb: 4, border: '1px solid #eee' }}>
                <Stack direction="row" justifyContent="space-around" divider={<Divider orientation="vertical" flexItem />}>
                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 900, color: '#bdbdbd', display: 'block' }}>DATE</Typography>
                        <Typography sx={{ fontWeight: 800 }}>{props.selectedDate}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 900, color: '#bdbdbd', display: 'block' }}>TIME</Typography>
                        <Typography sx={{ fontWeight: 800, color: '#4a7c2c' }}>{props.selectedTime}</Typography>
                    </Box>
                </Stack>
            </Box>

            <Box sx={{ mt: 'auto', width: '100%', pt: 2 }}>
                <Button 
                    fullWidth 
                    variant="contained" 
                    onClick={props.resetStepper}
                    sx={{ 
                        py: 2, borderRadius: '12px', bgcolor: '#4a7c2c', color: '#fff', 
                        boxShadow: 'none', fontWeight: 800, '&:hover': { bgcolor: '#3d6624' }
                    }}
                >
                    BOOK ANOTHER APPOINTMENT
                </Button>
            </Box>
        </Box>
    );
};

export default BookingConfirmed;