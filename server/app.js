const express = require('express');
const cors = require('cors');
const app = express()
const router = express.Router();

app.use(cors());

router.get('/test', (req, res) => {
    res.json({message: "Hello World"});
});

app.use('/api', router)

const port = process.env.PORT || 4201;
app.listen(port, () => console.log("Server is listening on port " + port))