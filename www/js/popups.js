angular.module('popups', ['ionic'])

.factory('PopupManager', ['$ionicPopup', '$q', function($ionicPopup, $q) {
  var options = function (message, title) {
      return {
         title: title||'Alert',
         template: message,
       };
  };
  return {
    alert: function(message, title) {
      return $q(function(resolve, reject) {
        $ionicPopup.alert(options(message, title)).then(resolve, reject);
      });
    },
    errorAlert: function(message) {
      return $q(function(resolve, reject) {
        $ionicPopup.alert(angular.extend({okType: 'button-assertive'}, options(message, 'Error')))
          .then(resolve, reject);
      });
    }
  }
}]);