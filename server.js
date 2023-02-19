const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient } = require("mongodb");
// const { response } = require("express");
const PORT = process.env.PORT || 3000;
require("dotenv").config();

let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "successStats";

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
    (client) => {
      console.log(`Connected to ${dbName} Database`);
      db = client.db(dbName);
      app.listen(PORT, () => {
          console.log(`Server running on port ${PORT}`);
        });
        
    }
  );


app.get("/", async (request, response) => {
  try {
    const data = await db.collection("stats").find().toArray();
    response.render("index.ejs", { info: data });
  } catch (error) {
    console.error(error);
  }
});

app.get("/stories", async (request, response) => {
  try {
    const data = await db.collection("stories").find().toArray();
    response.render("stories.ejs", { info: data });
  } catch (error) {
    console.error(error);
  }
});

app.post("/addStat", async (request, response) => {
  try {
    db.collection("stats").insertOne({
      prevTitle: request.body.prevTitle,
      prevIncome: request.body.prevIncome.replace(/[$,.]/g, ""),
      techTitle: request.body.techTitle,
      techIncome: request.body.techIncome.replace(/[$,.]/g, ""),
    });
    console.log("Stat Added");
    response.redirect("/");
  } catch (errors) {
    console.error(errors);
  }
});

app.post("/addStory", async (request, response) => {
  try {
    db.collection("stories").insertOne({
      newStory: request.body.newStory,
      industry: request.body.industry,
      transTime: request.body.transTime,
      yearsExp: request.body.yearsExp,
      intNumber: request.body.intNumber,
      techEducation: request.body.techEducation,
      lastTitle: request.body.lastTitle,
      currentTitle: request.body.currentTitle,
    });
    console.log("Story Added");
    response.redirect("/stories");
  } catch (error) {
    console.error(error);
  }
});

