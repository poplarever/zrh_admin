/**
 * Created by baiyang on 2016/7/7.
 */
var topBarCtrl = angular.module('topBarCtrl', []);
topBarCtrl.controller('TopBarCtrl', ['$scope', '$rootScope', '$http', '$location', '$interval', function ($scope, $rootScope, $http, $location, $interval) {
    $scope.role_manage = $rootScope.getObject("role_manage");
    $interval($rootScope.message, 20000);
    $interval($rootScope.bank_messages, 20000);
    $interval($rootScope.system_messages, 20000);
    /*回到首页*/
    $scope.go_home = function () {
        if ($rootScope.role != 'manager') {
            $location.path($rootScope.role);
        } else {
            $location.path("admin");
        }
    };
    /*退出程序*/
    $scope.exit = function () {
        $rootScope.removeObject("login_user");
        $location.path('/login');
    };
}]);

topBarCtrl.controller('SideBarCtrl', ['$scope', function ($scope) {

}]);

topBarCtrl.controller('ContainsCtrl',
    ['$scope', '$rootScope', '$http', '$state', '$location', '$timeout', function ($scope, $rootScope, $http, $state, $location, $timeout) {

        $scope.role_manage = $rootScope.getObject("role_manage");
        $scope.message_roll = function (pageNo, pageSize) {
            var m_params = {
                "userId": $rootScope.login_user.userId,
                "token": $rootScope.login_user.token,
                "pageNo": pageNo,
                "pageSize": pageSize
            };
            $http({
                url: api_uri + "zrh/message/listIndexs",
                method: "GET",
                params: m_params
            }).success(function (d) {
                if (d.returnCode == 0) {
                    $scope.message_roll = d.result.datas;
                    if ($scope.message_roll.length > 0) {
                        $scope.roll();
                    }
                } else {
                    console.log(d);
                }
            }).error(function (d) {
                console.log(d);
            });
        };
        $scope.message_roll(1, 20);
        $scope.item = 0;
        $scope.roll = function () {
            $scope.message_roll_item = $scope.message_roll[$scope.item].content;
            $scope.message_roll_id = $scope.message_roll[$scope.item].id;
            $scope.message_roll_url = $scope.message_roll[$scope.item].url;
            $timeout(function () {
                $scope.item++;
                if ($scope.item >= $scope.message_roll.length) {
                    $scope.item = 0;
                }
                $scope.roll();
            }, 10000);
        };
        /*获取数据*/
        $scope.to_company_message = function (id, url) {
            var m_params = {
                "userId": $rootScope.login_user.userId,
                "token": $rootScope.login_user.token,
                "id": id
            };
            $http({
                url: api_uri + "zrh/message/details",
                method: "GET",
                params: m_params
            }).success(function (d) {

            }).error(function (d) {
            });
            $location.path(url);
        };

        $scope.get_count = function () {
            var m_params = {
                "userId": $rootScope.login_user.userId,
                "token": $rootScope.login_user.token,
            };
            $http({
                url: api_uri + "zrh/index/count",
                method: "GET",
                params: m_params
            }).success(function (d) {
                $scope.countContain = d.result;
                $scope.get_group_count();
            }).error(function (d) {
            });
        };
        $scope.get_count();
        $scope.get_group_count = function () {
            var m_params = {
                "userId": $rootScope.login_user.userId,
                "token": $rootScope.login_user.token,
            };
            $http({
                url: api_uri + "zrh/group/groupCountByUser",
                method: "GET",
                params: m_params
            }).success(function (d) {
                if (d.returnCode == 0) {
                    $scope.countGroup = d.result;
                } else if (d.returnCode == 1003) {
                    console.log("用户或分组不存在");
                } else {
                    console.log(d);
                }
            }).error(function (d) {
            });
        };
    }]);

topBarCtrl.controller('SettingCtrl',
    ['$scope', '$rootScope', '$http', '$state', '$location', '$timeout', function ($scope, $rootScope, $http, $state, $location, $timeout) {
        $scope.myStyle = {
            color: '#ffffff'
        };
        $scope.get_properties = function () {
            var m_params = {
                "userId": $rootScope.login_user.userId,
                "token": $rootScope.login_user.token,
            };
            $http({
                url: api_uri + "sys/getProperties",
                method: "GET",
                params: m_params
            }).success(function (d) {
                if (d.returnCode == 0) {
                    if (d.result.sendSms == true) {
                        $scope.range = 0;
                    } else {
                        $scope.range = 1;
                    }

                } else {
                    console.log(d);
                }
            }).error(function (d) {
                console.log(d);
            });
        };
        $scope.change_sms = function () {
            var m_params = {
                "userId": $rootScope.login_user.userId,
                "token": $rootScope.login_user.token
            };
            $http({
                url: api_uri + "sys/updateSendSms",
                method: "GET",
                params: m_params
            }).success(function (d) {
                if (d.returnCode == 0) {
                } else {
                    console.log(d);
                }
            }).error(function (d) {
                console.log(d);
            });
        };
        $scope.get_properties();
    }]);