let majorId = 0;
let schedule = [];
let scheduleLength = 48;
let currentCourse;
let majorView;

sendMajorId = () => {
    tempId = document.getElementById("major-options").value;
    majorId = tempId;

    var object = { id: majorId};
    if (majorId != 0) {
        fetch('http://localhost:3000/createPlan', {
            method: 'POST',
            body: JSON.stringify(object),
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json'
            }    
        })
        .then((res) => { return res.json() })
        .then((data) => { 
            localStorage.setItem("queryResults", JSON.stringify(data));
            if (parseInt(localStorage.getItem("change"))==0){
                window.location = "webpages/main-page.html";
                localStorage["change"] = "1";
            }
            else {
                window.location = "main-page.html";
            }
        });   
    }
};

getDroppedCourseTitle = (title) => {
    currentCourse = title;
};

getDroppedCourseId = (id) => {
    schedule[id] = currentCourse;
};

setSchedule = (queryResults) => {
    console.log("setting schedule..")
    let majorView = queryResults[2];
    console.log(majorView);
    for (var i=0;i<majorView.length;i++) {
        schedule[majorView[i].schedulePosition] = majorView[i];
    }
};

getSchedule = () => {
    console.log("using schedule...")
    console.log(schedule);
    console.log(localStorage.getItem("queryResults"));
    return schedule;
}