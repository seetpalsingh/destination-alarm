function snoozshare() {
    angular.element(document.getElementById("mainCtrl")).scope().run()
}
var set_alarm = angular.module("set_alarm", ["ngAnimate"]);
set_alarm.controller("mainCtrl", ["$scope", "$timeout", function($scope, $timeout) {
    function ifsnoozed() {
        snoozalarm = window.localStorage.getItem("snoozalarm")
    }
    function available() {
        $scope.offline = !1,
        $scope.$apply()
    }
    function onOffline() {
        $scope.inform("Check your Internet connection"),
        $scope.offline = !0,
        $scope.$apply()
    }
    function goingTo(source, destination) {
        var service = new google.maps.DistanceMatrixService;
        service.getDistanceMatrix({
            origins: [source],
            destinations: [destination],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: !1,
            avoidTolls: !1
        }, function(response, status) {
            if (status == google.maps.DistanceMatrixStatus.OK && "ZERO_RESULTS" != response.rows[0].elements[0].status) {
                var distance = response.rows[0].elements[0].distance;
                response.rows[0].elements[0].duration.text,
                document.getElementById("dvDistance"),
                $scope.liveDistance = distance.text,
                $scope.str = parseFloat(distance.value);
                var alarmGap = 1e3 * parseFloat($scope.alarmGap);
                $scope.$apply(),
                $scope.str < alarmGap && ($scope.inform("Volla! Welcome to your destination"),
                $scope.vibrate([100, 500, 100, 500, 100, 500, 1e3]),
                navigator.geolocation.clearWatch(watchPOS),
                $scope.alarmed = !1,
                $scope.$apply())
            } else
                $scope.inform("Unable to track your location")
        }
        )
    }
    function sharenow() {
        snoozalarm || (m + 1) % 2 && document.getElementById("sharenow").click()
    }
    $scope.offline = !1,
    $scope.about = !0,
    $scope.canTrace = !1,
    $scope.alarmGap = 2,
    $scope.vibratealarm = !0;
    var snoozalarm = !1;
    ifsnoozed(),
    $scope.run = function() {
        window.localStorage.setItem("snoozalarm", !0),
        snoozalarm = !0
    }
    ,
    $scope.dt = new Date;
    var m = $scope.dt.getDay();
    $scope.vibrate = function(range) {
        $scope.vibratealarm && navigator.vibrate(range)
    }
    ,
    $scope.inform = function(info) {
        window.plugins.toast.showLongTop(info)
    }
    ,
    document.addEventListener("offline", onOffline, !1)
	,document.addEventListener("online", available, !1)
	;
    var source, destination, directionsDisplay, directionsService = new google.maps.DirectionsService;
    google.maps.event.addDomListener(window, "load", function() {
        new google.maps.places.SearchBox(document.getElementById("txtDestination")),
        directionsDisplay = new google.maps.DirectionsRenderer({
            draggable: !1
        })
    }
    ),
    $scope.GetRoute = function() {
        function got_error2(status) {
            $scope.inform("Enable GPS/location")
        }
        function showPosition(position) {
            $scope.vibrate([100]),
            $scope.canTrace = !0;
            var current_location = new google.maps.LatLng(position.coords.latitude,position.coords.longitude)
              , mapOptions = {};
            map = new google.maps.Map(document.getElementById("dvMap"),mapOptions),
            directionsDisplay.setMap(map),
            source = current_location,
            destination = document.getElementById("txtDestination").value;
            var request = {
                origin: source,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING
            };
            directionsService.route(request, function(response, status) {
                status == google.maps.DirectionsStatus.OK && directionsDisplay.setDirections(response)
            }
            ),
            goingTo(source, destination)
        }
        navigator.geolocation.getCurrentPosition(showPosition, got_error2, {
            timeout: 3e4,
            enableHighAccuracy: !0
        })
    }
    ,
    $scope.alarmed = !1;
    var watchPOS, inito = function() {
        function geolocationSuccess(position) {
            var source = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
            goingTo(source, destination)
        }
        function geolocationError(e) {
            $scope.inform("watchPosition, Unable to find home for you \n" + e.message)
        }
        watchPOS = navigator.geolocation.watchPosition(geolocationSuccess, geolocationError, {
            maximumAge: 3e3,
            enableHighAccuracy: !0
        })
    }
    ;
    $scope.setAlarm = function() {
        $scope.alarmed = !$scope.alarmed,
        1 == $scope.alarmed ? inito() : navigator.geolocation.clearWatch(watchPOS)
    }
    ,
    $timeout(sharenow, 5e3)
}
]),
angular.bootstrap(document, ["set_alarm"]);
