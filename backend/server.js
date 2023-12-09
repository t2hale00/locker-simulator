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
    "UPDATE parcel AS p JOIN cabinets AS c ON c.Code = p.reservationCode OR c.Code = p.pickupCode SET  p.status = CASE  WHEN p.status = 'Parcel Not Delivered' THEN 'Parcel In Locker' WHEN p.status = 'Parcel Ready For Pickup' THEN 'Parcel Received'   ELSE p.status END,  p.isCodeValid = false, c.cabinetstatus = CASE     WHEN c.cabinetstatus = 'Reserved' THEN 'Occupied'  WHEN c.cabinetstatus = 'Delivered' THEN 'Available'  ELSE c.cabinetstatus END  ,c.IsAvailable=CASE WHEN c.cabinetstatus = 'Delivered' THEN true ELSE c.IsAvailable END WHERE p.reservationCode = ? OR p.PickupCode = ?; ", [code,code],

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


app.put("/insert", async (req, res) => {

  const { code } = req.body;

// Fetch recipient ID based on recipient name
  db.query(

    "SELECT recipientname  from parcel where PickupCode = ?",
    [code],
    async (getnameErr, getnameResult) => {
      if (getnameErr) {
        console.error(recipientErr);
        res.status(500).send("Internal Server Error");
        return;
      }
      const recipientname = getnameResult[0].recipientname;
   

db.query(
 "SELECT userid FROM user WHERE name = ?",
    [recipientname],
  (recipientErr,recipientResult)=>{
    if(recipientErr){
      console.error(recipientErr);
      res.status(500).send('internal server error');
      return
    }

    const recipientid = recipientResult[0].userid;



// Fetch recipient ID based on recipient name
  // Insert notification
          db.query(
            ' INSERT INTO notification (type, content, userid, timestamp)  VALUES ("PickedUp", "You have pickep parcel with pickup code ?", ?, NOW()); ',
            [code,recipientid],
            (notificationErr, notificationResult) => {
              if (notificationErr) {
                console.error(notificationErr);
                res.status(500).send("Internal Server Error");

              } else {
                res.send(`recipient ${recipientid} got notification.`);
                console.log(`inserted notification for picked up`);
              }

  }
)
})
})
})



app.listen(3002, () => {
  console.log("server for simulator is running on port 3002");
  db.connect(function (err) {
    if (err) throw err;
    console.log("database connected");
  });
});
