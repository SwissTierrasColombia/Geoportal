<%-- <%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%> --%>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ page import="it.gesp.geoportal.locale.LocaleUtils, it.gesp.geoportal.services.LoginService,it.gesp.geoportal.constants.Permissions,it.gesp.geoportal.dao.entities.User" %>

<!DOCTYPE html>
<html>
<head>
<title>Configuracion de Mapa</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<%@ include file="admin_config_common_js.jspf" %>

<!-- Manager Maps scripts and CSS's-->
<link rel="stylesheet" href="css/admin/managerMaps.css" type="text/css">
<script type="text/javascript" src="scripts/admin/managerMaps.js"></script>

<!-- Start script -->
<script>
	$(document).ready(function(){
		LocaleManager.refreshLocale();
		AdminMenu.setMapConfigPageActive();
		Utils.enableTooltip();
		mMaps.init();
	});
</script>

<style>

#group-input-name-mod {
	width: 360px;
}

</style>

</head>

<body>
	<t:generic_admin_page>
		<jsp:attribute name="header">
	    </jsp:attribute>
	    
	    <jsp:attribute name="footer">
	    </jsp:attribute>
	    
	    <jsp:body>
				<div id="m-groups">
					<div id="m-panel-header">
						<div data-locale_key="Manager_Map_TitlePanelGroups" data-locale_ref="text" class="localizedElement m-panel-title"></div>
						<div class="m-toolbars manager-toolbar">
							<div id="m-groups-add" data-locale_key="Manager_Map_Button_AddGroup" data-locale_ref="title" class="localizedElement grid-toolbar-item" onclick="mMaps.openDialogAddGroup();"><i class="fa fa-plus fa-2x"></i></div>
						</div>
					</div>
					<div id="m-groups-body">
						<div id="m-groups-list"></div>
					</div>
				</div>
				<div id="m-layers">
					<div id="m-panel-header">
						<div data-locale_key="Manager_Map_TitlePanelLayers" data-locale_ref="text" class="localizedElement m-panel-title"></div>
					</div>
					<div id="m-layers-body">
						<div id="m-layers-list"></div>
					</div>
				</div>
			
	    </jsp:body>
	</t:generic_admin_page>
	
	<form id="form-addgroup-dialog" onSubmit="return false;">
		<div data-locale_key="Manager_Maps_HeaderForm_AddGroup" data-locale_ref="text" class="localizedElement data-grid-form-header"></div>
		<div class="itemform">
			<div style="padding-top: 8px;" data-locale_key="Manager_Maps_Label_NameGroup" data-locale_ref="text" class="localizedElement form-label-title"></div>
			<div><input type="text" id="group-input-name" required></div>
		</div>
	</form>
	
	<form id="form-modgroup-dialog" onSubmit="return false;">
		<div data-locale_key="Manager_Maps_HeaderForm_ModGroup" data-locale_ref="text" class="localizedElement data-grid-form-header"></div>
		<div class="itemform">
			<input id="group-input-id-mod" type="hidden">
			<div style="padding-top: 8px;" data-locale_key="Manager_Maps_Label_NameGroup" data-locale_ref="text" class="localizedElement form-label-title"></div>
			<div><input type="text" id="group-input-name-mod" required></div>
		</div>
	</form>
	
	<div id="form-delgroup-dialog"></div>

</body>
</html>