const db = require('./../config/mysql');
const { prepareInternalServerError, prepareSuccess, prepareResourceConflictFailure } = require('./responses')

async function handle_request(msg, callback) {
    console.log("Inside kafka log event backend");
    console.log("In handle request:" + JSON.stringify(msg));

    let resp = {};
    try {
        let post = {
            event_name: msg.eventName,
            event_time: new Date(),
            job_id: msg.jobID,
            applicant_email: msg.applicantEmail,
            recruiter_email: msg.recruiterEmail,
            city: msg.city
        }
        await db.insertQuery('INSERT INTO logging SET ?', post);
        resp = prepareSuccess({ "result:": "Event logged!" }); 
    }
    catch (error) {
            console.log("Something went wrong while logging event! : ", error);
            //don't let time out occur, send internal server error
            resp = prepareInternalServerError();
    }
    callback(null, resp);
}

module.exports = {
    handle_request: handle_request
}