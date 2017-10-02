package it.gesp.geoportal.servlets;

import it.gesp.geoportal.constants.Permissions;
import it.gesp.geoportal.dao.entities.User;
import it.gesp.geoportal.exceptions.PermissionInvalidException;
import it.gesp.geoportal.services.LoginService;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;

/**
 * Servlet implementation class Admin
 */
public class Admin extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private static final Logger log = Logger.getLogger(Admin.class);
	//private ResourceBundle userMessages = LocaleUtils.getUserMessages("en");

	private static final String LAYER_CONFIG = "/WEB-INF/jsp/admin/admin_layer_config.jsp";
	private static final String SOURCE_CONFIG = "/WEB-INF/jsp/admin/admin_source_config.jsp";
	private static final String MAP_CONFIG = "/WEB-INF/jsp/admin/admin_map_config.jsp";
	private static final String MAP_SETTING_CONFIG = "/WEB-INF/jsp/admin/admin_map_setting_config.jsp";
	private static final String ROLE_CONFIG = "/WEB-INF/jsp/admin/admin_role_config.jsp";
	private static final String SHOW_LOGS = "/WEB-INF/jsp/admin/admin_show_logs.jsp";
	private static final String TEST_REQUESTS = "/WEB-INF/jsp/admin/admin_test_requests.jsp";
	private static final String USER_CONFIG = "/WEB-INF/jsp/admin/admin_user_config.jsp";
	private static final String SYSTEM_CONFIG = "/WEB-INF/jsp/admin/admin_system_config.jsp";
	private static final String GENERAL_CONFIG = "/WEB-INF/jsp/admin/admin_general_config.jsp";
	private static final String ALERT_CONFIG = "/WEB-INF/jsp/admin/admin_alerts_config.jsp";
	
	
	private static final String ADMIN_LOGIN = "/WEB-INF/jsp/admin/admin_login.jsp";
	
	public Admin() {
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

	private void doWork(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		HttpSession currentSession = request.getSession(false);

		User currentUser = LoginService.getLoggedInUserFromSession(currentSession);

		String targetPage = null;
		
		try {
		/*
		 * Check that the user is connected
		 */
		if (currentUser == null) {
			/*
			 * If the user is not logged in, show the Login Form.
			 */
			targetPage = ADMIN_LOGIN;

		} else {

			String page = request.getParameter("page");
			
			targetPage = MAP_CONFIG;
			
			if ("system_config".equals(page)) {
				if (!LoginService.hasPermission(currentUser,Permissions.SYSTEM_CONFIG_ADMIN)) {
					throw new PermissionInvalidException();
				}
				targetPage = SYSTEM_CONFIG;
			} else if ("general_config".equals(page)) {
				if (!LoginService.hasPermission(currentUser,Permissions.GENERAL_CONFIG_ADMIN)) {
					throw new PermissionInvalidException();
				}
				targetPage = GENERAL_CONFIG;
			} else if ("alert_config".equals(page)) {
					if (!LoginService.hasPermission(currentUser,Permissions.ALERTS_CONFIG_ADMIN)) {
						throw new PermissionInvalidException();
					}
					targetPage = ALERT_CONFIG;
			} else if ("layer_config".equals(page)) {
				if (!LoginService.hasPermission(currentUser,Permissions.LAYER_CONFIG_ADMIN)) {
					throw new PermissionInvalidException();
				}
				targetPage = LAYER_CONFIG;
			} else if ("map_config".equals(page)) {
				if (!LoginService.hasPermission(currentUser,Permissions.MAP_CONFIG_ADMIN)) {
					throw new PermissionInvalidException();
				}
				targetPage = MAP_CONFIG;
			} else if ("map_setting_config".equals(page)) {
				if (!LoginService.hasPermission(currentUser,Permissions.MAP_SETTING_CONFIG_ADMIN)) {
					throw new PermissionInvalidException();
				}
				targetPage = MAP_SETTING_CONFIG;
			}
			else if ("role_config".equals(page)) {
				if (!LoginService.hasPermission(currentUser,Permissions.ROLE_ADMIN)) {
					throw new PermissionInvalidException();
				}
				targetPage = ROLE_CONFIG;
			} else if ("show_logs".equals(page)) {
				if (!LoginService.hasPermission(currentUser,Permissions.SHOW_LOGS_ADMIN)) {
					throw new PermissionInvalidException();
				}
				targetPage = SHOW_LOGS;
				
				String numRows = request.getParameter("numRows");
				if (numRows != null && !"".equals(numRows)) {
					targetPage += "?numRows=" + numRows;
				}
				
			} else if ("test_requests".equals(page)) {
				if (!LoginService.hasPermission(currentUser,Permissions.TEST_REQUESTS_ADMIN)) {
					throw new PermissionInvalidException();
				}
				targetPage = TEST_REQUESTS;
			} else if ("user_config".equals(page)) {
				if (!LoginService.hasPermission(currentUser,Permissions.USER_ADMIN)) {
					throw new PermissionInvalidException();
				}
				targetPage = USER_CONFIG;
			} else if ("source_config".equals(page)) {
				if (!LoginService.hasPermission(currentUser,Permissions.SOURCE_CONFIG_ADMIN)) {
					throw new PermissionInvalidException();
				}
				targetPage = SOURCE_CONFIG;
			}
		}
		} catch (PermissionInvalidException pei) {
			log.debug("Permssion invalid exception", pei);
			/*
			 * The user does not have the permission to see that page.
			 * Redirect to "default page", or to LOGIN_PAGE
			 */
			targetPage = ADMIN_LOGIN;
			
		}
		// RequestDispatcher rd = request.getRequestDispatcher("/WEB-INF/jsp/geoportal_main.jsp");
		RequestDispatcher rd = request.getRequestDispatcher(targetPage);
		rd.forward(request, response);
	}
}
