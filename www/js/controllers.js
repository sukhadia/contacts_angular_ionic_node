angular.module('starter.controllers', ['ionic', 'services'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
})

.controller('EmployeesCtrl', ['$scope', '$stateParams', 'EmployeeService', function($scope, $stateParams, service) {
  $scope.doRefresh = function() {
    service.findByName($stateParams.searchString||'').then(function (employees) {
      $scope.employees = employees;
      $scope.$broadcast('scroll.refreshComplete');
    });
  }

  $scope.doRefresh();
  
}])

.controller('SearchCtrl', function($scope, $state) {
  $scope.doSearch = function (searchString) {
    $state.go('app.employees', {searchString: searchString});
  }
  
})

.controller('EmployeeCtrl', ['$scope', '$stateParams', '$ionicLoading', 'EmployeeService', function($scope, $stateParams, $ionicLoading, service) {
  service.findById(parseInt($stateParams.employeeId, 10)).then(function (employee) {
    $scope.employee = employee;
  });

  $scope.showLocation = function(event) {
      event.preventDefault();
      $ionicLoading.show({
        template: 'Loading...'
      });
      navigator.geolocation.getCurrentPosition(
          function(position) {
            $ionicLoading.hide();
            alert(position.coords.latitude + ',' + position.coords.longitude);
          },
          function() {
             $ionicLoading.hide();
            alert('Error getting location');
          },
          {timeout: 10000}
      );
      return false;
  };

  $scope.isWithinApp = function() {
      return window.cordova || window.Cordova;
  };


}])

.controller('MenuCtrl', ['$scope', '$state', 'EmployeeService', function($scope, $state, service) {
  $scope.addContact = function() {
      if (!navigator.contacts) {
        alert("Contacts API not supported", "Error");
        return;
      }
      navigator.contacts.pickContact(function(contact){
        var cellPhones = contact.phoneNumbers.filter(function(phoneNumber) {return phoneNumber.type === 'mobile'}),
          officePhones = contact.phoneNumbers.filter(function(phoneNumber) {return phoneNumber.type === 'work'}),
          employee = {
            firstName: contact.name.givenName,
            lastName: contact.name.familyName,
            cellPhone: cellPhones && cellPhones[0] && cellPhones[0].value,
            officePhone: officePhones && officePhones[0] && officePhones[0].value,
            email: contact.emails && contact.emails[0] && contact.emails[0].value
          };

        alert("You selected to add: " + JSON.stringify(employee));
        service.addEmployee(employee).then(function(employee) {
          if (employee) {
            alert("Done adding employee, navigating to their employee page...");
            $state.go('app.single', {employeeId: employee.id});
          }
        }, function() {
          alert("Couldn't add contact.")
        });

      },function(err){
        console.log('Error: ' + err);
      });
  };
}])

//For some reason a regular click handler (with 'ng=click') wouldn't work for Contacts and Camera
//So created directives for the same (based on some suggestions on StackOverflow).
.directive('contacts', function() {
 return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      var employee = scope.employee;
      elm.on('click', function() {
        if (!navigator.contacts) {
            alert("Contacts API not supported", "Error");
            return;
        }

        var fullName = employee.firstName + ' ' + employee.lastName,
            phoneNumbers = [];
        phoneNumbers[0] = new ContactField('work', employee.officePhone, false);
        phoneNumbers[1] = new ContactField('mobile', employee.cellPhone, true);
        var contact = navigator.contacts.create({
            displayName: fullName, 
            nickname: fullName,
            name: {givenName: employee.firstName, familyName: employee.lastName},
            phoneNumbers: phoneNumbers
          });
        contact.save();
        alert('Contact Saved!');
      });
    }
  };
})

.directive('camera', function() {
 return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      var employee = scope.employee;
      elm.on('click', function() {
        if (!navigator.camera) {
            alert("Camera API not supported", "Error");
            return;
        }
        var options =   {   
              quality: 50,
              destinationType: Camera.DestinationType.DATA_URL,
              sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Album
              encodingType: 0,     // 0=JPG 1=PNG
              cameraDirection: 1  //NOTE: 1 is for Front-facing camera (0 - for back-facing, defalut?). 
                          //Note this is advisory only, may not always work 
                          //if the device does not support it.
          };
        navigator.camera.getPicture(function (imgData) {
           scope.$apply(function() {
              $('#emp-pic-'+employee.id).attr('src', "data:image/jpeg;base64,"+imgData);
           });
        }, function (err) {
           if (!(window.cordova || window.Cordova)) {
            alert('Error taking picture', 'Error');
           }
        }, options);
     });
    }
  };
});
