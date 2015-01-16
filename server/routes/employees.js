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
],
    status = function(msg) { 
        return JSON.stringify({status: msg});
    };

employees.maxId = function() {
    var maxId = -1;
    employees.forEach(function(employee) {
        maxId = (employee.id > maxId)? employee.id : maxId;
    })
    return maxId;
};

exports.findAll = function (req, res, next) {
    var name = req.query.name;
    console.log('name: ' + name);
    if (name) {
        var results = employees.filter(function(element) {
            var fullName = element.firstName + " " + element.lastName;
            return fullName.toLowerCase().indexOf(name.toLowerCase()) > -1;
        });
        res.send(results);
    } else {
        res.send(employees);
    }
};

exports.findById = function (req, res, next) {
    var id = parseInt(req.params.id, 10),
        l = employees.length,
        employee = {};
    for (var i = 0; i < l; i++) {
        if (employees[i].id === id) {
            employee = employees[i];
            break;
        }
    }
    res.send(employee);
};

exports.addEmployee = function (req, res, next) {
    var employee = req.body,
        employeeJson = JSON.stringify(employee);
    employee.id = employee.id || (employees.maxId() + 1);
    console.log('Adding employee: ' + employeeJson);
    employees.push(employee);
    res.send(status("Successfully added employee with ID: " + employee.id));
};

exports.deleteEmployee = function (req, res, next) {
    var id = parseInt(req.params.id, 10),
        l = employees.length,
        index = -1,
        statusResp = "";
    for (var i = 0; i < l; i++) {
        if (employees[i].id === id) {
            index = i;
            break;
        }
    }
    if (index >= 0) {
        console.log('Deleting employee: ' + employees[index]);
        employees.splice(index, 1);
        statusResp = status("Successfully deleted employee with ID: " + id);
    }
    else {
        statusResp = status("Couldn't find employee with ID: " + id);
    }

    res.send(statusResp);

    
};