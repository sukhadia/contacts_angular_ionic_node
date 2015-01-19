var services = angular.module('restful', ['database']);

services.config(function($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

services.factory('EmployeeService', ['EmployeeDb', '$q', function(db, $q) {
	var instance = {};

    instance.findById = function (id) {
        return $q(function(resolve, reject) {
        	db.findById(id).then(resolve, reject);
        });
            
    };

    instance.findByName = function (searchKey) {
    	return $q(function(resolve, reject) {
    		db.findAll(searchKey).then(resolve, reject);
        });
        
    };

    instance.addEmployee = function(employee) {
    	return $q(function(resolve, reject) {
	        db.add(employee).then(resolve, reject);
	    });
    };

    instance.deleteEmployee = function(employee) {
    	return $q(function(resolve, reject) {
	        db.delete(employee).then(resolve, reject);
        });
    };

    instance.sync = function() {
    	return $q(function(resolve, reject) {
	        db.sync().then(resolve, reject);
        });
    };

    return instance;
}]);