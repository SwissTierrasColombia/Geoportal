<%-- <%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%> --%>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ page import="it.gesp.geoportal.locale.LocaleUtils, it.gesp.geoportal.services.LoginService,it.gesp.geoportal.constants.Permissions,it.gesp.geoportal.dao.entities.User,it.gesp.geoportal.services.LogService" %>

<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<%@ include file="admin_config_common_js.jspf" %>

<!-- Manager System Configs scripts and CSS-->
<link rel="stylesheet" href="css/admin/managerGeneralSettings.css" type="text/css">
<script type="text/javascript" src="scripts/admin/generalSettings/managerGeneralSettings.js"></script>

<!-- Start script -->
<script>
	var validator = null;

	$(document).ready(function(){
		LocaleManager.refreshLocale();
		AdminMenu.setGeneralConfigPageActive();
		mGeneralSettings.requests.getData();
		
		validator = new Validate({
			form: $("#generalConfigContainer")
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
		
		<form id="generalConfigContainer" onSubmit="return false;">		
			<div class="header">
				<div data-locale_key=Manager_General_Title data-locale_ref="text" class="localizedElement"></div>
			</div>
			
			<div class="itemform">
				<div data-locale_key=Manager_General_InitialMessage_Show data-locale_ref="text" class="localizedElement form-label-title"></div>
				<div><input type="checkbox" id="initial-message-chk"></div>
			</div>
			
			<div class="itemform">
				<div data-locale_key="Manager_General_InitialMessage" data-locale_ref="text" class="localizedElement form-label-title"></div>
				<div><textarea id="initial-message-txt" name="initial-message-txt" rows="10" required style="width: 400px;"></textarea></div>
			</div>
			
			<div class="itemform">
				<div data-locale_key=Manager_General_InformationMessage_Show data-locale_ref="text" class="localizedElement form-label-title"></div>
				<div><input type="checkbox" id="information-message-chk"></div>
			</div>
			
			<div class="itemform">
				<div data-locale_key="Manager_General_InformationMessage" data-locale_ref="text" class="localizedElement form-label-title"></div>
				<div><textarea id="information-message-txt" name="information-message-txt" rows="10" required style="width: 400px;"></textarea></div>
			</div>
			
			<button id="submit" data-locale_key="General_Save" data-locale_ref="text" class="localizedElement" onclick="mGeneralSettings.requests.saveData();"></button>
			<button id="cancel" data-locale_key="General_Cancel" data-locale_ref="text" class="localizedElement" onclick="mGeneralSettings.requests.getData();"></button>
			
		</form>
		
		</jsp:body>
		
	</t:generic_admin_page>
	
	
	
</body>
</html>
