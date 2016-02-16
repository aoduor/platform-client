module.exports = [
    '$translate',
    '$location',
    'RoleEndpoint',
    'Notify',
    'Config',
function (
    $translate,
    $location,
    RoleEndpoint,
    Notify,
    Config
) {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
            var handleResponseErrors = function (errorResponse) {
                Notify.showApiErrors(errorResponse);
            };

            $scope.refreshView = function () {
                RoleEndpoint.queryFresh().$promise.then(function (roles) {
                    $scope.roles = roles;
                });
            };

            $scope.refreshView();

            $scope.rolesEnabled = Config.features.roles.enabled ? true : false;

            $scope.deleteRole = function (role) {
                $translate('notify.role.delete_question', {
                    role: role.display_name
                }).then(function (message) {
                    Notify.showConfirm(message).then(function () {
                        RoleEndpoint.delete({ id: role.id }).$promise.then(function () {
                            $translate('notify.role.destroy_success', {
                                role: role.display_name
                            }).then(function (message) {
                                Notify.showNotificationSlider(message);
                            });
                            $scope.refreshView();
                        }, handleResponseErrors);
                    }, function () {});
                });
            };
        }
    };
}];
