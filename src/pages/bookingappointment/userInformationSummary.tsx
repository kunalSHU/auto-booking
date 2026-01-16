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
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                    <Box>
                        <Typography sx={{ mb: 1, display: {xs:'flex', sm:'block'}}}>Name</Typography>
                        <Typography sx={{ fontWeight: 'bold', display: {xs:'flex', sm:'block'}}}>{props.userInformation.fullName}</Typography>
                    </Box>
                    <Box>
                        <Typography sx={{ mb: 1, display: {xs:'flex', sm:'block'} }}>Email</Typography>
                        <Typography sx={{ fontWeight: 'bold', display: {xs:'flex', sm:'block'}}}>{props.userInformation.email}</Typography>
                    </Box>
                    <Box>
                        <Typography sx={{ mb: 1, display: {xs:'flex', sm:'block'} }}>Phone</Typography>
                        <Typography sx={{ fontWeight: 'bold', display: {xs:'flex', sm:'block'}}}>{props.userInformation.phoneNumber}</Typography>
                    </Box>
                    <Box>
                        <Typography sx={{ mb: 1, display: {xs:'flex', sm:'block'} }}>Additional Notes</Typography>
                        <Typography sx={{ fontWeight: 'bold', display: {xs:'flex', sm:'block'}}}>{props.userInformation.additionalNotes ? props.userInformation.additionalNotes : 'None'}</Typography>
                    </Box>
                </Box>
            </Box>
  )
}

export default UserInformationSummary;