import { Box, Typography } from '@mui/material'
import React from 'react'

interface IProps {
    selectedDate: string | undefined;
    selectedTime: string | null;
}

const AppointmentSummary: React.FC<IProps> = (props) => {
    return (
        <Box sx={{ bgcolor: '#f5f5f5', p: 2, mt: 3, borderRadius: 1 }}>
            <Typography variant="h6" sx={{
                fontWeight: 'bold', mb: 2, display: 'flex'
            }}>
                Appointment Summary
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Box>
                    <Typography sx={{ mb: 1, display: {xs:'flex', sm:'block'} }}>Service:</Typography>
                    <Typography sx={{ fontWeight: 'bold', display: {xs:'flex', sm:'block'} }}>Silver Package</Typography>
                </Box>
                <Box>
                    <Typography sx={{ mb: 1, display: {xs:'flex', sm:'block'} }}>Duration:</Typography>
                    <Typography sx={{ fontWeight: 'bold', display: {xs:'flex', sm:'block'} }}>60 minutes</Typography>
                </Box>
                <Box>
                    <Typography sx={{ mb: 1, display: {xs:'flex', sm:'block'} }}>Date:</Typography>
                    <Typography sx={{ fontWeight: 'bold', display: {xs:'flex', sm:'block'} }}>{props.selectedDate}</Typography>
                </Box>
                <Box>
                    <Typography sx={{ mb: 1, display: {xs:'flex', sm:'block'}}}>Time:</Typography>
                    <Typography sx={{ fontWeight: 'bold', display: {xs:'flex', sm:'block'} }}>{props.selectedTime || 'Not Selected'}</Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default AppointmentSummary;