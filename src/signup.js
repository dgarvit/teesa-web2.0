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
            }).success(function (response) {
                console.log(response);
                if (response.data.isloggedin === true) {
                    $window.location.href = '/';
                }
            });
        }

        c.signup = function () {
            var message = document.getElementById('message');
            message.innerHTML = "";
            if (document.getElementById('username').value === '' || document.getElementById('password').value ==='') {
                message.style = "color:red;";
                message.innerHTML = "Username/password cannot be empty.";
            }

            else {
                document.getElementById('register_btn').innerHTML = "Please wait";
                document.getElementById('register_btn').disabled = true;
                $http({
                    method: 'POST',
                    url: "http://10.42.0.93:8000/create_account",
                    data: {
                        'username': document.getElementById('username').value,
                        'password': document.getElementById('password').value
                    },
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then( function(response) {
                    if (response.data.success === true) {
                        message.style = "";
                        message.innerHTML = "Successfully created account! Your Teesa ID is: " + response.data.address;
                    }
                    else if (response.data.success === 3) {
                        message.innerHTML = "Password cannot be blank!";
                    }
                    else {
                        message.style = "color: red;";
                        message.innerHTML = "Username already taken!";
                    }
                    document.getElementById('register_btn').innerHTML = "Register";
                    document.getElementById('register_btn').disabled = false;
                });
            }
        }
    }]);
})();
