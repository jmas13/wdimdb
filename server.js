var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser')

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function(req, res){
  res.sendFile(__dirname + "/index.html");
})

app.get('/favorites', function(req, res){
  var data = fs.readFileSync('./data.json');  //going to want to make this async
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

app.post('/favorites', function(req, res){
  if(!req.body.title || !req.body.imdbId){  //make sure these match XMLHttpRequest exactly
    res.status(500); //maybe code 400?
    res.json({error: "name and imdbId required to post"});
  }
  var data = JSON.parse(fs.readFileSync('./data.json'));
  data.push(req.body);
  fs.writeFile('./data.json', JSON.stringify(data));
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Listening on port", (process.env.PORT || 3000));
});
