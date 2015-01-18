var PouchDB = require('pouchdb');
PouchDB.debug.enable('*');
var db = new PouchDB('https://neelsukhadia:cloudant01@neelsukhadia.cloudant.com/employees'),
	allDocs = function(res) {
		db.allDocs({include_docs: true}).then(function(allDocs) {
	    	res.send(allDocs && allDocs.rows.map(function(obj){ 
	    		if (obj.id.indexOf('design')<0) {
	    			obj.doc.id = obj.doc._id;
	    			return obj.doc; 
	    		}
	    	}).filter(function(doc) { 
	    		if (doc !== null) {
	    			return doc;
	    		}
	    	}));
	    });
	};


PouchDB.debug.enable('*');

exports.findAll = function (req, res, next) {
    var name = req.query.name;
    console.log('name: ' + name);
    if (!name) {
    	allDocs(res);
	} else {
		db.query('neelsDesign/nameView', {key: name, include_docs: true}).then(function(allDocs) {
	    	res.send(allDocs && allDocs.rows.map(function(obj){ 
	    		if (obj.id.indexOf('design')<0) {
	    			obj.doc.id = obj.doc._id;
	    			return obj.doc; 
	    		}
	    	}).filter(function(doc) { 
	    		if (doc !== null) {
	    			return doc;
	    		}
	    	}));
	    });
	}
};

exports.findById = function (req, res, next) {
    db.get(req.params.id).then(function (doc) {
	  res.send(doc);
	}).catch(function(err) {
		if (err.status === 404) {
			res.send({status: "Not Found!"});
		}
	});
};

exports.addEmployee = function (req, res, next) {
    var employee = req.body;
    console.log('Adding employee: ' + employee);
    db.post(employee).then(function(result) {
    	employee.id = employee._id = result.id;
    	employee._rev = result.rev;
    	res.send({status: "Sucessfully added employee.", employee: employee});
    });
    
};

exports.deleteEmployee = function (req, res, next) {
    var id = req.params.id;
    console.log('Deleting employee with id: ' + id);
    db.get(id).then(function (doc) {
		console.log('Deleting employee with id: ' + id);
    	db.remove(doc._id, doc._rev).then(function(result) {
			res.send({status: "Successfully deleted employee with id: " + id});
		});
	}).catch(function(err) {
		res.send(err);
	});
};