
exports.getDate = getDate;
function getDate() {
    /* Using standard javascript Date class to initialise and get the date of today */
    const today = new Date();
    const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'short'
    };
    return today.toLocaleDateString("en-US", options);
}

exports.getDay = getDay;
function getDay() {
    /* Using standard javascript Date class to initialise and get the date of today */
    const today = new Date();
    const options = {
        weekday: 'long',
    };
    return today.toLocaleDateString("en-US", options);
}