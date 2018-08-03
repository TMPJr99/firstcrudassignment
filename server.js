var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 8000;


app.disable ('x-powered-by');

app.use(bodyParser.json());

app.post("/create", (req, res) => {
  var newUser = req.body;

  if(!newUser){
    res.sendStatus(400);
  }

  fs.readFile("./storage.json", "utf8", (err, data) => {
    if(data.includes("[")){
      let newData = JSON.parse(data)
      newData.push(newUser[0])
      fs.writeFileSync('./storage.json', JSON.stringify(newData));
    }else{
      fs.writeFileSync('./storage.json', JSON.stringify(newUser))
    }
  })
  res.json(newUser)
})

app.get('/all', (req, res) => {
  res.send(JSON.parse(fs.readFileSync("./storage.json", "utf8")))
})

app.get('/user/:id', (req, res) => {
  let all = JSON.parse(fs.readFileSync("./storage.json", "utf8"));
  let id = req.params.id;
  all.filter((item) => {
    if(item.id == id){
      res.send(item)
    }
  })
})

app.put('/user/:id', (req, res) => {
  let all = JSON.parse(fs.readFileSync("./storage.json", "utf8"));
  let user = req.body;
  let id = req.params.id;
  all.map((item) => {
    if(item.id == id){
      all.splice(all.indexOf(item), 1, user);
      fs.writeFileSync('./storage.json', JSON.stringify(all))
      res.sendStatus(200);
    }
  })
})

app.delete('/user/:id', (req, res) => {
  let all = JSON.parse(fs.readFileSync("./storage.json", "utf8"));
  let user = req.body;
  let id = req.params.id;
  all.map((item) => {
    if(item.id == id){
      all.splice(all.indexOf(item), 1);
      fs.writeFileSync('./storage.json', JSON.stringify(all))
      res.sendStatus(200);
    }
  })
})

app.listen(port, () => {
  console.log("Listening on port")
})
