const EmailTemplates = {
    customerEmail: 'customerEmail',
    technicianEmail: 'technicianEmail',
    adminEmail: 'adminEmail'
};

const BUSINESS_NAME = "AutoVivo";

const emailTemplate = {
    customerEmail: {
        subject: "Your AutoVivo Booking is Confirmed",
        body: (customerName, serviceDate, timeWindow, serviceAddress, notes) => `Hi ${customerName},
Your booking with AutoVivo has been confirmed.
Booking Details
• Service: {{ServiceName}}
• Vehicle: {{VehicleYear}} {{VehicleMake}} {{VehicleModel}}
• Date: ${serviceDate}
• Arrival Window: ${timeWindow}
• Service Location: ${serviceAddress}
• Assigned Technician: {{TechnicianName}}
Service Notes
{{PopQuestions}}
Customer Notes
${notes || 'None provided'}
What Happens Next?
• Your technician will contact you before arrival if needed
• You’ll receive reminder notifications before the appointment
• Any additional repairs or costs will require your approval first
Manage Your Booking
{{ManageBookingLink}}
Need help? Simply reply to this email and our team will assist you.
Thank you for choosing AutoVivo.
– AutoVivo Support Team
`
    },
    technicianEmail: {
        subject: (serviceDate, timeWindow) => `New Job Assigned – ${serviceDate} - ${timeWindow}`,
        body: (customerName, customerPhone, serviceDate, timeWindow, serviceAddress, notes) => `Hi {{TechnicianName}},
You’ve been assigned a new mobile service job.
Job Info
• Customer: ${customerName}
• Phone: ${customerPhone}
• Vehicle: {{VehicleYear}} {{VehicleMake}} {{VehicleModel}}
• Service: {{ServiceName}}
• Date & Time:  ${serviceDate} at ${timeWindow}
• Address: ${serviceAddress}
Notes: ${notes}
Please confirm availability or flag issues ASAP.
Thanks,
${BUSINESS_NAME}`
    },
    adminEmail: {
        subject: (customerName) => `New Booking Received – ${customerName}`,
        body: (customerName, serviceDate, timeWindow, serviceAddress, notes) => `Hi Admin,
A new booking has been created.
Customer Information
• Customer: ${customerName}
• Phone: {{CustomerPhoneNumber}}
• Email: {{CustomerEmail}}
Booking Details
• Service: {{ServiceName}}
• Vehicle: {{VehicleYear}} {{VehicleMake}} {{VehicleModel}}
• Date: ${serviceDate}
• Arrival Window: ${timeWindow}
• Location: ${serviceAddress}
• Technician: {{TechnicianName}}
Pricing
• Estimated Total: {{EstimatedTotal}}
Customer Notes
${notes || 'None provided'}
Booking ID:
{{BookingID}}
Open Booking:
{{AdminBookingLink}}
– AutoVivo Support Team
`
    }
};

module.exports = { EmailTemplates, emailTemplate };