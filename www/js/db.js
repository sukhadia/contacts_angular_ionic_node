var database = angular.module('database', []);

database.constant("myConfig", {
	urlPrefix: "http://localhost:5000"
});

database.factory('EmployeeDb', function($q, $http, myConfig) {
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
		        	resolve(results.data);
		        });
			});
		};

	instance.sync = function() {
		return $q (function(resolve, reject) {
			httpCORS('GET', '/sync')
			.then(function(data){ 
				if (data.status === 'Sync completed.') 
					resolve(); 
				else  
					reject();
			}, reject);
		});
	};

	instance.findAll = function(searchKey) {
		return $q (function(resolve, reject) {
			httpCORS('GET', '/employees?name=' + (searchKey && searchKey.toLowerCase() || ''))
			.then(function(data) { 
				resolve(data); 
			}, reject);
		});
	};

	instance.findById = function(id) {
		return $q (function(resolve, reject) {
			httpCORS('GET', '/employees/' + id)
			.then(function(data) { 
				resolve(data); 
			}, reject);
		});
	};

	instance.add = function(employee) {
		return $q (function(resolve, reject) {
			httpCORS('POST', '/employees/', employee)
			.then(function(data) { 
				resolve(data.employee); 
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
