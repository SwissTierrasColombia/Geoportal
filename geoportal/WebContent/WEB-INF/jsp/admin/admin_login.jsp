<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ page import="it.gesp.geoportal.locale.LocaleUtils, it.gesp.geoportal.services.LoginService,it.gesp.geoportal.constants.Permissions,it.gesp.geoportal.dao.entities.User" %>

<!DOCTYPE html>
<html>
<head>
<title>Login</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<%@ include file="admin_config_common_js.jspf" %>

<!-- Manager Roles scripts and CSS-->
<link rel="stylesheet" href="css/admin/managerUsers.css" type="text/css">
<script type="text/javascript" src="scripts/admin/managerUsers.js"></script>

<!-- Start script -->
<script>
	$(document).ready(function(){
		LocaleManager.refreshLocale();
		
		$("#subm-btn").button();
	});
	
	/**
	 *  Submit login
	 */
// 	function submitLogin() {
// 		var username = $("#login_username").val();
// 		var password = $("#login_password").val();

// 		$.ajax({
// 			url : "login",
// 			type : "GET",
// 			dataType : "json",
// 			cache : false,
// 			data : {
// 				oper: "login",
// 				username : username,
// 				password : password
// 			}
// 		}).done(function(jsonObject) {
// 			if (jsonObject.success === true) {
// 				location.reload(true);
// 			} else {
// 				AlertDialog.createOkDefaultDialog(
// 					LocaleManager.getKey("AlertDialog_Error_Title"), 
// 					jsonObject.msg
// 				);
// 			}
// 		}).fail(function(jqXHR, textStatus, error) {
// 			AlertDialog.createOkDefaultDialog(
// 				LocaleManager.getKey("AlertDialog_Error_Title"), 
// 				LocaleManager.getKey("AlertDialog_Error_LogIn") + error
// 			);
// 			throw "error login";
// 		});
// 	}
</script>
<style>
#login-container {
padding: 10px;
}

#login-message {
	font-weight: bold;
	margin-bottom: 10px
}

.itemform_noborder {
	overflow: hidden;
	height: auto;
	width: auto;
	min-width: 216px;
	padding: 3px 4px 3px 0px;
	margin-bottom: 5px;
}
.itemform_noborder div:first-child {
	float: left;
	width: 155px;
	padding-bottom: 2px;
	padding-top: 4px;
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
			<div id="login-container">
				<div id="login-message" data-locale_key="Login_Message_Text" data-locale_ref="text" class="localizedElement">Please login XX.</div>
				<form action="javascript:LoginUtils.submitLogin();">
				
					<div class="itemform_noborder">
						<div data-locale_key="Username_Text" data-locale_ref="text" class="localizedElement form-label-title"></div>
						<div><input type="text" id="login_username" name="username"></div>
					</div>
				
					<div class="itemform_noborder">
						<div data-locale_key="Password_Text" data-locale_ref="text" class="localizedElement form-label-title"></div>
						<div><input type="password" id="login_password" name="password"></div>
					</div>
					
					<button id="subm-btn">Login</button>
				</form>
			</div>
		</jsp:body>
		
	</t:generic_admin_page>
</body>
</html>
