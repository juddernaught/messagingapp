var app = angular.module("wampMessagingApp", [
	"vxWamp", 
	"luegg.directives"
]);


// var wsuri;
// if (document.location.origin == "file://") {
//    wsuri = "ws://127.0.0.1:8080/ws";

// } else {
//    wsuri = (document.location.protocol === "http:" ? "ws:" : "wss:") + "//" +
//                document.location.host + "/ws";
// }

app.config(function ($wampProvider) {
	$wampProvider.init({
		url: 'ws://campusjobmessaging.herokuapp.com/ws',
  	realm: 'realm1'
    //Any other AutobahnJS options
	});
});

app.controller("WampMessagingController", function ($scope, $wamp, $sce) {
	$wamp.open();
	$scope.textToSend = "";
	$scope.conversationText = "";

  // 1) subscribe to a topic
  function onevent(args) {
  	var incomingMessage = args[0];
  	console.log('onevent');
  	console.log(args[0]);
    $scope.messages.push(incomingMessage);
    $scope.conversationText += incomingMessage + '\n';
    // $scope.trustedConversationText = $sce.trustAsHtml($scope.conversationText);
    console.log($scope.conversationText);
  }
  $scope.submitText = function () {
  	console.log('here');
  	$scope.conversationText += '>>> ' + $scope.textToSend + '\n';
  	$scope.messages.push('>>> ' + $scope.textToSend);
		$wamp.publish('com.myapp.topic1', [$scope.textToSend]);
		$scope.textToSend = "";
  };
  $wamp.subscribe('com.myapp.topic1', onevent);

  // 2) publish an event
  // $wamp.publish('com.myapp.topic1', ['Hello, world!']);

  // 3) register a procedure for remoting
  // function add2(args) {
  //    return args[0] + args[1];
  // }
  // $wamp.register('com.myapp.add2', add2);

  // // 4) call a remote procedure
  $wamp.call('com.myapp.getMessages').then(function (res) {
		// $scope.conversationText = res[i] + $scope.conversationText;
		$scope.messages = res
  });      
});