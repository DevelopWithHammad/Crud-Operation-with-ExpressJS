import Express from "express";
const app = Express();
import fs from "fs";
import studentsData from "./studentsData.js";
const PORT = 8000;
fs.readFileSync("./studentsData.js", "utf-8");


app.use(Express.json())

app.get('/', (req, res) => {
    res.send("Welcome to my website!")
})
app.get('/api/students', (req, res) => {
    res.send(studentsData)
})




app.post('/api/students', (req, res) => {
    const newStudent = {
        id: studentsData.length + 1,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
    }
    fs.writeFile("./studentsData.js", newStudent, (err, data) => {
        console.log(data);
        console.log(err);
    })
    studentsData.push(newStudent)
    res.send(studentsData)
})




app.listen(PORT, () => {
    console.log("Welcome to my website!")
})



