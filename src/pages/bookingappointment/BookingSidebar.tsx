import React from 'react';
import { Box, Button, Card, CardActions, CardContent, Typography, Divider } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

const totalServicePrice = (packages: any[]) => {
    return packages.reduce((total, item) => total + item.servicePrice, 0);
}

const BookingSidebar: React.FC = () => {
    const staticPackageAndPrices = [{serviceName: 'Silver Package', servicePrice: 1400}, {serviceName: 'Oil Service', servicePrice: 50}, {serviceName: 'Coolant Service', servicePrice: 50}]

    return (
        <Box
            sx={{
                width: { xs: '100%', sm: '325px' },
                height: { xs: 'auto', sm: 'auto' },
                background: 'linear-gradient(to bottom, #a8b888, #56680e, #a8b888)',
                flexShrink: 0,
                pb: { xs: 2, sm: 0 }
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    mt: '15%',
                    left: '-28%',
                    display: { xs: 'none', sm: 'block' }
                }}
            >
                Your Booking
            </Box>
            <Card sx={{ position: 'relative', mt: '2%', ml: { xs: 2, sm: '20px' }, mr: { xs: 2, sm: 0 }, width: { xs: 'auto', sm: '275px' } }}>
                <CardContent>
                    <Typography sx={{ fontWeight: 'bold' }}>2010 Ford Escape</Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', display: { xs: 'none', sm: 'flex' }, width: '100%' }}>
                    <Button sx={{ color: 'black', textDecoration: 'underline' }} size="small">Edit</Button>
                </CardActions>
            </Card>

            {/* Second Card: Your Cart */}
            <Card sx={{ display: 'flex', flexDirection: 'column', mt: 2, ml: { xs: 2, sm: '20px' }, mr: { xs: 2, sm: 0 }, width: { xs: 'auto', sm: '275px' }, minHeight: { sm: '200px' } }}>
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography sx={{ fontWeight: 'bold' }}>Your Cart</Typography>

                    {/* Desktop Content */}
                    <Box sx={{ display: { xs: 'none', sm: 'block' }, mt: 2 }}>
                        {staticPackageAndPrices.map((item, index) => (
                            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CheckIcon sx={{ color: 'grey.500', fontSize: 18, mr: 1 }} />
                                    <Typography variant="body2" sx={{ color: 'grey.600' }}>{item.serviceName}</Typography>
                                </Box>
                                <Typography variant="body2" sx={{ color: 'grey.600' }}>${item.servicePrice}</Typography>
                            </Box>
                        ))}

                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ color: 'grey.600', fontWeight: 'bold' }}>Sub Total:</Typography>
                            <Typography variant="body2" sx={{ color: 'grey.600', fontWeight: 'bold' }}>${totalServicePrice(staticPackageAndPrices)}</Typography>
                        </Box>
                    </Box>
                </CardContent>
                {/* Desktop Edit Button */}
                <CardActions sx={{ justifyContent: 'flex-end', display: { xs: 'none', sm: 'flex' }, width: '100%' }}>
                    <Button sx={{ color: 'black', textDecoration: 'underline' }} size="small">Edit</Button>
                </CardActions>
            </Card>
        </Box>
    );
};

export default BookingSidebar;
