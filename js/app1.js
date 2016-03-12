var set_alarm	=	angular.module('set_alarm', ['ngAnimate']);

set_alarm.controller('mainCtrl', ['$scope', '$timeout', function($scope, $timeout){
	
	$scope.offline = false;
	$scope.about = true;
	$scope.canTrace	=	false;
	$scope.alarmGap	=	2;
	$scope.vibratealarm	=	true;
	
	$scope.dt = new Date(); 
	var m = $scope.dt.getDay();
	
	$scope.vibrate	=	function(range){
		if(!$scope.vibratealarm){
			
		}
		else{
			console.log('vibrateme');
			navigator.vibrate(range);
		}
	}
	$scope.inform	=	function(info){
		// document.getElementById('txtDestination').value	=	info;
		window.plugins.toast.showLongTop(info);
	}
	
	document.addEventListener("offline", onOffline, false);
	document.addEventListener("online", available, false);
	
	function available() {
//		$scope.inform('Ready to Track');
		
		$scope.offline = false;
		// $scope.about = false;
		$scope.$apply();
	};
	
	function onOffline() {
		$scope.inform('Check your Internet connection');
		
		$scope.offline = true;
		// $scope.about = true;
		$scope.$apply();
	};
	
	
	var source, 
	destination,
	directionsDisplay,
	directionsService = new google.maps.DirectionsService();
	
	google.maps.event.addDomListener(window, 'load', function () {
		new google.maps.places.SearchBox(document.getElementById('txtDestination'));
		directionsDisplay = new google.maps.DirectionsRenderer({ 'draggable': false });
	});


//*********Generating MAP**********************//
	$scope.GetRoute	=	function () {
		// navigator.geolocation.getCurrentPosition(showPosition, got_error2, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
		navigator.geolocation.getCurrentPosition(showPosition, got_error2, { enableHighAccuracy: true });
		
		function got_error2(status){
				$scope.inform('Enable GPS/location');
		};
		function showPosition(position){
		
			// document.getElementById('card_image').innerHTML	=	'<div id="dvMap" ></div>';
		
			$scope.vibrate([1000]);
			$scope.canTrace	=	true;
			
			
			// $scope.current	=	[];
			// $scope.lat	=	position.coords.latitude;
			// $scope.lon	=	position.coords.longitude;
		
			var current_location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	 		var mapOptions = {};
			
			map = new google.maps.Map(document.getElementById('dvMap'), mapOptions);
			
			directionsDisplay.setMap(map);
			
			//*********DIRECTIONS AND ROUTE**********************//
			source = current_location;
			destination = document.getElementById("txtDestination").value;

	 		var request = {
				origin: source,
				destination: destination,
				travelMode: google.maps.TravelMode.DRIVING
			};
			directionsService.route(request, function (response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					directionsDisplay.setDirections(response);
				}
			});

			goingTo(source, destination);
		};
		
	};
	
//*********DISTANCE AND DURATION**********************//
	function goingTo(source, destination){
	
		//*********DISTANCE AND DURATION**********************//
		var service = new google.maps.DistanceMatrixService();
		service.getDistanceMatrix({
			origins: [source],
			destinations: [destination],
			travelMode: google.maps.TravelMode.DRIVING,
			unitSystem: google.maps.UnitSystem.METRIC,
			avoidHighways: false,
			avoidTolls: false
		}, function (response, status) {
			if (status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS") {
				// $scope.res	=	response;
				var distance = response.rows[0].elements[0].distance;
				var duration = response.rows[0].elements[0].duration.text;
				var dvDistance = document.getElementById("dvDistance");
			
				// dvDistance.innerHTML = "";
				// dvDistance.innerHTML += "Distance: " + distance.text;

				$scope.liveDistance	=	distance.text;
				
				$scope.str = parseFloat(distance.value);
				// count = str.length;
				// leftmiles = str.slice(0, (count-3));
				
				var	alarmGap	=	(parseFloat($scope.alarmGap)*1000);
				
				$scope.$apply();
				
				if( $scope.str < alarmGap){
					// Materialize.toast(distance.text, 1000);
					console.log(alarmGap);
					$scope.inform('Volla! Welcome to your destination');
					$scope.vibrate([3000, 2000, 1000]);
					
					navigator.geolocation.clearWatch(watchPOS);
					
					$scope.alarmed	=	false;
					
					console.log('D-alarmed');
					
				}
				else{
					console.log('alarmed for' + (alarmGap) + ' , Gap ' + $scope.str);
				}
				
				console.log('DISTANCE response');
			} else {
				$scope.inform("Unable to track your location");
			}
		});
	};
	
	
/************************************************

					alarm functions

************************************************/

	$scope.alarmed	=	false;
	var timer,
	watchPOS;
	
	var	inito = function(){
		// timer = setInterval( update_dist, 10000);
		
		function geolocationSuccess(position){
			console.log('update_dist showPosition '+ position.coords.latitude+ ' , '+ position.coords.longitude);
		
			var source = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			
			// $scope.vibrate([3000, 2000, 1000]);
			
			goingTo(source, destination);
		};
		
		function geolocationError(e){
			$scope.inform('watchPosition, Unable to find home for you \n'+ e.message );
		};
		
		// watchPOS	=	navigator.geolocation.watchPosition(geolocationSuccess, geolocationError, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
		watchPOS	=	navigator.geolocation.watchPosition(geolocationSuccess, geolocationError, { maximumAge: 3000, enableHighAccuracy: true });
	};
	
	function update_dist(position){
	
		console.log('update_dist');
	
		// navigator.geolocation.getCurrentPosition(showPosition, got_error1, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
		navigator.geolocation.getCurrentPosition(showPosition, got_error1, { enableHighAccuracy: true });
		
		
		function got_error1(status){
			$scope.inform('update_dist ERROR ' + status.error);
		};
		
		function showPosition(position){
			console.log('update_dist showPosition '+ position.coords.latitude+ ' , '+ position.coords.longitude);
		
			var source = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			
			goingTo(source, destination);
		};
	};
	
	$scope.setAlarm	=	function (){
	
		$scope.alarmed	=	!$scope.alarmed;
		
		if($scope.alarmed == true){
			inito();
			console.log('alarmed');
		}else{
			// clearInterval(timer);
			
			navigator.geolocation.clearWatch(watchPOS);
			
			console.log('D-alarmed');
		}
	};
	
	$timeout(sharenow, 5000);
	
	function sharenow(){
		if( (m+1)%2 ){
			document.getElementById("sharenow").click();
		}
	}
	
}]); 

angular.bootstrap(document, ['set_alarm']);