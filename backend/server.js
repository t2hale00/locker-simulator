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
  password: "root",
  database: "consumerdbtest",
});

app.post("/cabinets", (req, res) => {
  const { code } = req.body;
  db.query(
    "select * from cabinets where code=? ",
    
    [code],
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
  const { code } = req.body;
  db.query(
    "update parcel as p " +
      "join cabinets as c on c.code = p.reservationCode " +
      "set p.status = case when p.status = 'Parcel Not Delivered' then 'Parcel In Locker' when p.status = 'Parcel Ready for Pickup' then 'Parcel Received' else p.status end, " +
      "p.isCodeValid = false, " +
      "c.cabinetstatus = case when c.cabinetstatus = 'Reserved' then 'Occupied' when c.cabinetstatus = 'Delivered' then 'available' else c.cabinetstatus end " +
      "where p.reservationCode = ?",
    [code],
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
