var services = angular.module('restful', []);
services.config(function($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
});
services.constant("myConfig", {
	urlPrefix: "http://localhost:5000"
});
services.factory('EmployeeDb', function($q, $http, myConfig) {
	var instance = {},
		httpCORS = function(method, urlSuffix, payload) {
			return $q (function(resolve, reject) {
				delete $http.defaults.headers.common['X-Requested-With'];
				$http({
		            method: method,
		            url: myConfig.urlPrefix + urlSuffix + ((urlSuffix.indexOf('?')>=0)? '&' : '?') + 'callback=?',
		            dataType: 'jsonp',
		            data: payload
		        }).then(function(results) {
		        	resolve(results);
		        });
			});
		};

	instance.sync = function() {
		//TBD
	};

	instance.findAll = function(searchKey) {
		return $q (function(resolve, reject) {
			httpCORS('GET', '/employees?name=' + (searchKey && searchKey.toLowerCase() || ''))
			.then(function(results) { 
				resolve(results.data); 
			}, reject);
		});
	};

	instance.findById = function(id) {
		return $q (function(resolve, reject) {
			httpCORS('GET', '/employees/' + id)
			.then(function(results) { 
				resolve(results.data); 
			}, reject);
		});
	};

	instance.add = function(employee) {
		return $q (function(resolve, reject) {
			httpCORS('POST', '/employees/', employee)
			.then(function(results) { 
				resolve(results.data.employee); 
			}, reject);
		});
	};

	instance.delete = function(employee) {
		return $q (function(resolve, reject) {
			httpCORS('DELETE', '/employees/' + employee._id)
			.then(resolve, reject);
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
	        db.add(employee).then(resolve, reject);
	    });
    };

    instance.deleteEmployee = function(employee) {
    	return $q(function(resolve, reject) {
	        db.delete(employee).then(resolve, reject);
        });
    };

    return instance;
}]);