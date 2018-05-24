const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const sql = require('mssql')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

const dbConfig = {
    user: 'park',
    password: 'park**',
    server: '192.168.66.233', // You can use 'localhost\\instance' to connect to named instance
    database: 'PARKING',
 
    options: {
        encrypt: false // Use this if you're on Windows Azure
    }
}

// DB ConnectionPool
async function executeQuery(res, query) {
    return new Promise((resolve, reject) => {
        new sql.ConnectionPool(dbConfig).connect().then(pool => {
            return pool.request().query(query)
        }).then(result => {
            resolve(result.recordset);
            res.send(result.recordset);
            sql.close();
        }).catch(err => {
            reject(err)
            res.send(err)
            sql.close();
        });
    });
}

//GET API
app.get("/:parkingZoneId/:startDate/:endDate", function(req, res){
	// console.log(req.params);
    var query = "SELECT car_no, in_time, out_time FROM [parkingData] WHERE in_time >= '" + 
                req.params.startDate + " 00:00:00" + 
                "' AND in_time <= '" + req.params.endDate + " 23:59:59'";
    executeQuery(res, query);
});

app.listen(process.env.PORT || 8081)