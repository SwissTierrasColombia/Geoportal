package it.gesp.geoportal.constants;

public interface Permissions {

	/*
	 * Redlines
	 */
	String REDLINE_INSERT = "REDLINE_INSERT";
	
	/*
	 * Comments 
	 */
	String COMMENTS_READ = "COMMENTS_READ";
	String COMMENTS_INSERT = "COMMENTS_INSERT";
	
	
	/*
	 * Alerts
	 */
	String ALERTS_READ = "ALERTS_READ";
	String ALERTS_UPDATE = "ALERTS_UPDATE";
	String ALERTS_CHANGE_STATUS = "ALERTS_CHANGE_STATUS";
	
	String ALERTS_DOWNLOAD = "ALERTS_DOWNLOAD";
	
	String ALERTS_WS_MUNI_SIT = "ALERTS_WS_MUNI_SIT";
	
//	/*
//	 * Alerts - Restricted Filter
//	 */
//	String ALERTS_RESTRICTED_INFO = "ALERTS_RESTRICTED_INFO";
	
	
	/*
	 * Search
	 */
	//String WFS_SEARCH = "WFS_SEARCH"; 
	
	
	
	/***************************
	 * ADMINISTRATION PANELS
	 ***************************/
	/*
	 * Access to administration Panel
	 */
	String ACCESS_ADMINISTRATION_PANEL = "ACCESS_ADMINISTRATION_PANEL";
	
	/*
	 * Role administration
	 */
	String ROLE_ADMIN = "ROLE_ADMINISTRATION";
	
	/*
	 * User administration
	 */
	String USER_ADMIN = "USER_ADMINISTRATION";
	String USER_CHANGE_PASSWORD = "USER_CHANGE_PASSWORD";
	/*
	 * User self-management
	 */
	String USER_SELF_CHANGE_PASSWORD = "USER_SELF_CHANGE_PASSWORD";
	String USER_RESET_PASSWORD = "USER_RESET_PASSWORD";
	
	/*
	 * SystemConfiguration administration
	 */
	String SYSTEM_CONFIG_ADMIN = "SYSTEM_CONFIG_ADMINISTRATION";
	
	/*
	 * GeneralConfiguration administration
	 */
	String GENERAL_CONFIG_ADMIN = "GENERAL_CONFIG_ADMINISTRATION";
	
	/*
	 * AlertsConfiguration administration
	 */
	String ALERTS_CONFIG_ADMIN = "ALERTS_CONFIG_ADMINISTRATION";
	
	/*
	 * MapConfiguration administration
	 */
	String MAP_CONFIG_ADMIN = "MAP_CONFIG_ADMINISTRATION";
	
	/*
	 * MapSettingsConfiguration administration
	 */
	String MAP_SETTING_CONFIG_ADMIN = "MAP_SETTING_CONFIG_ADMINISTRATION";
	
	/*
	 * LayerConfiguration administration
	 */
	String LAYER_CONFIG_ADMIN = "LAYER_CONFIG_ADMINISTRATION";
	
	/*
	 * SourceConfiguration administration
	 */
	String SOURCE_CONFIG_ADMIN = "SOURCE_CONFIG_ADMINISTRATION";
	
	/*
	 * ShowLogs administration
	 */
	String SHOW_LOGS_ADMIN = "SHOW_LOGS_ADMINISTRATION";
	
	/*
	 * Test requests administration
	 */
	String TEST_REQUESTS_ADMIN = "TEST_REQUESTS_ADMINISTRATION";
}
