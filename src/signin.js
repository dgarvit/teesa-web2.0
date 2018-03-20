(function() {
    angular.module('Teesa', ['ngCookies'])
    .controller('MainController', ['$http', '$window', '$scope', '$cookieStore', function($http, $window, c, d) {
        if (d.get('session') && d.get('username')) {
            this.base_url = "http://10.42.0.93:8000";
            $http({
                method: 'POST',
                url: this.base_url,
                data: {
                    'session': d.get('session'),
                    'username': d.get('username')
                },
                 headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {
                console.log(response);
                if (response.data.isloggedin === true) {
                    $window.location.href = '/';
                }
            });
        }

        c.login = function () {
            var login_button = document.getElementById('login_btn');
            document.getElementById('message').innerHTML = "";
            document.getElementById('message').style = "";
            login_button.innerHTML = "Please wait";
            login_button.disabled = true;
            $http({
                method: 'POST',
                url: "http://10.42.0.93:8000/login",
                data: {
                    'username': document.getElementsByClassName('form-control')[0].value,
                    'password': document.getElementsByClassName('form-control')[1].value
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then( function(response) {
                if (response.data.success === true) {
                    d.put('session', response.data.cookie);
                    d.put('username', response.data.username);
                    $window.location.href = '/';
                }
                else {
                    document.getElementById('message').innerHTML = "Incorrect username/password.";
                    document.getElementById('message').style = "color: red";
                    login_button.innerHTML = "Login";
                    login_button.disabled = false;
                }
            });
        }
    }]);
})();
