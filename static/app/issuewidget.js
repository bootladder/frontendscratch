var myapp = angular.module('myapp', ['ngRoute']);

myapp.controller('IssueWidgetController', function($http,$scope) {
		$scope.globalscope = "globalscope";
		var issueWidget = this;
		issueWidget.d1 = "hello";
		issueWidget.doSomething = function() {
			issueWidget.d1 = "changed";
		};

		issueWidget.getSomething = function() {
			$http.get("http://localhost:9000").then(function(result) {$scope.myscopedata = result.data;});

			$scope.globalscope = "globalscope changed!";
			issueWidget.d1 = "got";
		};
	});


myapp.config(function($routeProvider){
		$routeProvider.when('/wf0',{templateUrl : "app/appdefault.htm"}) });
