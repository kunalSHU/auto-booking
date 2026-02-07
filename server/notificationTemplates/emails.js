const EmailTemplates = {
    customerEmail: 'customerEmail',
    technicianEmail: 'technicianEmail',
    adminEmail: 'adminEmail'
};

const BUSINESS_NAME = "Apex Auto Hub";

const emailTemplate = {
    customerEmail: {
        subject: "Your Mobile Auto Repair Is Confirmed",
        body: (serviceDate, timeWindow) => `Hi {{CustomerName}},
Your mobile auto repair appointment with {{BusinessName}} is confirmed.
Appointment Details
• Service: {{ServiceName}}
• Vehicle: {{VehicleYear}} {{VehicleMake}} {{VehicleModel}}
• Date & Time:  ${serviceDate} at ${timeWindow}
• Location: {{ServiceAddress}}
• Technician: {{TechnicianName}}
Estimated Cost: {{EstimatedPrice}}
(Final price may change if additional issues are found.)
Need to reschedule or cancel?
👉 {{ManageBookingLink}}
Thanks for choosing {{BusinessName}}!

${BUSINESS_NAME}
{{BusinessPhone}}
`
    },
    technicianEmail: {
        subject: (serviceDate, timeWindow) => `New Job Assigned – ${serviceDate} - ${timeWindow}`,
        body: (serviceDate, timeWindow) => `Hi {{TechnicianName}},
You’ve been assigned a new mobile service job.
Job Info
• Customer: {{CustomerName}}
• Phone: {{CustomerPhone}}
• Vehicle: {{VehicleYear}} {{VehicleMake}} {{VehicleModel}}
• Service: {{ServiceName}}
• Date & Time:  ${serviceDate} at ${timeWindow}
• Address: {{ServiceAddress}}
Notes: {{JobNotes}}
Please confirm availability or flag issues ASAP.
Thanks,
{{BusinessName}}`
    },
    adminEmail: {
        subject: "New Booking Received – {{CustomerName}}",
        body: (serviceDate, timeWindow) => `Hi Admin,
A new booking has been received.
Booking Details
• Customer: {{CustomerName}}
• Service: {{ServiceName}}
• Vehicle: {{VehicleYear}} {{VehicleMake}} {{VehicleModel}}
• Date & Time: ${serviceDate} at ${timeWindow}
• Location: {{ServiceAddress}}
• Technician: {{TechnicianName}}
Manage Booking:
👉 {{ManageBookingLink}}
${BUSINESS_NAME}`
    }
};

module.exports = { EmailTemplates, emailTemplate };