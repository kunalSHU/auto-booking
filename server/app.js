const express = require('express');
const app = express()

app.get('/', (req, res) => {
    res.json({message: "Hello World"});
});

const port = process.env.PORT || 4201;
app.listen(port, () => console.log("Server is listening on port " + port))