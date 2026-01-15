import React from 'react'
import AppointmentSummary from './appointmentSummary';
import { Button } from '@mui/material';
import UserInformationSummary from './userInformationSummary';

interface IProps {
    selectedDate: string | undefined;
    selectedTime: string | null;
    onBack: () => void;
    userInformation: {
        fullName: string;
        email: string;
        phoneNumber: string;
        additionalNotes: string;
    }
}

const ReviewBooking: React.FC<IProps> = (props) => {
    return (
        <>
            <AppointmentSummary selectedDate={props.selectedDate} selectedTime={props.selectedTime} />
            <UserInformationSummary userInformation={props.userInformation} />
            <Button onClick={props.onBack} variant="outlined" sx={{ color: 'black', borderColor: 'black', mt: 2 }}>Back</Button>
            <Button disabled={props.selectedTime ? false : true} variant="contained" sx={{ bgcolor: 'lightgreen', ml: 2, mt: 2, color: 'black', '&:hover': { bgcolor: '#90ee90' } }}>
                Confirm Booking
            </Button>
        </>
    )
}

export default ReviewBooking;