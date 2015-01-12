angular.module('starter.controllers', ['ionic'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
})

.controller('EmployeesCtrl', function($scope, $stateParams) {
  var service = new EmployeeService();
  service.findByName($stateParams.searchString||'').done(function (employees) {
    $scope.employees = employees;
  });
  
})

.controller('SearchCtrl', function($scope, $state) {
  $scope.doSearch = function (searchString) {
    $state.go('app.employees', {searchString: searchString});
  }
  
})

.controller('EmployeeCtrl', function($scope, $stateParams, $ionicLoading) {
  var service = new EmployeeService();
  service.findById(parseInt($stateParams.employeeId, 10)).done(function (employee) {
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


})

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
