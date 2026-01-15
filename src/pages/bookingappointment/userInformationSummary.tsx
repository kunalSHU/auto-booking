import { Box, Typography } from '@mui/material';
import React from 'react'

interface IProps {
   userInformation: {
        fullName: string;
        email: string;
        phoneNumber: string;
        additionalNotes: string;
    }
}

const UserInformationSummary: React.FC<IProps> = (props) => {
    return (
    <Box sx={{ bgcolor: '#f5f5f5', p: 2, mt: 3, borderRadius: 1 }}>
                <Typography variant="h6" sx={{
                    fontWeight: 'bold', mb: 2, display: 'flex'
                }}>
                    Your Information
                </Typography>
                <Box sx={{ gap: 1 }}>
                    <Typography sx={{ display: 'flex', mb: 1 }}>Name</Typography>
                    <Typography sx={{ display: 'flex', fontWeight: 'bold', mb: 1 }}>{props.userInformation.fullName}</Typography>
                    <Typography sx={{ display: 'flex', mb: 1 }}>Email</Typography>
                    <Typography sx={{ display: 'flex', fontWeight: 'bold', mb: 1 }}>{props.userInformation.email}</Typography>
                    <Typography sx={{ display: 'flex', mb: 1 }}>Phone</Typography>
                    <Typography sx={{ display: 'flex', fontWeight: 'bold', mb: 1 }}>{props.userInformation.phoneNumber}</Typography>
                    <Typography sx={{ display: 'flex', mb: 1 }}>Additional Notes</Typography>
                    <Typography sx={{ display: 'flex', fontWeight: 'bold' }}>{props.userInformation.additionalNotes}</Typography>
                </Box>
            </Box>
  )
}

export default UserInformationSummary;