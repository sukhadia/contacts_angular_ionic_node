var services = angular.module('services', []);

services.factory('EmployeeDb', function($q) {
	//Is there best practicess for localStorage (or sessionStorage) at PointSource?
	var instance = {},
		maxIdLogic = function(employees) {
			var maxId = -1;
			employees.forEach(function(employee) {
				maxId = (employee.id > maxId)? employee.id : maxId;
			});
			return maxId;
		};
	instance.employeeDbFromStorage = function() {
		return angular.fromJson(window.localStorage.getItem("employeeDb"))
	};

	instance.employeeDbToStorage = function(object) {
		//local 'cache' as we're removing from local storage in the next step to start clean.
		var employeeDbCache = this.employeeDbFromStorage();
		window.localStorage.removeItem("employeeDb");
		//Allows for passing in an employeeDb object or just employees array.
		window.localStorage.setItem("employeeDb", object.employees && angular.toJson(object) || angular.toJson({employees: object, unusedIDs: (employeeDbCache.unusedIDs || []), maxId: maxIdLogic(object)}));
	};

	var employees = [
            {"id": 1, "firstName": "James", "lastName": "King", "managerId": 0, "managerName": "", "title": "President and CEO", "department": "Corporate", "cellPhone": "617-000-0001", "officePhone": "781-000-0001", "email": "jking@fakemail.com", "city": "Boston, MA", "pic": "img/pics/James_King.jpg", "twitterId": "@fakejking", "blog": "http://coenraets.org"},
            {"id": 2, "firstName": "Julie", "lastName": "Taylor", "managerId": 1, "managerName": "James King", "title": "VP of Marketing", "department": "Marketing", "cellPhone": "617-000-0002", "officePhone": "781-000-0002", "email": "jtaylor@fakemail.com", "city": "Boston, MA", "pic": "img/pics/Julie_Taylor.jpg", "twitterId": "@fakejtaylor", "blog": "http://coenraets.org"},
            {"id": 3, "firstName": "Eugene", "lastName": "Lee", "managerId": 1, "managerName": "James King", "title": "CFO", "department": "Accounting", "cellPhone": "617-000-0003", "officePhone": "781-000-0003", "email": "elee@fakemail.com", "city": "Boston, MA", "pic": "img/pics/Eugene_Lee.jpg", "twitterId": "@fakeelee", "blog": "http://coenraets.org"},
            {"id": 4, "firstName": "John", "lastName": "Williams", "managerId": 1, "managerName": "James King", "title": "VP of Engineering", "department": "Engineering", "cellPhone": "617-000-0004", "officePhone": "781-000-0004", "email": "jwilliams@fakemail.com", "city": "Boston, MA", "pic": "img/pics/John_Williams.jpg", "twitterId": "@fakejwilliams", "blog": "http://coenraets.org"},
            {"id": 5, "firstName": "Ray", "lastName": "Moore", "managerId": 1, "managerName": "James King", "title": "VP of Sales", "department": "Sales", "cellPhone": "617-000-0005", "officePhone": "781-000-0005", "email": "rmoore@fakemail.com", "city": "Boston, MA", "pic": "img/pics/Ray_Moore.jpg", "twitterId": "@fakermoore", "blog": "http://coenraets.org"},
            {"id": 6, "firstName": "Paul", "lastName": "Jones", "managerId": 4, "managerName": "John Williams", "title": "QA Manager", "department": "Engineering", "cellPhone": "617-000-0006", "officePhone": "781-000-0006", "email": "pjones@fakemail.com", "city": "Boston, MA", "pic": "img/pics/Paul_Jones.jpg", "twitterId": "@fakepjones", "blog": "http://coenraets.org"},
            {"id": 7, "firstName": "Paula", "lastName": "Gates", "managerId": 4, "managerName": "John Williams", "title": "Software Architect", "department": "Engineering", "cellPhone": "617-000-0007", "officePhone": "781-000-0007", "email": "pgates@fakemail.com", "city": "Boston, MA", "pic": "img/pics/Paula_Gates.jpg", "twitterId": "@fakepgates", "blog": "http://coenraets.org"},
            {"id": 8, "firstName": "Lisa", "lastName": "Wong", "managerId": 2, "managerName": "Julie Taylor", "title": "Marketing Manager", "department": "Marketing", "cellPhone": "617-000-0008", "officePhone": "781-000-0008", "email": "lwong@fakemail.com", "city": "Boston, MA", "pic": "img/pics/Lisa_Wong.jpg", "twitterId": "@fakelwong", "blog": "http://coenraets.org"},
            {"id": 9, "firstName": "Gary", "lastName": "Donovan", "managerId": 2, "managerName": "Julie Taylor", "title": "Marketing Manager", "department": "Marketing", "cellPhone": "617-000-0009", "officePhone": "781-000-0009", "email": "gdonovan@fakemail.com", "city": "Boston, MA", "pic": "img/pics/Gary_Donovan.jpg", "twitterId": "@fakegdonovan", "blog": "http://coenraets.org"},
            {"id": 10, "firstName": "Kathleen", "lastName": "Byrne", "managerId": 5, "managerName": "Ray Moore", "title": "Sales Representative", "department": "Sales", "cellPhone": "617-000-0010", "officePhone": "781-000-0010", "email": "kbyrne@fakemail.com", "city": "Boston, MA", "pic": "img/pics/Kathleen_Byrne.jpg", "twitterId": "@fakekbyrne", "blog": "http://coenraets.org"},
            {"id": 11, "firstName": "Amy", "lastName": "Jones", "managerId": 5, "managerName": "Ray Moore", "title": "Sales Representative", "department": "Sales", "cellPhone": "617-000-0011", "officePhone": "781-000-0011", "email": "ajones@fakemail.com", "city": "Boston, MA", "pic": "img/pics/Amy_Jones.jpg", "twitterId": "@fakeajones", "blog": "http://coenraets.org"},
            {"id": 12, "firstName": "Steven", "lastName": "Wells", "managerId": 4, "managerName": "John Williams", "title": "Software Architect", "department": "Engineering", "cellPhone": "617-000-0012", "officePhone": "781-000-0012", "email": "swells@fakemail.com", "city": "Boston, MA", "pic": "img/pics/Steven_Wells.jpg", "twitterId": "@fakeswells", "blog": "http://coenraets.org"}
        ];
    instance.employeeDbToStorage({
   		employees: employees,
        //'recycle' unused ids.
        unusedIDs: [],
        //use the max attribute below only if no unusedIds and and adding an employee.
        maxId: maxIdLogic(employees)
    });

    return instance;
});

services.factory('EmployeeService', ['EmployeeDb', '$q', function(db, $q) {
	var instance = {};

    instance.findById = function (id) {
        return $q(function(resolve, reject) {
	        var	employees = db.employeeDbFromStorage().employees
	            employee = null,
	            l = employees.length;

	        for (var i = 0; i < l; i++) {
	            if (employees[i].id === id) {
	                employee = employees[i];
	                break;
	            }
	        }

	        resolve(employee);
        });
            
    };

    instance.findByName = function (searchKey) {
    	return $q(function(resolve, reject) {
	        var employees = db.employeeDbFromStorage().employees;
	        var results = employees.filter(function (element) {
	                var fullName = element.firstName + " " + element.lastName;
	                return fullName.toLowerCase().indexOf(searchKey.toLowerCase()) > -1;
	            });
	        resolve(results);
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