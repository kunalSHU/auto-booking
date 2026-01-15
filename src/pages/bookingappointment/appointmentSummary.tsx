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
                <Box sx={{ gap: 1 }}>
                    <Typography sx={{ display: 'flex', mb: 1 }}>Service:</Typography>
                    <Typography sx={{ display: 'flex', fontWeight: 'bold', mb: 1 }}>Silver Package</Typography>
                    <Typography sx={{ display: 'flex', mb: 1 }}>Date:</Typography>
                    <Typography sx={{ display: 'flex', fontWeight: 'bold', mb: 1 }}>{props.selectedDate}</Typography>
                    <Typography sx={{ display: 'flex', mb: 1 }}>Time:</Typography>
                    <Typography sx={{ display: 'flex', fontWeight: 'bold', mb: 1 }}>{props.selectedTime || 'Not Selected'}</Typography>
                    <Typography sx={{ display: 'flex', mb: 1 }}>Duration:</Typography>
                    <Typography sx={{ display: 'flex', fontWeight: 'bold' }}>60 minutes</Typography>
                </Box>
            </Box>
  )
}

export default AppointmentSummary;