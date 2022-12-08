const express = require('express');

const Joi = require('joi');

const app = express();

app.use(express.json());

const bugs = [
    { id: 1, name: "Bug 1" },
    { id: 2, name: "Bug 2" },
    { id: 3, name: "Bug 3" },
    { id: 3, name: "Bug 3" }

]

app.get("/", (req, res) => {

    res.send("Hello world");
});


app.get("/api/bugs/", (req,res) => {

    res.send(bugs);
});

app.get("/api/bugs/:id", (req, res) => {

    const bug = bugs.find(c => c.id === parseInt(req.params.id))

    if (!bug) res.status(404).json("Bug Not Found");

    res.send(bug);
});


app.post("/api/bugs", (req, res) => {

    const { error } = validateBugs(req.body) 

    if (error) 
    return res.status(400).send(error.bugs[0].message)


    const bug = {
        id: bugs.length + 1,
        name: req.body.name
    };

    bugs.push(bug);
    res.send(bug)
});

app.put("/api/bugs/:id", (req, res) => {

    const bug = bugs.find(c => c.id === parseInt(req.params.id))

    if (!bug) res.status(404).json("Not Found");


    const { error } = validateBugs(req.body)

    if (error) 
    return res.status(400).send(error.details[0].message)

    bug.name = req.body.name;
    res.send(bug);

    function validateBugs(bug) {

        const bug_schema = {
            name: Joi.string().min(3).required()
        };

        return Joi.validate(bug, bug_schema);
    }

});

app.delete("/api/bugs/:id", (req, res) => {

    const bug = bugs.find(c => c.id === parseInt(req.params.id))

    if (!bug) res.status(404).json("Id with this bug not found!!");

    const index = bugs.indexOf(bug)

    bugs.splice(index, 1)

    res.send(bugs)

});

const port = process.env.port || 3000;

app.listen(port, () => console.log(`server is running on  port ${port}`));
