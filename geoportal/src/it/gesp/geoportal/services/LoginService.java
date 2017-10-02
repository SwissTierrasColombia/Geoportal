package it.gesp.geoportal.services;

import it.gesp.geoportal.constants.Permissions;
import it.gesp.geoportal.dao.entities.User;
import it.gesp.geoportal.locale.LocaleUtils;

import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;

public class LoginService {
	private static final Logger log = Logger.getLogger(LoginService.class);
	private static String geoserverTokenForAlerts = "alerts_view";
	
	public static void setLoggedInUserInSession(HttpSession session,
			User currentUser) {
		session.setAttribute("currentUser", currentUser);
	}

	public static User getLoggedInUserFromSession(HttpSession session) {
		User user = null;
		if (session != null) {
			user = (User) session.getAttribute("currentUser");
		}
		return user;
	}
	
//	public static String getGeoserverTokenFromSession(HttpSession session) {
//		if (LoginService.currentUserHasPermission(session, Permissions.ALERTS_DOWNLOAD)) {
//			return LoginService.geoserverTokenForAlerts;
//		}
//		return null;
//	}
	
	public static String getAlertsDownloadGeoserverLayerName(HttpSession session) {
		
		try {
			if (LoginService.currentUserHasPermission(session, Permissions.ALERTS_DOWNLOAD)) {
				return new SystemSettingService().getSystemSettingByKey("ALERTS_GEOSERVER_LAYER_NAME");
			}
		} catch (Exception x) {
			log.error(x);
		}
		
		return null;
	}
	
	public static String getAlertsDownloadGeoserverUsername(HttpSession session) {
		if (LoginService.currentUserHasPermission(session, Permissions.ALERTS_DOWNLOAD)) {
			return new SystemSettingService().getSystemSettingByKey("ALERTS_GEOSERVER_USERNAME");
		}
		return null;
	}
	
	public static String getAlertsDownloadGeoserverPassword(HttpSession session) {
		if (LoginService.currentUserHasPermission(session, Permissions.ALERTS_DOWNLOAD)) {
			return new SystemSettingService().getSystemSettingByKey("ALERTS_GEOSERVER_PASSWORD");
		}
		return null;
	}
	
	
	
	public static void setCurrentLanguageInSession(HttpSession session, String language) {
		if (session != null) {
			session.setAttribute("currentLanguage", language);
		}
	}
	
	public static String getCurrentLanguageFromSessionOrDefault(HttpSession session) {
		String language = null;
		if (session != null) {
			language = (String) session.getAttribute("currentLanguage");
			if (language == null) {
				language = LocaleUtils.getDefaultLanguage();
			}
		} else{
			language = LocaleUtils.getDefaultLanguage();
		}
		
		return language;
	}
	
	public static String getCurrentLanguageFromSession(HttpSession session) {
		String language = null;
		if (session != null) {
			language = (String) session.getAttribute("currentLanguage");
		}
		return language;
	}

	public static boolean hasPermission(User user, String permission) {
		boolean hasPermission = false;
		for (String codPermission : user.getPermissionCodList()) {
			if (codPermission.equals(permission)) {
				hasPermission = true;
			}
		}
		log.debug("Checking if user " + user.getUsername() + " has permission " + permission + ": " + hasPermission);
		return hasPermission;
	}
	
	public static boolean currentUserHasPermission(HttpSession session, String permission) {
		boolean hasPermission = false;
		String userStr= "NULL";
		User user = getLoggedInUserFromSession(session);
		if (user != null) {
			userStr = user.getUsername();
			return hasPermission = hasPermission(user, permission);
		}
		
		log.debug("Checking if current user (" + userStr +  ") has permission " + permission + ": " + hasPermission);
		return hasPermission;
	}
}
