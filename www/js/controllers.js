angular.module('starter.controllers', ['ionic', 'services', 'popups', 'native'])

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

.controller('EmployeeCtrl', ['$scope', '$state', '$stateParams', '$ionicLoading', '$ionicHistory', 'PopupManager', 'EmployeeService', 'NativeDelegate', function($scope, $state, $stateParams, $ionicLoading, $ionicHistory, popupManager, service, nativeDelegate) {
  $scope.doRefresh = function() {
    service.findById(parseInt($stateParams.employeeId, 10)).then(function (employee) {
      $scope.employee = employee;
      $scope.$broadcast('scroll.refreshComplete');
    });
  }
  $scope.doRefresh();

  $scope.showLocation = function(event) {
      event.preventDefault();
      $ionicLoading.show({
        template: 'Loading...'
      });
      nativeDelegate.getCurrentPosition(
          function(position) {
            $ionicLoading.hide();
            popupManager.alert(position.coords.latitude + ',' + position.coords.longitude, 'Your GPS co-ordinates');
          },
          function() {
            $ionicLoading.hide();
            popupManager.errorAlert('Couldn\'t determine location');
          },
          {timeout: 10000}
      );
      return false;
  };

  $scope.isWithinApp = function() {
      return window.cordova || window.Cordova;
  };

  $scope.changePic = function(employee) {
      if (!navigator.camera) {
          popupManager.errorAlert('Camera API not supported');
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
         $scope.$apply(function() {
            employee.pic = "data:image/jpeg;base64,"+imgData;
         });
      }, 
      //Don't really need the following function, it's still here to show how we can access
      //a method within the same scope (isWithinApp).
      function (err) {
         if (!$scope.isWithinApp()) {
          popupManager.errorAlert('Error taking picture');
         }
      }, 
      options);
  };

  $scope.addToContacts = function(employee) {
    if (!navigator.contacts) {
        popupManager.errorAlert("Contacts API not supported");
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
    popupManager.alert('Contact Saved!');
  };

  $scope.deleteEmployee = function(employee) {
    service.deleteEmployee(employee).then(function() {
      popupManager.alert("Deleted Employee").then(function() {
          $ionicHistory.clearHistory();
          $state.go('app.search');
      });
    }, function() {
      popupManager.errorAlert("Couldn't add contact.");
    });
  };

}])

.controller('MenuCtrl', ['$scope', '$state', 'PopupManager', 'EmployeeService', function($scope, $state, popupManager, service, $ionicPopup) {
  $scope.addContact = function() {
    if (!navigator.contacts) {
      popupManager.errorAlert("Contacts API not supported");
      return;
    }
    navigator.contacts.pickContact(function(contact){
      var cellPhones = (contact.phoneNumbers)? contact.phoneNumbers.filter(function(phoneNumber) {return phoneNumber.type === 'mobile'}) : [],
        officePhones = (contact.phoneNumbers)? contact.phoneNumbers.filter(function(phoneNumber) {return phoneNumber.type === 'work'}) : [],
        employee = {
          firstName: contact.name.givenName,
          lastName: contact.name.familyName,
          cellPhone: cellPhones && cellPhones[0] && cellPhones[0].value,
          officePhone: officePhones && officePhones[0] && officePhones[0].value,
          email: contact.emails && contact.emails[0] && contact.emails[0].value
        };

      popupManager.alert("You selected to add: " + angular.toJson(employee)).then(function() {
        service.addEmployee(employee).then(function(employee) {
            if (employee) {
              popupManager.alert("Done adding employee, navigating to their employee page...").then(function() {
                  $state.go('app.single', {employeeId: employee.id});
              });
            }
        }, function() {
          popupManager.errorAlert("Couldn't add contact.");
        });
      });
    });
  };

}]);