<%-- <%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%> --%>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ page import="it.gesp.geoportal.locale.LocaleUtils, it.gesp.geoportal.services.LoginService,it.gesp.geoportal.constants.Permissions,it.gesp.geoportal.dao.entities.User,it.gesp.geoportal.services.LogService" %>

<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<%@ include file="admin_config_common_js.jspf" %>

<!-- Manager System Configs scripts and CSS-->
<link rel="stylesheet" href="css/admin/managerSystemSettings.css" type="text/css">
<script type="text/javascript" src="scripts/admin/systemSettings/managerSystemSettings.js"></script>

<!-- Start script -->
<script>
	var validator = null;

	$(document).ready(function(){
		LocaleManager.refreshLocale();
		AdminMenu.setSystemConfigPageActive();
		mSystemSettings.requests.getData();
		
		validator = new Validate({
			form: $("#systemAdminContainer")
		});
		
		$("#submit").button();
		$("#cancel").button();
	});
	
</script>
</head>

<body>
	<t:generic_admin_page>
		<jsp:attribute name="header">
	    </jsp:attribute>
	    <jsp:attribute name="footer">
	    </jsp:attribute>
	
		<jsp:body>
		
		<form id="systemAdminContainer" onSubmit="return false;">		
			<!-- <p>System Configuration - Global Settings.</p> -->
			<!-- <p>Settings that apply to the entire system</p> -->
			<div class="header">
				<div data-locale_key="Manager_System_Title" data-locale_ref="text" class="localizedElement"></div>
				<div data-locale_key="Manager_System_Subtitle" data-locale_ref="text" class="localizedElement"></div>
			</div>
			
			<div class="itemform">
				<div data-locale_key="Manager_System_ProxyURL" data-locale_ref="text" class="localizedElement form-label-title"></div>
				<div><input id="proxy-input" name="proxy-input" required></div>
			</div>
			
			<div class="itemform">
				<div data-locale_key="Manager_System_PrintServletURL" data-locale_ref="text" class="localizedElement form-label-title"></div>
				<div><input id="printservlet-url-input" name="printservlet-url-input" required></div>
			</div>
			
			<div class="itemform">
				<div data-locale_key="Manager_System_PrintServletImagesFolder" data-locale_ref="text" class="localizedElement form-label-title"></div>
				<div><input id="printservlet-images-folder-input" name="printservlet-images-folder-input" required></div>
			</div>
			
			<div class="itemform">
				<div data-locale_key="Manager_System_AlertsLegendImageURL" data-locale_ref="text" class="localizedElement form-label-title"></div>
				<div><input id="alerts-legend-imageurl-input" name="alerts-legend-imageurl-input" required></div>
			</div>
			
			<div class="itemform">
				<div data-locale_key="Manager_System_RedlinesLegendImageURL" data-locale_ref="text" class="localizedElement form-label-title"></div>
				<div><input id="redlines-legend-imageurl-input" name="redlines-legend-imageurl-input" required></div>
			</div>
			
			<div class="itemform">
				<div data-locale_key="Manager_System_GeoserverURL" data-locale_ref="text" class="localizedElement form-label-title"></div>
				<div><input id="geoserver-url-input" name="geoserver-url-input" required></div>
			</div>
			
			<div class="itemform">
				<div data-locale_key="Manager_System_GeonetworkURL" data-locale_ref="text" class="localizedElement form-label-title"></div>
				<div><input id="geonetwork-url-input"  name="geonetwork-url-input" required></div>
			</div>
			
			<div class="itemform">
				<div data-locale_key="Manager_System_MaxSearchFeaturePerLayer" data-locale_ref="text" class="localizedElement form-label-title"></div>
				<div><input id="max-num-feature-search-per-layer-input" type="number" name="max-num-feature-search-per-layer-input" required></div>
			</div>
			
			<div class="itemform">
				<div data-locale_key="Manager_System_Selected_Layers_Max_Size" data-locale_ref="text" class="localizedElement form-label-title"></div>
				<div><input id="max-num-selected-layers-input" type="number" name="max-num-selected-layers-input" required></div>
			</div>
			
			<div class="itemform">
				<div data-locale_key="Manager_System_AjaxTimeOut" data-locale_ref="text" class="localizedElement form-label-title"></div>
				<div><input id="ajax-timeout-input" type="number" name="ajax-timeout-input" required></div>
			</div>
			
			<div class="itemform">
				<div data-locale_key="Manager_System_PrintAjaxTimeOut" data-locale_ref="text" class="localizedElement form-label-title"></div>
				<div><input id="ajax-timeout-print-input" type="number" name="ajax-timeout-print-input" required></div>
			</div>
			
			<div class="itemform">
				<div data-locale_key="Manager_System_HyperlinkField" data-locale_ref="text" class="localizedElement form-label-title"></div>
				<div><input id="featureInfoHyperlinkField-input" name="featureInfoHyperlinkField-input" required></div>
			</div>
			
			<div class="header">
				<div data-locale_key="Manager_System_Alerts_Title" data-locale_ref="text" class="localizedElement"></div>
				<div data-locale_key="Manager_System_Alerts_Subtitle" data-locale_ref="text" class="localizedElement"></div>
			</div>
			
			<div class="itemform">
				<div data-locale_key="Manager_System_Alerts_Geoserver_Layername" data-locale_ref="text" class="localizedElement form-label-title"></div>
				<div><input id="alerts-geoserver-layername-input" name="alerts-geoserver-layername-input" required></div>
			</div>
			
			<div class="itemform">
				<div data-locale_key="Manager_System_Alerts_Geoserver_Username" data-locale_ref="text" class="localizedElement form-label-title"></div>
				<div><input id="alerts-geoserver-username-input" name="alerts-geoserver-username-input" required></div>
			</div>
			
			<div class="itemform">
				<div data-locale_key="Manager_System_Alerts_Geoserver_Password" data-locale_ref="text" class="localizedElement form-label-title"></div>
				<div><input id="alerts-geoserver-password-input" name="alerts-geoserver-password-input" required></div>
			</div>
			
			<button id="submit" data-locale_key="General_Save" data-locale_ref="text" class="localizedElement" onclick="mSystemSettings.requests.saveData();"></button>
			<button id="cancel" data-locale_key="General_Cancel" data-locale_ref="text" class="localizedElement" onclick="mSystemSettings.requests.getData();"></button>
			
		</form>
		
		</jsp:body>
		
	</t:generic_admin_page>
	
	
	
</body>
</html>
