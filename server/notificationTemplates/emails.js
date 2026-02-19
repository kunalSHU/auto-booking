const EmailTemplates = {
    customerEmail: 'customerEmail',
    technicianEmail: 'technicianEmail',
    adminEmail: 'adminEmail'
};

const BUSINESS_NAME = "Apex Auto Hub";

const emailTemplate = {
    customerEmail: {
        subject: "Your Mobile Auto Repair Is Confirmed",
        body: (customerName, serviceDate, timeWindow, serviceAddress) => `Hi ${customerName},
Your mobile auto repair appointment with ${BUSINESS_NAME} is confirmed.
Appointment Details
• Service: {{ServiceName}}
• Vehicle: {{VehicleYear}} {{VehicleMake}} {{VehicleModel}}
• Date & Time: ${serviceDate} at ${timeWindow}
• Location: ${serviceAddress}
• Technician: {{TechnicianName}}
Estimated Cost: {{EstimatedPrice}}
(Final price may change if additional issues are found.)
Need to reschedule or cancel?
👉 {{ManageBookingLink}}
Thanks for choosing ${BUSINESS_NAME}!

${BUSINESS_NAME}
{{BusinessPhone}}
`
    },
    technicianEmail: {
        subject: (serviceDate, timeWindow) => `New Job Assigned – ${serviceDate} - ${timeWindow}`,
        body: (customerName, customerPhone, serviceDate, timeWindow, serviceAddress) => `Hi {{TechnicianName}},
You’ve been assigned a new mobile service job.
Job Info
• Customer: ${customerName}
• Phone: ${customerPhone}
• Vehicle: {{VehicleYear}} {{VehicleMake}} {{VehicleModel}}
• Service: {{ServiceName}}
• Date & Time:  ${serviceDate} at ${timeWindow}
• Address: ${serviceAddress}
Notes: {{JobNotes}}
Please confirm availability or flag issues ASAP.
Thanks,
${BUSINESS_NAME}`
    },
    adminEmail: {
        subject: (customerName) => `New Booking Received – ${customerName}`,
        body: (customerName, serviceDate, timeWindow, serviceAddress) => `Hi Admin,
A new booking has been received.
Booking Details
• Customer: ${customerName}
• Service: {{ServiceName}}
• Vehicle: {{VehicleYear}} {{VehicleMake}} {{VehicleModel}}
• Date & Time: ${serviceDate} at ${timeWindow}
• Location: ${serviceAddress}
• Technician: {{TechnicianName}}
Manage Booking:
👉 {{ManageBookingLink}}
${BUSINESS_NAME}`
    }
};

module.exports = { EmailTemplates, emailTemplate };