const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const port = 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// 🔗 Initialize Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/addSchool", (req, res) => {
  res.render("addschool.ejs");
});

// ➕ Add school (Insert)
app.post("/addSchool", async (req, res) => {
  const { name, address, lat, lng } = req.body;

  const { error } = await supabase
    .from("schools")
    .insert([{ name, address, latitude: lat, longitude: lng }]);

  if (error) {
    console.error("Error inserting school:", error);
    return res.status(500).send("Error uploading school");
  }

  res.json({ message: "School added successfully!" });
});

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function getDist(user_lat, user_lng, schl_lat, schl_lng) {
  const R = 6371;
  user_lat = parseFloat(user_lat);
  user_lng = parseFloat(user_lng);
  schl_lat = parseFloat(schl_lat);
  schl_lng = parseFloat(schl_lng);
  const x = toRad(schl_lng - user_lng) * Math.cos(toRad((schl_lat + user_lat) / 2));
  const y = toRad(schl_lat - user_lat);
  return Math.sqrt(x * x + y * y) * R;
}

// 📍 List schools sorted by proximity
app.get("/listSchools", async (req, res) => {
  const userLat = req.query.userLat;
  const userLng = req.query.userLng;

  const { data: schools, error } = await supabase.from("schools").select("*");

  if (error) {
    return res.status(500).json({ message: "Database error", error });
  }

  const schoolsDist = schools.map((school) => ({
    ...school,
    distance: getDist(userLat, userLng, school.latitude, school.longitude),
  }));

  schoolsDist.sort((a, b) => a.distance - b.distance);

  res.render("viewschools", {
    schools: schoolsDist,
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
