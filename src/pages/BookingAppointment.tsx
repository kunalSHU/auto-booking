import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardActions, CardContent, Typography, Stepper, Step, StepLabel, StepIconProps, Divider, LinearProgress } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Dayjs } from 'dayjs';

const steps = [1, 2, 3, 4, 5];

const CustomStepIcon = (props: StepIconProps) => {
    const { active, icon } = props;
    return (
        <Box
            sx={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                bgcolor: active ? 'lightgreen' : '#e0e0e0',
                color: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
            }}
        >
            {icon}
        </Box>
    );
};

const totalServicePrice = (packages: any[]) => {
    return packages.reduce((total, item) => total + item.servicePrice, 0);
}

const BookingAppointment: React.FC = () => {

    // To be removed, just for testing
    const staticPackageAndPrices = [{serviceName: 'Silver Package', servicePrice: 1400}, {serviceName: 'Oil Service', servicePrice: 50}, {serviceName: 'Coolant Service', servicePrice: 50}]
    const [value, setValue] = useState<Dayjs | null>(null);
    const [isSelected, setIsSelected] = useState(false);
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        if (value) {
            console.log(value.format('dddd, MMMM D, YYYY'));
        }
    }, [value])

    // xs = mobile screens
    // sm = larger screens
    return (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, minHeight: '100vh' }}>
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
            <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 5 }, display: 'flex', flexDirection: 'column', bgcolor: '#f5f5f5' }}>
                <Card sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2 }}>
                    <Typography variant="h5" sx={{ position:'relative', fontWeight: 'bold', color: '#394508', paddingLeft:'5%' }}>APEX Auto Hub</Typography>
                    <Typography variant="subtitle1" sx={{ mb: 3, color: 'text.secondary' }}>Book your maintanence appointment</Typography>

                    <Box sx={{ mb: 5 }}>
                        <Stepper activeStep={activeStep} alternativeLabel connector={null}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel StepIconComponent={CustomStepIcon} />
                                </Step>
                            ))}
                        </Stepper>
                        <LinearProgress variant="determinate" value={(activeStep / steps.length) * 100} sx={{ mt: 1, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: 'lightgreen' } }} />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateCalendar
                                value={value}
                                onChange={(newValue) => {
                                    setValue(newValue)
                                    setIsSelected(true)
                                }}
                            />
                        </LocalizationProvider>
                    </Box>
                    {isSelected ? <Box sx={{ display: { xs: 'block', sm: 'block' }, mt: {xs: 2, sm: 2} }}>
                        Selected: {value?.format('dddd, MMMM D, YYYY')}
                            <Button fullWidth variant="contained" sx={{ bgcolor: 'lightgreen', mt:{xs: 2, sm: 2}, color: 'black', '&:hover': { bgcolor: '#90ee90' } }}>
                                Next
                            </Button>
                        </Box>: <></>
                    }
                </Card>
            </Box>
        </Box>
    )
}

export default BookingAppointment;