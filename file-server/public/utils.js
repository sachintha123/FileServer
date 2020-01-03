
myTasks.factory('utils', [function(){

    return {

        deleteCookie : function (cname){
                
            document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';

        }
        



    }     


}]);

