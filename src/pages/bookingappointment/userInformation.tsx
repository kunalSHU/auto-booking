import React from 'react'
import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AppointmentSummary from './appointmentSummary';

interface IProps {
    selectedDate: string | undefined;
    selectedTime: string | null;
    onBack: () => void;
}

const UserInformation: React.FC<IProps> = (props) => {
    return (
        <>
            <Card sx={{ width: '100%', boxShadow: 3 }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <PersonIcon sx={{ mr: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Your Information</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <Typography sx={{ display: 'flex', mb: 1, fontSize: 14 }}>Full Name *</Typography>
                        <TextField fullWidth size="small" />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <Typography sx={{ display: 'flex', mb: 1, fontSize: 14 }}>Email Address *</Typography>
                        <TextField fullWidth size="small" />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <Typography sx={{ display: 'flex', mb: 1, fontSize: 14 }}>Phone Number *</Typography>
                        <TextField fullWidth size="small" />
                    </Box>
                    <Box>
                        <Typography sx={{ display: 'flex', mb: 1, fontSize: 14 }}>Additional Notes</Typography>
                        <TextField fullWidth multiline rows={4} />
                    </Box>
                </CardContent>
                <Button variant="outlined" sx={{ color: 'black', borderColor: 'black', mb: 2 }} onClick={props.onBack}>Back</Button>
                <Button variant="contained" sx={{ bgcolor: 'lightgreen', ml: 2, mb: 2, color: 'black', '&:hover': { bgcolor: '#90ee90' } }}>
                    Review Booking
                </Button>
            </Card>
            <AppointmentSummary selectedDate={props.selectedDate} selectedTime={props.selectedTime} />
        </>
    )
}

export default UserInformation;