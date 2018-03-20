(function() {
    angular.module('Teesa', ['ngCookies'])
    .controller('MainController', ['$http', '$window', '$scope', '$cookieStore', function($http, $window, c, d) {
        //$window.location.href = '/signin.html';
        if (d.get('session') === undefined)
            $window.location.href = '/signin.html';
        this.base_url = "http://10.42.0.93:8000";
        $http({
            method: 'POST',
            url: this.base_url,
            data: {
                'session': d.get('session'),
                'username': d.get('username')
            },
             headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .then(function (response) {
            if (response.data.isloggedin === false) {
                $window.location.href = '/signin.html';
            }
            else {
                d.put('username', response.data.username);
                d.put('address', response.data.address);
                c.username = d.get('username');
                c.address = d.get('address');
                $http({
                    method: 'POST',
                    url: ('http://10.42.0.93:8000/get_balance'),
                    data: {
                        'address': c.address
                    },
                     headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                })
                .success(function(response) {
                    c.balance = response.balance;
                    //console.log(response);
                });
            }
        });
        c.sendmoney = function() {
            if (d.get('session')) {
                var password = document.getElementById('exampleInputPassword1').value;
                var message = document.getElementById("message");
                document.getElementById('exampleInputPassword1').value = "";
                message.innerHTML = "";
                var btn = document.getElementById('send_btn');
                btn.innerHTML = "Please wait";
                btn.disabled = true;
                $http({
                    method: 'POST',
                url: "http://10.42.0.93:8000/send_money",
                data: {
                    'session': d.get('session'),
                    'username': d.get('username'),
                    'password': password,
                    'to': document.getElementById('exampleInputEmail1').value,
                    'amount': document.getElementById('teesaCoin').value,

                },
                 headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then(function (response) {
                    if (response.data.success === true) {
                        message.innerHTML = "The transaction was successful and will be mined soon.";
                    }
                    else {
                        message.innerHTML = "There was some error in the transaction. Try checking the password or login again.";
                    }
                    btn.innerHTML = "Send";
                    btn.disabled = false;
                });
            }
        }

        c.logout = function() {
            d.remove('session');
            d.remove('username');
            d.remove('address');
            $window.location.href = '/signin.html';
        }

        c.getTransactions = function() {
            $http({
                method: 'POST',
                url: "http://10.42.0.93:8000/get_transactions",
                data: {
                    'address': d.get('address'),
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then(function (response) {
                    c.transactions = response.data;
                    console.log(response.data);
                });
        }
    }]);
})();
