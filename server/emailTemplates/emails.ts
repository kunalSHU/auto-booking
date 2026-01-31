export const emailTemplates = {
    customerEmail: {
        subject: "Your Mobile Auto Repair Is Confirmed",
        body: `Hi {{CustomerName}},
Your mobile auto repair appointment with {{BusinessName}} is confirmed.
Appointment Details
• Service: {{ServiceName}}
• Vehicle: {{VehicleYear}} {{VehicleMake}} {{VehicleModel}}
• Date & Time: {{ServiceDate}} at {{TimeWindow}}
• Location: {{ServiceAddress}}
• Technician: {{TechnicianName}}
Estimated Cost: {{EstimatedPrice}}
(Final price may change if additional issues are found.)
Need to reschedule or cancel?
👉 {{ManageBookingLink}}
Thanks for choosing {{BusinessName}}!

{{BusinessName}}
{{BusinessPhone}}
`
    },
    technicianEmail: {
        subject: "New Job Assigned – {{ServiceDate}} {{TimeWindow}}",
        body: `Hi {{TechnicianName}},
You’ve been assigned a new mobile service job.
Job Info
• Customer: {{CustomerName}}
• Phone: {{CustomerPhone}}
• Vehicle: {{VehicleYear}} {{VehicleMake}} {{VehicleModel}}
• Service: {{ServiceName}}
• Date & Time: {{ServiceDate}} at {{TimeWindow}}
• Address: {{ServiceAddress}}
Notes: {{JobNotes}}
Please confirm availability or flag issues ASAP.
Thanks,
{{BusinessName}}`
    },
    adminEmail: {
        subject: "New Booking Received – {{CustomerName}}",
        body: `Hi {{CustomerName}},
Just a reminder about your upcoming mobile auto repair appointment:
• Date: {{ServiceDate}}
• Time: {{TimeWindow}}
• Service: {{ServiceName}}
• Location: {{ServiceAddress}}
Please ensure your vehicle is accessible and keys are available if needed.
Need changes?
👉 {{ManageBookingLink}}
See you soon!
{{BusinessName}}`
    }
}