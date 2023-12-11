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

app.post("/cabinets", (req, res) => {
  const { code } = req.body;
  db.query(
    "select c.* from cabinets as c join parcel as p on c.code=p.reservationCode or c.code=p.PickupCode where c.code=? and (c.cabinetstatus='Reserved' or c.cabinetstatus='Delivered') ",
    
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

app.put("/updateForDelivery", (req, res) => {
  const { code } = req.body;
  db.query(
    "UPDATE parcel AS p JOIN cabinets AS c ON c.Code = p.reservationCode  SET  p.status = 'Parcel In Locker' ,  p.isCodeValid = false, c.cabinetstatus = 'Occupied'   WHERE p.reservationCode = ? ; ", [code],

    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.send(
          "updated for delivery"
        );
        console.log(
          "updated for delivery"
        );
      }
    }
  );
});

app.put("/updateForPickup", async (req, res) => {
  try {
    const { code } = req.body;

    // Update parcel and cabinet status
    const updateResult = await updateParcelAndCabinet(code);

    // Fetch recipient name based on pickup code
    const recipientname = await getRecipientName(code);

    // Check if recipient is a registered user
    const isRecipientRegistered = await checkIfRecipientRegistered(recipientname);

    if (isRecipientRegistered) {
      // Fetch recipient ID based on recipient name
      const recipientid = await getRecipientId(recipientname);

      // Insert notification
      await insertNotification("PickedUp", `You have picked up parcel with pickup code ${code}`, recipientid);
      console.log(`Recipient "${recipientname}" got notification`);
      res.status(200).send(`Recipient ${recipientid} got notification.`);
    } else {
      console.log(`Recipient "${recipientname}" not found in user database`);
      res.status(200).send("Recipient not a registered user");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Separate concerns into functions

async function updateParcelAndCabinet(code) {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE parcel AS p JOIN cabinets AS c ON c.Code = p.PickupCode SET p.status = 'Received', p.isCodeValid = false, c.cabinetstatus = 'Available', c.IsAvailable=true WHERE p.PickupCode = ?;",
      [code],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
          console.log('updated for pickup')
        }
      }
    );
  });
}

async function getRecipientName(code) {
  return new Promise((resolve, reject) => {
    db.query("SELECT recipientname FROM parcel WHERE PickupCode = ?", [code], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result[0].recipientname);
      }
    });
  });
}

async function checkIfRecipientRegistered(recipientname) {
  return new Promise((resolve, reject) => {
    db.query("SELECT name FROM user", (err, result) => {
      if (err) {
        reject(err);
      } else {
        const isRecipientRegistered = result.some((user) => user.name === recipientname);
        resolve(isRecipientRegistered);
      }
    });
  });
}

async function getRecipientId(recipientname) {
  return new Promise((resolve, reject) => {
    db.query("SELECT userid FROM user WHERE name = ?", [recipientname], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result[0].userid);
      }
    });
  });
}

async function insertNotification(type, content, userid) {
  return new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO notification (type, content, userid, timestamp) VALUES (?, ?, ?, NOW());',
      [type, content, userid],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}



// app.put("/insert", async (req, res) => {

//   const { code } = req.body;

// // Fetch recipient ID based on recipient name
//   db.query(

//     "SELECT recipientname  from parcel where PickupCode = ?",
//     [code],
//     async (getnameErr, getnameResult) => {
//       if (getnameErr) {
//         console.error(recipientErr);
//         res.status(500).send("Internal Server Error");
//         return;
//       }
//       const recipientname = getnameResult[0].recipientname;
   

// db.query(
//  "SELECT userid FROM user WHERE name = ?",
//     [recipientname],
//   (recipientErr,recipientResult)=>{
//     if(recipientErr){
//       console.error(recipientErr);
//       res.status(500).send('internal server error');
//       return
//     }

//     const recipientid = recipientResult[0].userid;



// // Fetch recipient ID based on recipient name
//   // Insert notification
//           db.query(
//             ' INSERT INTO notification (type, content, userid, timestamp)  VALUES ("PickedUp", "You have pickep parcel with pickup code ?", ?, NOW()); ',
//             [code,recipientid],
//             (notificationErr, notificationResult) => {
//               if (notificationErr) {
//                 console.error(notificationErr);
//                 res.status(500).send("Internal Server Error");

//               } else {
//                 res.send(`recipient ${recipientid} got notification.`);
//                 console.log(`inserted notification for picked up`);
//               }

//   }
// )
// })
// })
// })



app.listen(3002, () => {
  console.log("server for simulator is running on port 3002");
  db.connect(function (err) {
    if (err) throw err;
    console.log("database connected");
  });
});
