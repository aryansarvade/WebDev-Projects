import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("homePage.ejs");
});

app.post("/definition", async (req, res) => {
  console.log(req.body);
  const word = req.body.word;
  //Using axios to get to word definition from api
  try {
    const response = await axios.get(API_URL + `${word}`);
    console.log(response.data[0]);
    const meanings = response.data[0].meanings[0].definitions;
    console.log(meanings);
    const audio = response.data[0].phonetics[0].audio;
    console.log(audio);
    res.render("homePage.ejs", {
      definitions: meanings,
      length: 0,
      audio: audio,
    });
  } catch (error) {
    console.log("Failed to make request", error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on port:${port}`);
});
