<%-- <%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%> --%>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ page import="it.gesp.geoportal.locale.LocaleUtils, it.gesp.geoportal.services.LoginService,it.gesp.geoportal.constants.Permissions,it.gesp.geoportal.dao.entities.User,it.gesp.geoportal.services.LogService" %>

<!DOCTYPE html>
<html>
<head>
	<title>Configuracion de fuentes WMS</title>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	
	<%@ include file="admin_config_common_js.jspf" %>
	
	<!-- Manager Roles scripts and CSS-->
	<link rel="stylesheet" href="css/admin/managerUsers.css" type="text/css">
	
	<!-- Start script -->
	<script>
		$(document).ready(function(){
			//Move the logContainer into the BodyContent
			var logContainer = $("#logContainer");
			logContainer.detach();
			
			$(".center-container").append(logContainer);
			
			LocaleManager.refreshLocale();
			AdminMenu.setShowLogsPageActive();
			//mLogs.init();
			
			$("#logs-refresh").button();
		});
		
		function reloadPage() {
			var selectedNumRows = $("#lines").val();
			location.href = './admin?page=show_logs&numRows=' + selectedNumRows;
		}
	</script>
	
	<style>
		#logContainer {
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
	
		<jsp:body></jsp:body>
		
	</t:generic_admin_page>
	
	<div id="logContainer">
	
	<%
		int numRows = 500;
		
		try {
			String numRowsString = request.getParameter("numRows");
			numRows = Integer.parseInt(numRowsString);
		} catch (Exception x) {
			//Error...
			//use the default value
		}
	%>
		<p><b>Mostrar el contenido de los logs del Geoportal.</b></p>
		<p>Numero maximo de lineas: <input type="text" name="lines" id="lines" value="<%=numRows%>">
			<button id="logs-refresh" data-locale_key="General_Refresh" data-locale_ref="text" class="localizedElement" onclick="reloadPage();"></button>
		</p>
		
		<textarea readonly="readonly" style="width:100%;height:50em;font-size:small" name="logs" id="logs"><%		
			LogService logService = new LogService();
			//String rows = logService.getLastLogRowsAsString(1000);
			String rows = logService.getLastLogRowsFast(numRows);
			out.println(rows);
		%></textarea>
	</div>
	
</body>
</html>
