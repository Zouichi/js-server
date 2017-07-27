// Start MongoDB : start mongod.exe --dbpath "/c/Users/ELEVE/Desktop/Développement/mongodata/db"

var express = require('express');
var bodyParser= require('body-parser');
var mongoose = require('mongoose');
var Eleve = require('./models/eleve.js');
var app = express();

var promise = mongoose.connect('mongodb://localhost:27017/ifa', {
  useMongoClient: true,
});

promise.then(function(db) {
  console.log('db.connected');
	app.listen(3000, function() {
	console.log('listening on 3000 and database is connected');
  });
});

app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('views', './views');
app.set('view engine', 'jade');
app.use('/js', express.static('./client/js'));
app.use('/css', express.static('./client/css'));


app.get('/', function (req, res) {
      res.sendFile(__dirname + '/client/index.html')
});

app.get('/api/liste', function(req, res) {
    Eleve.find({}, function(err, collection) {
        if (err) {
            console.log(err);
            return res.send(500);
        } else {
            return res.send(collection);
        }
    });

});

app.get('/api/liste/:id', function(req, res) {
    console.log(req.params);
    console.log(req.params.id);
    Eleve.findOne({
        "_id": req.params.id
    }, function(err, monobject) {
        if (err) {
            console.log(err);
            return res.send(err);
        } else {
            
            res.send(monobject);
        }
    });
   

});

app.post('/quotes', function(req, res) {
    console.log(req.body);
    console.log("my name is " + req.body.nom);
    var newUser = {
        nom: req.body.nom,
        prenom: req.body.prenom
    };
    res.send(200);

});

app.get('/api/liste/jade/:id', function(req, res) {
    console.log(req.params);
    console.log(req.params.id);
    Eleve.findOne({
        "_id": req.params.id
    }, function(err, monobject) {
        if (err) {
            console.log(err);
            return res.send(err);
        } else {
            return res.render('profil', {
                title: 'Hey',
                nom: monobject.nom,
                prenom: monobject.prenom
            });
           
        }
    });

});