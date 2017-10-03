function AdminMenu() {
};

/**
 * Checks if the current object is null or undefined. Returns true if it is
 * either null or undefined else returns false
 */
AdminMenu.setSystemConfigPageActive = function() {
	$("#system_config_menu").addClass("active_item");
};

AdminMenu.setGeneralConfigPageActive = function() {
	$("#general_config_menu").addClass("active_item");
};

AdminMenu.setAlertConfigPageActive = function() {
	$("#alert_config_menu").addClass("active_item");
};

AdminMenu.setMapConfigPageActive = function() {
	$("#map_config_menu").addClass("active_item");
};

AdminMenu.setMapSettingsConfigPageActive = function() {
	$("#map_setting_config_menu").addClass("active_item");
};

AdminMenu.setRoleConfigPageActive = function() {
	$("#role_config_menu").addClass("active_item");
};

AdminMenu.setUserConfigPageActive = function() {
	$("#user_config_menu").addClass("active_item");
};

AdminMenu.setLayerConfigPageActive = function() {
	$("#layer_config_menu").addClass("active_item");
};

AdminMenu.setSourceConfigPageActive = function() {
	$("#source_config_menu").addClass("active_item");
};

AdminMenu.setShowLogsPageActive = function() {
	$("#show_log_menu").addClass("active_item");
};

AdminMenu.setTestRequestsPageActive = function() {
	$("#test_requests_menu").addClass("active_item");
};

//AdminMenu.setLoginPageActive = function() {
//	$("#login_page").addClass("active_item");
//};

//AdminMenu.deselectAllPages = function() {
//	$(".menu-left-manager-item").removeClass("active_item");
//};