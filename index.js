import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
const _dirname = dirname(fileURLToPath(import.meta.url));


const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(_dirname, "views"));

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const filePath = process.env.RENDER ? "/var/render/secrets/data.json"  : "data.json";
const users = JSON.parse(fs.readFileSync("data.json", "utf8"));


app.get("/", (req, res) => {
    res.render("login");
});

app.get("/appreciation", (req, res) => {
    res.render("appreciation");
});

app.post("/login", (req, res) => {
    const password = req.body.password.trim();
    const user = users.find(u => u.password === password);
    // const choice = req.body.choice;

    if (!user) {
        return res.render("error", {error: "Invalid password. Please try again."}); 
    } 

   const revealPrayer = req.body.revealPrayer === "true";


    return res.render("appreciation", {
        name: user.name, 
        message: user.message,
        prayertitle: revealPrayer ? user.prayertitle : null,
        prayer: revealPrayer ? user.prayer : null,
        password: password
    });
    
});





app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});