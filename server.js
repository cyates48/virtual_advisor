var express = require('express'); 
var app = express();  
var port = 3000; 
var path = require("path");
var mysql = require('mysql');
var bodyParser = require('body-parser');

// To parse requests and get body info
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Create connection and connect to MySQL db
const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'virtualadvisor'
});
connection.connect( (err) => {
    if (err) throw err;	
    console.log("Connected to MySQL database!");
});

// Renders the index.html
app.use(express.static(__dirname));

app.get('/', (req,res) => {    
    res.sendFile(path.join(__dirname + '/webpages/initial-page.html'));
});

// Listen
app.listen(port, () => console.log(`Server started on ${port}`));


// Types of list view
const listTypes = [
    { table: 'CourseInMajor', id: 'majorId' },
    { table: 'CourseInMinor', id: 'minorId' },
    { table: 'Department', id: 'id' }
];


// Sets up the 4 year plan and initializes the two list views (major, core)
app.post('/createPlan', (req, res) => {
    let majorId = parseInt(req.body.id);
    let queryResults = [];

    // Collects courses in the major view
    let majorViewQuery = 'select * from `Course` where id in (select courseId from `CourseInMajor` where majorId=' + majorId + ');';
    connection.query(majorViewQuery, (err, majorResults) => {
        if (err) {
	    	console.log("Error ocurred.", err);
  	    	res.send({err});
        }
        else {
            queryResults.push(majorResults);

            // Collects core classes for the core list view
            let coreViewQuery = 'select * from `Core`';
            connection.query(coreViewQuery, (err, coreResults) => {
                if (err) {
                    console.log("Error ocurred.", err);
                    res.send({err});
                }
                else {
                    queryResults.push(coreResults);

                    // Collects classes that go in 4 year schedule
                    let majorScheduleQuery = 'select * from `Course` INNER JOIN `CourseInMajor` on `Course`.id = `CourseInMajor`.courseId where `CourseInMajor`.majorId=' + majorId + ';';
                    connection.query(majorScheduleQuery, (err, planResults) => {
                        if (err) {
                            console.log("Error ocurred.", err);
                            res.send({err});
                        }
                        else  {
                            queryResults.push(planResults);
                            
                            let prereqQuery = 'select * from `Prerequisite` where courseId in (select courseId from `CourseInMajor` where majorId=' + majorId + ');';
                            connection.query(prereqQuery, (err, prereqResults) => {
                                if (err) {
                                    console.log("Error ocurred.", err);
                                    res.send({err});
                                }
                                else {
                                    queryResults.push(prereqResults);
                                    res.send(queryResults);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

app.post('/getPrereqs', (req, res) => {
    console.log(req.body)
    let majorId = parseInt(req.body.mid);
    let courseId = parseInt(req.body.cid);
    let prereqQuery = 'select courseId, prereqCourseId, courseAbbreviation from `Prerequisite` INNER JOIN `Course` on `prerequisite`.prereqCourseId=`course`.id where `Course`.id in (select courseId from `CourseInMajor` where majorId='+majorId+') and courseId=' +courseId+';';
    connection.query(prereqQuery, (err, results) => {
        if (err) {
	    	console.log("Error ocurred.", err);
  	    	res.send({err});
        }
        else {
            console.log(results)
            res.send(results);
        }
    });
});

// Gets a list view for a major [0], minor [1], or dept [1]
app.get('/getList', (req, res) => {
    let listObject = listTypes[req.body.index];
    let query = 'select * from `' +  listObject.table + '` where majorId=' + listObject.id;
    connection.query(query, (err, results) => {
        if (err) {
	    	console.log("Error ocurred.", err);
  	    	res.send({err});
        }
        else {
            res.send(results);
        }
    });
});
