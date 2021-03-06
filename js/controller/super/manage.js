var manageCtrl = angular.module('manageCtrl', []);
manageCtrl.controller('UserListCtrl',
    ['$http', '$scope', '$rootScope', '$location', function ($http, $scope, $rootScope, $location) {

        /*获取团队人员列表*/
        $scope.list = function (pageNo, pageSize) {
            var m_params = {
                "userId": $rootScope.login_user.userId,
                "token": $rootScope.login_user.token,
                pageNo: pageNo,
                pageSize: pageSize
            };
            $http({
                url: api_uri + "p/user/list",
                method: "GET",
                params: m_params
            }).success(function (d) {
                if (d.returnCode == 0) {
                    $scope.page = d.result;
                    $scope.result_list = d.result.datas;
                    angular.forEach($scope.result_list, function (data) {
                        if (data.role == "admin") {
                            data.position = "销售人员";
                        } else if (data.role == "manager") {
                            data.position = "销售主管";
                        } else if (data.role == "super") {
                            data.position = "超级管理员";
                        }
                    });
                }
                else {
                }

            }).error(function (d) {
            })
        };
        $scope.list(1, 20);
        /*分页显示*/
        $scope.changePage = function (page) {
            $scope.pageNo1 = page;
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
            }
            if (action == 'remove') {
                var idx = $scope.ids.indexOf(id);
                $scope.ids.splice(idx, 1);
            }
        };
        $scope.updateSelection = function ($event, id) {
            var checkbox = $event.target;
            var action = (checkbox.checked ? 'add' : 'remove');
            updateSelected(action, id);
        };

        $scope.update = function (id) {
            $location.path("/super/manage/update/" + id);
        };

        $scope.delete = function () {
            var m_params = {
                "userId": $rootScope.login_user.userId,
                "token": $rootScope.login_user.token,
                ids: $scope.ids
            };
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
                    }
                },
                dataType: 'json',
            });
        };
    }]);

manageCtrl.controller('CreateUserCtrl',
    ['$http', '$scope', '$rootScope', '$location', '$state', function ($http, $scope, $rootScope, $location, $state) {
        $scope.createUser = true;
        var timesTamp = new Date().getTime();
        var timesTamp1 = String(timesTamp).substring(0, 10);
        $scope.timestamp = parseInt(timesTamp1);
        $scope.isUpdate = false;
        $scope.submit = function () {
            var m_params = {
                "userId": $rootScope.login_user.userId,
                "token": $rootScope.login_user.token,
                "timestamp": $scope.timestamp,
                "email": $scope.email,
                "name": $scope.name,
                "mobile": $scope.mobile,
                "empNo": $scope.empNo,
                "password": $scope.password,
                "role": $scope.role_sale,
                "signature": $rootScope.encryptByDES($scope.email + $scope.password + $scope.timestamp),
            };
            $http({
                url: api_uri + "p/user/create",
                method: "POST",
                params: m_params
            }).success(function (d) {
                if (d.returnCode == 0) {
                    $state.go('super.manage');
                } else {
                }

            }).error(function (d) {
            })
        };
    }]);

manageCtrl.controller('UserUpdateCtrl',
    ['$http', '$scope', '$rootScope', '$location', '$state', '$timeout', '$stateParams', function ($http, $scope, $rootScope, $location, $state, $timeout, $stateParams) {
        var timesTamp = new Date().getTime();
        var timesTamp1 = String(timesTamp).substring(0, 10);
        $scope.timestamp = parseInt(timesTamp1);
        $scope.isUpdate = false;
        $scope.get = function () {
            var m_params = {
                "userId": $rootScope.login_user.userId,
                "token": $rootScope.login_user.token,
            };
            $http({
                url: api_uri + "p/user/detail/" + $stateParams.id,
                method: "GET",
                params: m_params
            }).success(function (d) {
                if (d.returnCode == 0) {
                    $scope.isUpdate = true;
                    $scope.email = d.result.email;
                    $scope.name = d.result.name;
                    $scope.mobile = d.result.mobile;
                    $scope.empNo = d.result.empNo;
                    $scope.role_sale = d.result.role;
                }
                else {
                }

            }).error(function (d) {
            })
        };
        $scope.get();
        $scope.submit = function () {
            var m_params = {
                "userId": $rootScope.login_user.userId,
                "token": $rootScope.login_user.token,
                "timestamp": $scope.timestamp,
                "name": $scope.name,
                "mobile": $scope.mobile,
                "password": $scope.password,
                "role": $scope.role_sale,
                "signature": $rootScope.encryptByDES($scope.email + $scope.password + $scope.timestamp),
            };
            $http({
                url: api_uri + "p/user/update/" + $stateParams.id,
                method: "POST",
                params: m_params
            }).success(function (d) {
                if (d.returnCode == 0) {
                    $state.go('super.manage');
                } else {
                }

            }).error(function (d) {
            })
        }
    }]);
