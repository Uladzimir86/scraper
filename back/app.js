const express = require('express');
const cors = require('cors');
const getData = require('./get-data');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.post('/', async (req, res) => {
    const {url, coef, site} = req.body;
    const answer = await getData(url, coef, site);
    res.send(answer);
})
  
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})