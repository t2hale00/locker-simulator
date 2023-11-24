const express=require('express');
const mysql=require('mysql');
const cors=require('cors');
const bodyParser=require('body-parser')


const app=express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


const db=mysql.createConnection({
    user:'root',
    host:'localhost',
    password:'root',
    database:'comsumerdb'
});

app.post('/cabinets',(req,res)=>{
    const {code}=req.body
    db.query("select * from cabinets where code=? ",[code],
    (err,result)=>{
        if(err){
            console.log(err);
            res.status(500).send("Internal Server Error");
        }else{
            res.send(result)
        }
    })
})


app.put('/update',(req,res)=>{
    const {code}=req.body
    db.query(
        "update cabinets set status=Case when status='reserved' then'occupied'when status='occupied' then 'available' else status end where code=?",[code],
        (err,result)=>{
            if(err){
                console.log(err);
                res.status(500).send('Internal Server Error');
            }else{
                res.send('status changed')
                console.log('status changed')
            }
        }
    )
})


app.listen(3002,()=>{
    console.log('server for simulator is running on port 3002');
    db.connect(function(err){
        if(err) throw err;
        console.log('database connected')
    })
})