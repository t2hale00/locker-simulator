const express=require('express');
const mysql=require('mysql');
const cors=require('cors');


const app=express();

app.use(cors());
app.use(express.json());


const db=mysql.createConnection({
    user:'root',
    host:'localhost',
    password:'root',
    database:'comsumerdb'
});


app.listen(3002,()=>{
    console.log('server for simulator is running on port 3002');
    db.connect(function(err){
        if(err) throw err;
        console.log('database connected')
    })
})