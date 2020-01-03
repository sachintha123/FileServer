var myTasks = angular.module('TasksApp', ['ngCookies']);

myTasks.controller('TasksController', ['$scope', 'utils','$cookies', function($scope, utils, $cookies){

    
    $scope.logout = function() {

        utils.deleteCookie('currentsession');

        window.location.href = "/index.html";                 


    }

}]);

myTasks.controller('userProfileController', ['$scope','$cookies','$http', function($scope, $cookies,$http){

    var token = $cookies.currentsession;
    var user_id = localStorage.getItem('userdetails');

    $scope.getProfile = function() {
               
        
        $http({

            method  : 'POST', 
            data    : {user_id:user_id},
            url     : 'http://localhost:3000/getuser',               
            headers : {'Authorization': token}
        
    
        }).then(function(data){

            var first_name = data.data.first_name;
            var last_name  = data.data.last_name;
            var user_name = data.data.user_name;
            var email = data.data.email;

            console.log(first_name +"" + last_name +" " + user_name +" " + email);
            alert("Welcome" +" "+ user_name);
            
        });

    }

}]); 