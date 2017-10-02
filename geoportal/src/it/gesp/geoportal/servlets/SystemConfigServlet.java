package it.gesp.geoportal.servlets;

import it.gesp.geoportal.constants.Permissions;
import it.gesp.geoportal.dao.dto.GeneralSettingDTO;
import it.gesp.geoportal.dao.dto.SystemSettingDTO;
import it.gesp.geoportal.dao.entities.User;
import it.gesp.geoportal.exceptions.DataInvalidException;
import it.gesp.geoportal.exceptions.OperationInvalidException;
import it.gesp.geoportal.exceptions.PermissionInvalidException;
import it.gesp.geoportal.json.JsonFactory;
import it.gesp.geoportal.locale.LocaleUtils;
import it.gesp.geoportal.services.LoginService;
import it.gesp.geoportal.services.SystemSettingService;
import it.gesp.geoportal.utils.Utils;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.MessageFormat;
import java.util.ResourceBundle;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;

import com.google.gson.Gson;

public class SystemConfigServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private static final Logger log = Logger.getLogger(SystemConfigServlet.class);
	private ResourceBundle dbMessages = LocaleUtils.getDBMessages();
	//private ResourceBundle userMessages = LocaleUtils.getUserMessages("en");

	public SystemConfigServlet() {
		super();
	}

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		doWork(request, response);
	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		doWork(request, response);
	}

	@SuppressWarnings("unchecked")
	private void doWork(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		HttpSession currentSession = request.getSession(false);
		
		String currentLanguage = LoginService.getCurrentLanguageFromSessionOrDefault(currentSession);
		ResourceBundle userMessages = LocaleUtils.getUserMessages(currentLanguage);
		
		User currentUser = LoginService.getLoggedInUserFromSession(currentSession);
		
		SystemSettingService systemSettingsService = new SystemSettingService();
				
		PrintWriter w = response.getWriter();
		String jsonRes = null;

		String oper = request.getParameter("oper");

		/*
		 * Check that the user is connected
		 */
		
		if (currentUser == null && !"exportExternalWmsServersAsJson".equalsIgnoreCase(oper)) {
			//Export external WMS servers is allowed even if the user is not logged in
			jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_NOT_LOGGED_IN"));
			ServletUtils.writeAndFlush(log, w, jsonRes);
			return;
		}

		try {

			/*
			 * SYSTEM CONFIGS
			 */
			if ("systemConfigs".equalsIgnoreCase(oper)) {

				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser,Permissions.SYSTEM_CONFIG_ADMIN)) {
					// User does not have the permission
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				
				jsonRes = systemSettingsService.getAdminSystemSettingsAsJson();
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			
			/*
			 * SAVE SYSTEM CONFIGS
			 */
			else if ("saveSystemConfigs".equalsIgnoreCase(oper)) {

				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser,Permissions.SYSTEM_CONFIG_ADMIN)) {
					// User does not have the permission
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				
				String settingsJson = request.getParameter("settings");
				if (Utils.isNullOrEmpty(settingsJson)) {
					log.debug("Error parsing settings parameter");
					throw new DataInvalidException();
				}
				
				Gson gson = JsonFactory.getGson();
				SystemSettingDTO systemSettings = gson.fromJson(settingsJson, SystemSettingDTO.class);
				
				systemSettingsService.saveSystemSettings(systemSettings);
				jsonRes = GeoportalResponse.createSuccessResponse(null, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			
			/*
			 * GENERAL CONFIGS
			 */
			else if ("generalConfigs".equalsIgnoreCase(oper)) {

				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser,Permissions.GENERAL_CONFIG_ADMIN)) {
					// User does not have the permission
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				
				jsonRes = systemSettingsService.getGeneralSettingsAsJson();
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			
			/*
			 * SAVE SYSTEM CONFIGS
			 */
			else if ("saveGeneralConfigs".equalsIgnoreCase(oper)) {

				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser,Permissions.GENERAL_CONFIG_ADMIN)) {
					// User does not have the permission
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				
				String settingsJson = request.getParameter("settings");
				if (Utils.isNullOrEmpty(settingsJson)) {
					log.debug("Error parsing settings parameter");
					throw new DataInvalidException();
				}
				
				Gson gson = JsonFactory.getGson();
				GeneralSettingDTO generalSettings = gson.fromJson(settingsJson, GeneralSettingDTO.class);
				
				systemSettingsService.saveGeneralSettings(generalSettings);
				jsonRes = GeoportalResponse.createSuccessResponse(null, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			
			/*
			 * EXPORT WMS SERVER CONFIG AS JSON
			 */
			else if ("exportExternalWmsServersAsJson".equalsIgnoreCase(oper)) {
				
				String res = systemSettingsService.getExternalWMSServerConfigAsJson();
				ServletUtils.writeAndFlush(log, w, res);
			}
			
			else {
				log.debug("Wrong OPER param");
				throw new DataInvalidException();
			}

		} catch (DataInvalidException de) {
			log.debug("Data invalid exception.", de);
			if (de.getMessage() != null) {
				jsonRes = GeoportalResponse.createErrorResponse(de.getMessage());
			} else {
				jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("MISSING_PARAMETERS"));
			}
			ServletUtils.writeAndFlush(log, w, jsonRes);

		} catch (PermissionInvalidException pei) {
			log.debug("Permssion invalid exception", pei);
			jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
			ServletUtils.writeAndFlush(log, w, jsonRes);
		} catch (OperationInvalidException oie) {
			try {
				String realMess = MessageFormat.format(userMessages.getString(oie.getExceptionCode()), (Object[])oie.getArgs());
				log.debug("OperationInvalidException", oie);
				jsonRes = GeoportalResponse.createErrorResponse(realMess, oie.getExceptionCode());
			} catch (Exception x) {
				jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("GENERIC_ERROR"));
			}
			ServletUtils.writeAndFlush(log, w, jsonRes);
			
		} catch (Exception x) {
			log.debug("Generic exception", x);
			jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("GENERIC_ERROR"));
			ServletUtils.writeAndFlush(log, w, jsonRes);
		}

	}

}
