var superCtrl = angular.module('superCtrl', []);
superCtrl.controller('UserListCtrl', function ($http, $scope, $rootScope, $location, $timeout, $routeParams) {
    $scope.list = function (pageNo, pageSize) {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId":$rootScope.login_user.userId,
            "token":$rootScope.login_user.token,
            pageNo: pageNo,
            pageSize: pageSize
        };
        $http({
            url: api_uri + "p/user/list",
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.page = d.result;
                $scope.result_list = d.result.datas;
            }
            else {
                console.log(d.result);
            }

        }).error(function (d) {
            //console.log("login error");
            //$location.path("/error");
        })
    };
    $scope.list(1, 20);
    $scope.changePage = function(page){
        $scope.pageNo1 = page;
        console.log($scope.pageNo1);
        $scope.$watch($scope.pageNo1, function () {
            $scope.list($scope.pageNo1, 8);
        });
    };
    $scope.selected = [];
    $scope.ids = [];

    $scope.isSelected = function (id) {
        return $scope.selected.indexOf(id) >= 0;
    };
    var updateSelected = function (action, id) {
        if (action == 'add') {
            $scope.ids.push(id);
            console.log("添加id"+$scope.ids);
        }
        if (action == 'remove') {
            var idx = $scope.ids.indexOf(id);
            $scope.ids.splice(idx, 1);
            console.log("删除id"+id);
        }
    };
    $scope.updateSelection = function ($event, id) {
        console.log("点击一下");
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, id);
    };

    $scope.update = function (id) {
        $location.path("/super/update/" + id);
    };

    $scope.delete = function () {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            ids: $scope.ids
        };
        console.log($scope.ids);
        console.log(m_params);
        $.ajax({
            type: 'POST',
            url: api_uri + "p/user/delete",
            data: m_params,
            traditional: true,
            success: function (data, textStatus, jqXHR) {
                // console.log(data);
                if (data.returnCode == 0) {
                    $scope.list($scope.pageNo1, 20);
                }
                else {
                    console.log(data);
                }
            },
            dataType: 'json',
        });
    };
});

superCtrl.controller('CreateUserCtrl', function ($http, $scope, $rootScope, $location, $state, $timeout, $routeParams) {
    var timesTamp = new Date().getTime();
    var timesTamp1 = String(timesTamp).substring(0,10);
    $scope.timestamp = parseInt(timesTamp1);
    $scope.submit = function () {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId":$rootScope.login_user.userId,
            "token":$rootScope.login_user.token,
            "timestamp": $scope.timestamp,
            "email":$scope.email,
            "name":$scope.name,
            "mobile":$scope.mobile,
            "empNo":$scope.empNo,
            "password":$scope.password,
            "signature":$rootScope.encryptByDES($scope.email+$scope.password+$scope.timestamp),
        };
        console.log(m_params);
        $http({
            url: api_uri+"p/user/create",
            method: "POST",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                console.log(d);
                $state.go('super');
            }else {
                console.log(d);
            }

        }).error(function (d) {
            $scope.changeErrorMsg("网络故障请稍后再试......");
            $location.path("/login");
        })
    };
});

superCtrl.controller('UserUpdateCtrl', function ($http, $scope, $rootScope, $location, $state, $timeout, $stateParams) {
    var timesTamp = new Date().getTime();
    var timesTamp1 = String(timesTamp).substring(0, 10);
    $scope.timestamp = parseInt(timesTamp1);

    $scope.get = function () {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
        };
        $http({
            url: api_uri + "p/user/detail/" + $stateParams.id,
            method: "GET",
            params: m_params
        }).success(function (d) {
            console.log(d);
            if (d.returnCode == 0) {
                $scope.user = d.result;
            }
            else {
                console.log(d.result);
            }

        }).error(function (d) {
        })
    };
    $scope.get();

    $scope.submit = function () {
        // var login_user = $rootScope.getObject("login_user");
        var m_params = {
            "userId": $rootScope.login_user.userId,
            "token": $rootScope.login_user.token,
            "timestamp": $scope.timestamp,
            "name": $scope.user.name,
            "mobile": $scope.user.mobile,
            "password": $scope.user.password,
            "signature": $rootScope.encryptByDES($scope.email + $scope.password + $scope.timestamp),
        };
        console.log(m_params);
        $http({
            url: api_uri + "p/user/update/" + $stateParams.id,
            method: "POST",
            params: m_params
        }).success(function (d) {
            if (d.returnCode == 0) {
                console.log(d);
                $state.go('super');
            } else {
                console.log(d);
            }

        }).error(function (d) {
            //$scope.changeErrorMsg("网络故障请稍后再试......");
            //$location.path("/login");
        })
    };
})
