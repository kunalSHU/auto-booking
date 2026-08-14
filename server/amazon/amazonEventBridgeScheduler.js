const SchedulerClient = require("@aws-sdk/client-scheduler").SchedulerClient;
const CreateScheduleCommand = require("@aws-sdk/client-scheduler").CreateScheduleCommand;
const DeleteScheduleCommand = require("@aws-sdk/client-scheduler").DeleteScheduleCommand;
const dayjs = require('dayjs'); 
const scheduler = new SchedulerClient({ region: "us-east-1" });
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);


// Make appointmentTime a dayjs object for easier manipulation
async function createSchedule(appointmentId, userEmail, appointmentTime, phoneNumber, customerName) {

    console.log(`Creating schedule for appointmentId: ${appointmentId}, userEmail: ${userEmail}, appointmentTime: ${appointmentTime}, phoneNumber: ${phoneNumber}, customerName: ${customerName}`);

    const scheduleName = `appointment-${appointmentId}`;
    const baseTime = dayjs(appointmentTime);
    const targetTriggerTime = baseTime.utc().subtract(1, 'hour');
    
    // 2. Format expression cleanly for AWS Scheduler
    const scheduleExpression = `at(${targetTriggerTime.format('YYYY-MM-DDTHH:mm:ss')})`;

    const createScheduleCommand = new CreateScheduleCommand({
        Name: scheduleName,
        FlexibleTimeWindow: {
            Mode: "OFF"
        },
        Target: {
            Arn: process.env.REMINDER_LAMBDA_ARN,
            RoleArn: process.env.EVENTBRIDGE_SCHEDULER_ROLE_ARN,
            Input: JSON.stringify({
                appointmentId: appointmentId,
                phoneNumber: phoneNumber.startsWith('+') ? phoneNumber : `+1${phoneNumber}`,
                customerName: customerName,
                appointmentTime: baseTime.format()
            })
        },
        ScheduleExpression: scheduleExpression
    });

    console.log(`Sending CreateScheduleCommand for scheduleName: ${scheduleName} to trigger at: ${targetTriggerTime.toISOString()}`);
    return await scheduler.send(createScheduleCommand);
}

async function deleteSchedule(appointmentId) {
    const scheduleName = `appointment-${appointmentId}`;

    try {
        const deleteScheduleCommand = new DeleteScheduleCommand({
            Name: scheduleName
        });
        console.log(`Sending DeleteScheduleCommand for scheduleName: ${scheduleName}`);
        const res = await scheduler.send(deleteScheduleCommand);
        return res;
    } catch (error) {
        console.error(`Error deleting schedule ${scheduleName}:`, error);
        throw error;
    }
}

module.exports = { createSchedule, deleteSchedule };