let majorId = 0;
let schedule = [];
let scheduleLength = 48;
let queryResults;
let currentCourseTitle;
let currentCourseObject;
let majorView;
let smPrereqs;
let isBefore;
let inside = false;
let confirm = false;
let offered = [
    [0,1,2,3,12,13,14,15,24,25,26,27,36,37,38,39],
    [4,5,6,7,16,17,18,19,28,29,30,31,40,41,42,43],
    [8,9,10,11,20,21,22,23,32,33,34,35,44,45,46,47]
];

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
            localStorage.setItem("major", majorId.toString());
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

setSchedule = (results) => {
    queryResults = results;
    majorId = parseInt(localStorage.getItem("major"));
    console.log(majorId)
    let majorView = queryResults[2];
    for (var i=0;i<majorView.length;i++) {
        schedule[majorView[i].schedulePosition] = majorView[i];
    }
};

getSchedule = () => {
    return schedule;
};

getDroppedCourseTitle = (title) => {
    currentCourseTitle = title;
};

getDroppedCourseId = (index) => {
    schedule[index] = currentCourseObject;
    changeMade(index);
};

removeFromSchedule = (index) => {
    schedule.splice(index, 1, 0);
    console.log(schedule);
};

changeMade = (index) => {
    for (var i=0;i<queryResults[0].length;i++) {
        if (currentCourseTitle == queryResults[0][i].courseAbbreviation) 
            currentCourseObject = queryResults[0][i];
    }

    var object = { mid: majorId, cid: currentCourseObject.id};
    fetch('http://localhost:3000/getPrereqs', {
        method: 'POST',
        body: JSON.stringify(object),
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json'
        }    
    })
    .then((res) => { return res.json() })
    .then((data) => { localStorage.setItem("smPrereqs", JSON.stringify(data))
    });

    //if (!checkPrereq(index))
      //  alert("The prereq for " + currentCourseTitle + " is not listed before. Please make sure it's added before.");
    
    if (!checkQuarter(index))
        alert("This class is not offered during this quarter.");
};

checkPrereq = (index) => {
    smPrereqs = JSON.parse(localStorage.getItem("smPrereqs"));
    isBefore = false;
    for (var i=0;i<index;i++) {
        console.log(schedule);
        console.log(schedule[i]);
        if (typeof(schedule[i])=='undefined' || (typeof(schedule[i])=='null') || (typeof(schedule[i])=='empty' )) 
            continue;
        else if (schedule[i].courseAbbreviation==smPrereqs[0].courseAbbreviation)
            isBefore = true;
    }

    return isBefore;
};

checkQuarter = (index) => {
    var currentAbr = currentCourseObject.quarterOffered;
    console.log(typeof(currentAbr));
    console.log(typeof(currentCourseObject.quarterOffered[2]))

    confirm = false;
    
    inside = false;
    for (var i=0; i<offered[0].length;i++){
        console.log((parseInt(index)) == offered[0][i])
        if ((parseInt(index)) == offered[0][i]){
            inside = true;
            console.log(inside)
            console.log(currentAbr[2]==="1")
        }
    }
    if (inside && currentAbr[0]==="1")
        confirm = true;

    inside = false;
    for (var i=0; i<offered[0].length;i++){
        if ((parseInt(index)) == offered[1][i]){
            inside = true;
            console.log(inside)
            console.log(currentAbr[2]==="1")
        }
    } 
    if (inside && currentAbr[1]==="1")
        confirm = true;

    inside = false;
    for (var i=0; i<offered[0].length;i++){
        if ((parseInt(index)) == offered[2][i]) {
            inside = true;
            console.log(inside)
            console.log(currentAbr[2]==="1")
        }
    }
    if (inside && currentAbr[2]==="1")
        confirm = true;

    return confirm;
};
