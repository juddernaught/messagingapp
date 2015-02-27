'use strict';


var messagingApp = angular.module('messagingApp', []);

messagingApp.controller('MessagingClient', function ($scope) {
	console.log('here');
	$scope.messages = [];
	var socket = null;
	var isopen = false;
	socket = new WebSocket("ws://127.0.0.1:9000");
	socket.binaryType = "arraybuffer";

    socket.onopen = function() {
       console.log("Connected!");
       isopen = true;
    }

    socket.onmessage = function(e) {
       if (typeof e.data == "string") {
          addMessageToView("Text message received: " + e.data);
       } 
       // else {
       //    var arr = new Uint8Array(e.data);
       //    var hex = '';
       //    for (var i = 0; i < arr.length; i++) {
       //       hex += ('00' + arr[i].toString(16)).substr(-2);
       //    }
       //    console.log("Binary message received: " + hex);
       // }
    }

    socket.onclose = function(e) {
       console.log("Connection closed.");
       socket = null;
       isopen = false;
    }

	  // onclick methods333333333333333

	 $scope.sendText = function () {
	 	console.log('here');
	    if (isopen) {
	       socket.send("Hello, world!");
	       console.log("Text message sent.");               
	    } else {
	       console.log("Connection not opened.")
	    }
	 };

     $scope.sendBinary = function () {
        if (isopen) {
           var buf = new ArrayBuffer(32);
           var arr = new Uint8Array(buf);
           for (i = 0; i < arr.length; ++i) arr[i] = i;
           socket.send(buf);
           console.log("Binary message sent.");
        } else {
           console.log("Connection not opened.")
        }
     };

     var addMessageToView = function (message) {
     	$scope.messages.push(message);
     }

});

// angular.module('MyApp', ['ngWebsocket'])
// 	.run(function ($websocket) {
//         var ws = $websocket.$new('ws://localhost:12345'); // instance of ngWebsocket, handled by $websocket service

//         ws.$on('$open', function () {
//             console.log('Oh my gosh, websocket is really open! Fukken awesome!');

//             ws.$emit('ping', 'hi listening websocket server'); // send a message to the websocket server

//             var data = {
//                 level: 1,
//                 text: 'ngWebsocket rocks!',
//                 array: ['one', 'two', 'three'],
//                 nested: {
//                     level: 2,
//                     deeper: [{
//                         hell: 'yeah'
//                     }, {
//                         so: 'good'
//                     }]
//                 }
//             };

//             ws.$emit('pong', data);
//         });

//         ws.$on('pong', function (data) {
//             console.log('The websocket server has sent the following data:');
//             console.log(data);

//             ws.$close();
//         });

//         ws.$on('$close', function () {
//             console.log('Noooooooooou, I want to have more fun with ngWebsocket, damn it!');
//         });
//     });