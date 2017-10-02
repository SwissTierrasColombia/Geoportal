function LoginUtils() {
}

LoginUtils.submitLogin = function() {
	var username = $("#login_username").val();
	var password = $("#login_password").val();
	var hashedPassword = md5(password);

	$.ajax({
		url : "login",
		type : "GET",
		dataType : "json",
		cache : false,
		data : {
			oper: "login",
			username : username,
			password : hashedPassword
		}
	}).done(function(jsonObject) {
		if (jsonObject.success === true) {
			//alert('login ok');
			location.reload(true);
			
			// login request to geonetwork
			//TESTsubmitLoginGN(username, password);
		} else {
			AlertDialog.createOkDefaultDialog(
				LocaleManager.getKey("AlertDialog_Error_Title"), 
				jsonObject.msg
			);
		}

	}).fail(function(jqXHR, textStatus, error) {
		AlertDialog.createOkDefaultDialog(
			LocaleManager.getKey("AlertDialog_Error_Title"), 
			LocaleManager.getKey("AlertDialog_Error_LogIn") + error
		);
		throw "error login";
	});
};