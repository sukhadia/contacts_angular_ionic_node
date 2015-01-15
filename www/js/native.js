angular.module('native', ['popups'])

.factory('NativeDelegate', function(PopupManager) {
  
  return {
    getCurrentPosition: function(success, failure, options) {
      navigator.geolocation.getCurrentPosition(
          function(position) {
            success(position);
          },
          function() {
            failure();
          },
          options
      );
    }
  }
});