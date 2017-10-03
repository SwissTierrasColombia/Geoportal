<%-- <%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%> --%>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@page import="it.gesp.geoportal.services.MapConfigService"%>
<%@ page import="it.gesp.geoportal.locale.LocaleUtils, it.gesp.geoportal.services.LoginService,it.gesp.geoportal.constants.Permissions,it.gesp.geoportal.dao.entities.User,it.gesp.geoportal.services.LogService" %>

<!DOCTYPE html>
<html>
<head>
<title>Pruebas de llamadas</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<%@ include file="admin_config_common_js.jspf" %>


<!-- <link rel="stylesheet" href="css/admin/managerUsers.css" type="text/css"> -->

<!-- Start script -->
<script>
	$(document).ready(function(){
		//Move the testRequestContainer into the BodyContent
		//var testRequestContainer = $("#testRequestContainer");
		//testRequestContainer.detach();
		
		//$(".center-container").append(testRequestContainer);
		
		LocaleManager.refreshLocale();
		AdminMenu.setTestRequestsPageActive();
		
		$("#requests-refresh").button();
	});
	
	function loadRequest() {
		var selectedRequest = $("#select-requests").find(":selected");
		
		var url = './mapConfig';
		if ("exportExternalWmsServersAsJson" === selectedRequest.val()) {
			url = './systemConfig';
		}

		$.ajax({
			url : url,
			type : 'POST',
			//dataType : 'json',
			data : {
				oper : selectedRequest.val()
			}
		}).done(function(response) {
			$("#request_result").val(response);
		}).fail(function(jqXHR, textStatus, error){
			
			if (Utils.isEmpty(error)) {
				error = LocaleManager.getKey("Ajax_General_Error");
			}
			
			AlertDialog.createOkDefaultDialog(
				LocaleManager.getKey("AlertDialog_Error_Title"), 
				error,
				"error"
			);
		}).error(function(jqXHR, textStatus, error){
			if (Utils.isEmpty(error)) {
				error = LocaleManager.getKey("Ajax_General_Error");
			}
			AlertDialog.createOkDefaultDialog(
				LocaleManager.getKey("AlertDialog_Error_Title"), 
				error,
				"error"
			);		
		});
	}
	
	
</script>

<style>
	#testRequestContainer {
		padding: 15px;
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
			<div id="testRequestContainer">
		
			<p><b>Pruebas de llamadas</b></p>
			<p>Seleccionar: 
			<select id="select-requests">
				<option value="exportConfigAsJson">exportConfigAsJson</option>
				<option value="exportMapConfigAsJson">exportMapConfigAsJson</option>
				<option value="exportGroupConfigAsJson">exportGroupConfigAsJson</option>
				<option value="exportLayerServicesListAsJson">exportLayerServicesListAsJson</option>
				<option value="exportExternalWmsServersAsJson">exportExternalWMSAsJson</option>
			</select>
			
			<button id="requests-refresh" data-locale_key="General_Refresh" data-locale_ref="text" class="localizedElement" onclick="loadRequest();"></button>
			</p>
			
			<textarea readonly="readonly" style="width:100%;height:50em;font-size:small" name="request_result" id="request_result">
			</textarea>
	</div>
		</jsp:body>
		
	</t:generic_admin_page>
</body>
</html>
