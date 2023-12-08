const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "LEAHmae185!!!",
  database: "consumerdb",
});

// API endpoint to get all locations
app.get('/locations', (req, res) => {
  const query = 'SELECT * FROM locations';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching locations:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

// API endpoint to open Cabinet using Code
app.get("/cabinets", (req, res) => {
  const { Code } = req.query;  // Use req.query instead of req.body
  db.query(
    "select * from cabinets where Code=? ",
    
    [Code],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.send(result);
      }
    }
  );
});



app.put("/update", (req, res) => {
  const { Code } = req.body;
  db.query(
    "update parcels as p " +
      "join cabinets as c on c.code = p.reservationcode " +
      "set p.status = case when p.status = 'tosend' then 'todelivery' when p.status = 'topickup' then 'done' else p.status end, " +
      "p.iscodevalid = false, " +
      "c.cabinetstatus = case when c.cabinetstatus = 'tosend' then 'todelivery' when c.cabinetstatus = 'topickup' then 'available' else c.cabinetstatus end " +
      "where p.reservationcode = ?",
    [Code],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.send(
          "Status changed, code invalidated, and cabinet status updated"
        );
        console.log(
          "Status changed, code invalidated, and cabinet status updated"
        );
      }
    }
  );
});

app.listen(3002, () => {
  console.log("server for simulator is running on port 3002");
  db.connect(function (err) {
    if (err) throw err;
    console.log("database connected");
  });
});
