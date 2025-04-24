const express= require("express");
const app= express();
const path=require("path");
const mysql=require("mysql2");
require("dotenv").config();


const port=5000;

app.use(express.json())
app.use(express.static(path.join(__dirname,"public")));
app.set("view engine","ejs");

const db=mysql.createConnection({
    host : "localhost",
    user: "root",
    password: "ksharma2005",
    database:"school_api"
});


db.connect((err)=>{
    if (err){
        console.log("database failed to connect",err);
    }
    else{
        console.log("database connected successfully");
    }  
})

app.get("/",(req,res)=>{
    res.render("home.ejs")
})
app.get("/addSchool",(req,res)=>{
    res.render("addschool.ejs")
})


app.post("/addSchool",(req,res)=>{
    const{ name ,address ,lat ,lng,userLat,userLng}=req.body


    const q=`INSERT INTO schools(name,address,latitude,longitude) VALUES (?,?,?,?) `
    db.query(q,[name,address,lat,lng],(err,result)=>{
        if (err) {
            console.error("Error inserting post:", err);
            res.status(500).send("Error uploading post");
        } else {
            res.json({ message: "Post uploaded successfully!" });;
        }
    })
})

function toRad(deg){
    return deg* Math.PI/180;
}

function getDist(user_lat,user_lng,schl_lat,schl_lng){
    const R=6371; //radius of earth
    user_lat = parseFloat(user_lat);   // Ensure it's a number
    user_lng = parseFloat(user_lng);   // Ensure it's a number
    schl_lat = parseFloat(schl_lat);   // Ensure it's a number
    schl_lng = parseFloat(schl_lng);   
    x= toRad(schl_lng-user_lng)*Math.cos(toRad((schl_lat+user_lat)/2));
    y=toRad(schl_lat-user_lat);
    return  Math.sqrt(x*x + y*y)*R;
}


app.get('/listSchools', (req, res) => {
    const userLat = req.query.userLat;
    const userLng = req.query.userLng;

    console.log("Received User Lat: ", userLat, "User Lng: ", userLng);

    const query = 'SELECT * FROM schools';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        const schoolsDist = results.map(school => {
            // Calculate the distance for each school
            const distance = getDist(userLat, userLng, school.latitude, school.longitude);
            console.log(`School: ${school.name}, Distance: ${distance}`);
            return {
                ...school,
                distance: distance
            };
            
        });


        // Sort schools by distance
        schoolsDist.sort((a, b) => a.distance - b.distance);

        // Render the view with sorted schools
        res.render('viewschools', {
            schools: schoolsDist
        });
    });
});

app.listen(port,()=>{
    console.log(`listening to ${port}`)
})
