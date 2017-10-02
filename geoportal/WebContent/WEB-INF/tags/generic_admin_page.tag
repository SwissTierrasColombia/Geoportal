<%@tag description="Overall Page template" pageEncoding="UTF-8"%>
<%@tag import="it.gesp.geoportal.locale.LocaleUtils, it.gesp.geoportal.services.LoginService, it.gesp.geoportal.constants.Permissions, it.gesp.geoportal.dao.entities.User" %>
<%@attribute name="header" fragment="true" %>
<%@attribute name="leftMenu" fragment="true" %>
<%@attribute name="footer" fragment="true" %>

  
    <div id="pageheader">
      <jsp:invoke fragment="header"/>
      
      <div class="manager-header">
	  	
	  	<div id="manager-manual-link" onclick="window.open('html_manual/admin/Geoportal_Admin_Manual.html', '_blank ', 'location=no,menubar=no,titlebar=no,toolbar=no,resizable=yes,width=800,height=700')" data-locale_key="Page_Manual_Switch_Button_Title" data-locale_ref="title" class="localizedElement grid-toolbar-item"><i class="fa fa-question fa-2x"></i></div>
	  	<div id="manager-header-text" data-locale_key="Manager_Header_Text" data-locale_ref="text" class="localizedElement"></div>
	  	
	  </div>
	  
    </div>
    <div id="container" class="container">
	    <div id="leftMenu">
	      	<div class="menu-left-manager">
	      	
	      	<% if (LoginService.currentUserHasPermission(session, Permissions.SYSTEM_CONFIG_ADMIN)) { %>
				<div id="system_config_menu" data-locale_key="Manager_Item_ConfigSystem" data-locale_ref="text" class="localizedElement menu-left-manager-item" onclick="location.href = 'admin?page=system_config'"></div>
			<% }%>
			
			<% if (LoginService.currentUserHasPermission(session, Permissions.GENERAL_CONFIG_ADMIN)) { %>
				<div id="general_config_menu" data-locale_key="Manager_Item_ConfigGeneral" data-locale_ref="text" class="localizedElement menu-left-manager-item" onclick="location.href = 'admin?page=general_config'"></div>
			<% }%>
			
	      	<% if (LoginService.currentUserHasPermission(session, Permissions.MAP_CONFIG_ADMIN)) { %>
				<div id="map_config_menu" data-locale_key="Manager_Item_ConfigMaps" data-locale_ref="text" class="localizedElement menu-left-manager-item" onclick="location.href = 'admin?page=map_config'"></div>
			<% }%>
			
			<% if (LoginService.currentUserHasPermission(session, Permissions.MAP_SETTING_CONFIG_ADMIN)) { %>
				<div id="map_setting_config_menu" data-locale_key="Manager_Item_ConfigMapSettings" data-locale_ref="text" class="localizedElement menu-left-manager-item" onclick="location.href = 'admin?page=map_setting_config'"></div>
			<% }%>
			
			<% if (LoginService.currentUserHasPermission(session, Permissions.LAYER_CONFIG_ADMIN)) { %>
				<div id="layer_config_menu" data-locale_key="Manager_Item_ConfigLayers" data-locale_ref="text" class="localizedElement menu-left-manager-item" onclick="location.href = 'admin?page=layer_config'"></div>
			<% }%>
				
			<% if (LoginService.currentUserHasPermission(session, Permissions.SOURCE_CONFIG_ADMIN)) { %>
				<div id="source_config_menu" data-locale_key="Manager_Item_ConfigWMSSources" data-locale_ref="text" class="localizedElement menu-left-manager-item" onclick="location.href = 'admin?page=source_config'"></div>
			<% }%>
			
			<% if (LoginService.currentUserHasPermission(session, Permissions.ALERTS_CONFIG_ADMIN)) { %>
				<div id="alert_config_menu" data-locale_key=Manager_Item_ConfigAlert data-locale_ref="text" class="localizedElement menu-left-manager-item" onclick="location.href = 'admin?page=alert_config'"></div>
			<% }%>
			
			<% if (LoginService.currentUserHasPermission(session, Permissions.ROLE_ADMIN)) { %>
				<div id="role_config_menu" data-locale_key="Manager_Item_ConfigRoles" data-locale_ref="text" class="localizedElement menu-left-manager-item" onclick="location.href = 'admin?page=role_config'"></div>
			<% }%>
			
			<% if (LoginService.currentUserHasPermission(session, Permissions.USER_ADMIN)) { %>
				<div id="user_config_menu" data-locale_key="Manager_Item_ConfigUsers" data-locale_ref="text" class="localizedElement menu-left-manager-item" onclick="location.href = 'admin?page=user_config'"></div>
			<% }%>
				
			<% if (LoginService.currentUserHasPermission(session, Permissions.SHOW_LOGS_ADMIN)) { %>
				<div id="show_log_menu" data-locale_key="Manager_Item_ShowLogs" data-locale_ref="text" class="localizedElement menu-left-manager-item" onclick="location.href = 'admin?page=show_logs'"></div>
			<% }%>
			
			<% if (LoginService.currentUserHasPermission(session, Permissions.TEST_REQUESTS_ADMIN)) { %>
				<div id="test_requests_menu" data-locale_key="Manager_Item_TestRequests" data-locale_ref="text" class="localizedElement menu-left-manager-item" onclick="location.href = 'admin?page=test_requests'"></div>
			<% }%>
			
			</div>
	    </div>
	    
	    <div class="center-container">
	      <jsp:doBody/>
	    </div>
    </div>
    
    <div id="pagefooter">
      <jsp:invoke fragment="footer"/>
    </div>
    