var services = angular.module('restful', []);
services.config(function($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
});
services.constant("myConfig", {
	urlPrefix: "http://localhost:5000"
});
services.factory('EmployeeDb', function($q, $http, myConfig) {
	var instance = {};
	instance.sync = function() {
		//TBD
	};

	instance.findAll = function(searchKey) {
		return $q (function(resolve, reject) {
			delete $http.defaults.headers.common['X-Requested-With'];
			$http({
	            method: 'GET',
	            url: myConfig.urlPrefix + '/employees?name=' + searchKey + '&callback=?',
	            dataType: 'jsonp'
	        }).then(function(results) {
	        	resolve(results.data);
	        });
		});
	};

	instance.findById = function(id) {
		return $q (function(resolve, reject) {
			delete $http.defaults.headers.common['X-Requested-With'];
			$http({
	            method: 'GET',
	            url: myConfig.urlPrefix + '/employees/' + id + '?callback=?',
	            dataType: 'jsonp'
	        }).then(function(results){
	        	resolve(results.data);
	        });
		});
	};

    return instance;
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
	        var employeeDb = db.employeeDbFromStorage();
	        	employees = employeeDb.employees;
	        employee.id = employeeDb.maxId + 1;
	        employees.push(employee);
	        db.employeeDbToStorage(employees);
	        resolve(employee);
	    });
    };

    instance.deleteEmployee = function(employee) {
    	return $q(function(resolve, reject) {
	        var	employeeDb = db.employeeDbFromStorage(),
	        	employees = employeeDb.employees,
	            l = employees.length,
	            index = -1;

	        for (var i = 0; i < l; i++) {
	            if (employees[i].id === employee.id) {
	                index = i;
	                break;
	            }
	        }
	        if (i >= 0) {
	        	employees.splice(index, 1);
	        }
	        //update 'DB' object with updated employee list
	        employeeDb.employees = employees;
	        //add ID to unused IDs array
	        employeeDb.unusedIDs.push(employee.id);
	        db.employeeDbToStorage(employeeDb);
	        resolve();
        });
    };

    return instance;
}]);