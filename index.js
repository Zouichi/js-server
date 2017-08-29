var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Eleve = require('./models/eleve.js');
var app = express();

// j'instance la connection mongo 
var promise = mongoose.connect('mongodb://localhost:27017/ifa', {
    useMongoClient: true,
});
// quand la connection est réussie
promise.then(
    () => {
        console.log('db.connected');
        // je démarre mon serveur node sur le port 3000
        app.listen(3000, function() {
            console.log('listening on 3000 and database is connected');
        });
    },
    err => {
        console.log('MONGO ERROR');
        console.log(err);
    }

);

// express configs
// j'utilise bodyparser dans toutes mes routes pour parser les res.body en json

// prends en charge les requetes du type ("Content-type", "application/x-www-form-urlencoded")
app.use(bodyParser.urlencoded({
    extended: true
}));
// prends en charge les requetes du type ("Content-type", "application/json")
app.use(bodyParser.json());
// je déclare mon dossier qui contient mes vues
app.set('views', './views');
// je déclare mon type de moteur de rendu
app.set('view engine', 'jade');

// je déclare mes fichiers statiques
app.use('/js', express.static('./client/js'));
app.use('/css', express.static('./client/css'));

// Add headers to allow CORS
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
// je renvoie l'index.html
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html')
});
app.get('/profil', function(req, res) {
    res.sendFile(__dirname + '/client/profil.html')
});



// API : 
// renvoyer toute la liste des eleves
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

// renvoie un seul eleve avec son id en param 
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

// gère les requetes post
app.post('/api/liste', function(req, res) {
    // console.log(req);
    console.log(req.body);
    console.log("my name is " + req.body.nom);
    // console.log("my name is " + req.body.nom);
    // var newUser = {
    //     nom: req.body.nom,
    //     prenom: req.body.prenom
    // };
    var eleveToSave = new Eleve(req.body);

    eleveToSave.save(function(err, success){
            if(err){
                return console.log(err);
            }
            else{
                console.log(success);
                res.send(success);

            }
        });
    
});
// gère la suppression
app.delete('/api/liste/:id', function(req, res) {
    console.log(req.body);
    Eleve.findByIdAndRemove(req.params.id,function(err, response){
        if(err){
            console.log(err);
        }
        else{
            console.log(response);
            console.log("deleted");
            res.send(200);

        }
    });
    // console.log("my name is " + req.body.nom);
    // var newUser = {
    //     nom: req.body.nom,
    //     prenom: req.body.prenom
    // };

    
});

// exemple de rendu html / jade
app.put('/api/liste/:id', function(req, res) {
    console.log(req.params);
    console.log(req.body);
    console.log(req.params.id);
    // solution 1 

    // Eleve.update({
    //     "_id": req.params.id
    // },req.body,function(err, response){
    //     if(err){
    //         console.log(err);
    //     }
    //     if(response){
    //         console.log(response);
    //         res.send(200);
    //     }
    // });

    Eleve.findByIdAndUpdate(req.params.id,req.body, { new: true }, function (err, updatedEleve) {
      if (err) return handleError(err);
      console.log(updatedEleve);
      res.status(200).send(updatedEleve);
    });

    // Eleve.findOne({
    //     "_id": req.params.id
    // }, function(err, monobject) {
    //     if (err) {
    //         console.log(err);
    //         return res.send(err);
    //     } else {
    //         return res.render('profil', {
    //             title: 'Hey',
    //             nom: monobject.nom,
    //             prenom: monobject.prenom
    //         });

    //     }
    // });
    // res.send(200);

});


// gère les requetes post
app.post('/quotes', function(req, res) {
    console.log(req.body);
    console.log("my name is " + req.body.nom);
    var newUser = {
        nom: req.body.nom,
        prenom: req.body.prenom
    };
    res.send(200);

});