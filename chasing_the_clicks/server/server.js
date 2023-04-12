require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const https = require("https");
const path  = require("path")
app.use(express.static(path.join(__dirname + "/public")))
app.use(express.json());

//db ops connection
const password = process.env.PASSWORD;
mongoose.set("strictQuery", true);
mongoose.connect(
  "mongodb+srv://jpattrick538:" +
    password +
    "@cluster0.rfaz43j.mongodb.net/Chasingclicks",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

//schemas

const ipSchema = new mongoose.Schema({
  ip: [String],
});
const geoDataSchema = new mongoose.Schema({
  country: String,
  count: Number,
  ip_address: ipSchema,
});

const clicksSchema = new mongoose.Schema({
  id: Number,
  clicks: Number,
});

//model
const newGeoData = mongoose.model("geoData", geoDataSchema);
const ipModel = mongoose.model("ip", ipSchema);
const newClick = mongoose.model("Click", clicksSchema);

// end of db ops

//API endpoints

//clicks
app.get("/updateclicks", (req, res) => {
  newClick.find().then((item) => {
    if (item.length === 0) {
      let count = new newClick({
        id: 1,
        clicks: 0,
      });
      count.save();
      res.redirect("/updateclicks");
    }
    newClick
      .updateOne({ id: 1 }, { $inc: { clicks: 1 } })
      .catch((e) => console.log(e));
    newClick.find({ id: 1 }).then((count) => {
      res.json(count);
    });
  });
});
app.get("/getclicks", (req, res) => {
  newClick.find({ id: 1 }).then((item) => {
    if (item.length === 0) {
      let count = new newClick({
        id: 1,
        clicks: 0,
      });
      count.save();
      res.redirect("/getclicks");
    }
    res.json(item);
  });
});

//geodata
app.get("/newGeodata", (req, res) => {
  const uri = "https://api.ipregistry.co/";
  const API_KEY = process.env.API_KEY;
  let IP = (
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    ""
  )
    .split(",")[0]
    .trim();
  let options = "&fields=location.country.name";
  if (IP === "::1") {
    IP = "104.101.112.0";
  }
  let ip_addy = IP.toString();
  const url = uri + IP + "?key=" + API_KEY + options;
  https.get(url, (response) => {
    response.on("data", (data) => {
      let countryName = JSON.parse(data).location.country.name;
      newGeoData
        .find()
        .then((item) => {
          if (item.length === 0) {
            const newIp = new ipModel({ ip: [ip_addy] });
            newIp.save();
            const newGeoEntry = new newGeoData({
              country: countryName,
              count: 1,
              ip_address: newIp,
            });
            newGeoEntry.save();
            res.redirect("/newGeodata");
          } else {
            newGeoData.find({ country: countryName }).then((list) => {
              if (list.length === 0) {
                const newIp = new ipModel({ ip: [ip_addy] });
                newIp.save();
                const newGeoEntry = new newGeoData({
                  country: countryName,
                  count: 1,
                  ip_address: newIp,
                });
                newGeoEntry.save();
                // res.redirect("/newGeodata");
              } else if (!list[0].ip_address.ip.includes(IP)) {
                const newIP = ip_addy;
                newGeoData
                  .updateOne(
                    { country: countryName },
                    { $push: { "ip_address.ip": newIP }, $inc: { count: 1 } }
                  )
                  .catch((e) => console.log(e));
              }
              newGeoData.find().then((count) => {
                res.json(count);
              });
            });
          }
        })
        .catch((e) => console.log(e));
    });
  });
});

app.listen(3500 || process.env.PORT, () => {
  console.log(`Server is running on port: 3500`);
});
