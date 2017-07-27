var mongoose = require('mongoose');
var Eleve = require('./models/eleve.js');
var srcListe = require('./data/list.js');

var promise = mongoose.connect('mongodb://localhost:27017/ifa', {
	useMongoClient: true,
});

promise.then(function(db) {
	console.log('db.connected');
	srcListe.forEach(function(eleveSrc){
		console.log(eleveSrc);

		var eleveToSave = new Eleve(eleveSrc);

		eleveToSave.save(function(err, success){
			if(err){
				return console.log(err);
			}
			else{
				console.log(success);
			}
		});
	})
});
