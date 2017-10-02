package it.gesp.geoportal.servlets;

import it.gesp.geoportal.PaginationObject;
import it.gesp.geoportal.constants.Permissions;
import it.gesp.geoportal.dao.entities.User;
import it.gesp.geoportal.exceptions.DataInvalidException;
import it.gesp.geoportal.exceptions.OperationInvalidException;
import it.gesp.geoportal.exceptions.PermissionInvalidException;
import it.gesp.geoportal.locale.LocaleUtils;
import it.gesp.geoportal.services.LoginService;
import it.gesp.geoportal.services.UserService;
import it.gesp.geoportal.utils.Utils;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.ResourceBundle;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;

public class UserServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private static final Logger log = Logger.getLogger(UserServlet.class);
	private ResourceBundle dbMessages = LocaleUtils.getDBMessages();
	//private ResourceBundle userMessages = LocaleUtils.getUserMessages("en");

	public UserServlet() {
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

		//currentUser = new UserService().getUserByUsername("mosef", true);

		UserService userService = new UserService();
		PrintWriter w = response.getWriter();
		String jsonRes = null;

		String oper = request.getParameter("oper");

		/*
		 * Check that the user is connected
		 */
		if (currentUser == null) {
			jsonRes = GeoportalResponse.createErrorResponse(userMessages
					.getString("USER_NOT_LOGGED_IN"));
			ServletUtils.writeAndFlush(log, w, jsonRes);
			return;
		}

		try {

			/*
			 * GET USERS
			 */
			if ("users".equalsIgnoreCase(oper)) {

				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser,Permissions.USER_ADMIN)) {
					// User does not have the permission
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}

				List<User> users = userService.getUsers();
				
				PaginationObject<User> paginationObject = PaginationObject.createFromList(users);
				jsonRes = GeoportalResponse.createSuccessResponseWithSerializationOfNulls(paginationObject, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			} 
			
			/*
			 * SET ROLE TO USER
			 */
			else if ("setRole".equalsIgnoreCase(oper)) {
				
				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser,Permissions.USER_ADMIN)) {
					// User does not have the permission
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				
				int userId = -1;
				try {
					String userIdStr = request.getParameter("userId");
					userId = Integer.parseInt(userIdStr);
				} catch (Exception x) {
					log.debug("Error parsing userId parameter", x);
					throw new DataInvalidException();
				}

				int roleId = -1;
				try {
					String roleIdStr = request.getParameter("roleId");
					roleId = Integer.parseInt(roleIdStr);
				} catch (Exception x) {
					log.debug("Error parsing roleId parameter", x);
					throw new DataInvalidException();
				}
				
				userService.setRoleForUser(userId, roleId);
				jsonRes = GeoportalResponse.createSuccessResponse(null, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			/*
			 * ADD USER
			 */
			else if ("addUser".equalsIgnoreCase(oper)) {
				
				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser,Permissions.USER_ADMIN)) {
					// User does not have the permission
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				
				String userName = request.getParameter("username");
				if (Utils.isNullOrEmpty(userName)) {
					log.debug("Error parsing roleId parameter");
					throw new DataInvalidException();
				}
				
				String password = request.getParameter("password");
				if (Utils.isNullOrEmpty(password)) {
					log.debug("Error parsing password parameter");
					throw new DataInvalidException();
				}
				
				int roleId = -1;
				try {
					String roleIdStr = request.getParameter("roleId");
					roleId = Integer.parseInt(roleIdStr);
				} catch (Exception x) {
					//log
					log.debug("Error parsing roleId parameter");
					throw new DataInvalidException();
				}
				
				User user = new User();
				user.setPassword(password);
				user.setUsername(userName);
				
				userService.addUser(user, roleId);
				jsonRes = GeoportalResponse.createSuccessResponse(null, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			/*
			 * Update USER
			 */
			else if ("updateUser".equalsIgnoreCase(oper)) {
				
				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser,Permissions.USER_ADMIN)) {
					// User does not have the permission
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				
				int userId = -1;
				try {
					String userIdStr = request.getParameter("userId");
					userId = Integer.parseInt(userIdStr);
				} catch (Exception x) {
					//log
					log.debug("Error parsing userId parameter");
					throw new DataInvalidException();
				}
				
				
				String password = request.getParameter("password");
				if (Utils.isNullOrEmpty(password)) {
					log.debug("Error parsing password parameter");
					throw new DataInvalidException();
				}
				
				int roleId = -1;
				try {
					String roleIdStr = request.getParameter("roleId");
					roleId = Integer.parseInt(roleIdStr);
				} catch (Exception x) {
					//log
					log.debug("Error parsing roleId parameter");
					throw new DataInvalidException();
				}
				
				User user = new User();
				user.setIdUser(userId);
				user.setPassword(password);
				
				userService.updateUser(user, roleId);
				jsonRes = GeoportalResponse.createSuccessResponse(null, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			/*
			 * DELETE USER
			 */
			else if ("deleteUser".equalsIgnoreCase(oper)) {
				
				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser,Permissions.USER_ADMIN)) {
					// User does not have the permission
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				int userId = -1;
				try {
					String userIdStr = request.getParameter("userId");
					userId = Integer.parseInt(userIdStr);
				} catch (Exception x) {
					log.debug("Error parsing userId parameter");
					throw new DataInvalidException();
				}

				userService.deleteUser(userId);
				jsonRes = GeoportalResponse.createSuccessResponse(null, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			/*
			 * ENABLE USER
			 */
			else if ("enableUser".equalsIgnoreCase(oper)) {
				
				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser,Permissions.USER_ADMIN)) {
					// User does not have the permission
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				int userId = -1;
				try {
					String userIdStr = request.getParameter("userId");
					userId = Integer.parseInt(userIdStr);
				} catch (Exception x) {
					log.debug("Error parsing userId parameter");
					throw new DataInvalidException();
				}

				userService.toggleEnableUser(userId, true);
				jsonRes = GeoportalResponse.createSuccessResponse(null, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			/*
			 * DISABLE USER
			 */
			else if ("disableUser".equalsIgnoreCase(oper)) {
				
				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser,Permissions.USER_ADMIN)) {
					// User does not have the permission
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				int userId = -1;
				try {
					String userIdStr = request.getParameter("userId");
					userId = Integer.parseInt(userIdStr);
				} catch (Exception x) {
					log.debug("Error parsing userId parameter");
					throw new DataInvalidException();
				}

				userService.toggleEnableUser(userId, false);
				jsonRes = GeoportalResponse.createSuccessResponse(null, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			/*
			 * CHANGE PASSWORD
			 */
			else if ("changeUserPassword".equalsIgnoreCase(oper)) {
				
				int userId = -1;
				try {
					String userIdStr = request.getParameter("userId");
					userId = Integer.parseInt(userIdStr);
				} catch (Exception x) {
					log.debug("Error parsing userId parameter");
					throw new DataInvalidException();
				}

				/*
				 * If the user is an administrator, he can change any user password.
				 * If the user is not an administrator, he can change only his password.
				 */
				if (currentUser.getIdUser() == userId) {
					/*
					 * Same user...
					 * Check whether the current user has the appropriate permission
					 */
					if (!LoginService.hasPermission(currentUser,Permissions.USER_SELF_CHANGE_PASSWORD)) {
						// User does not have the permission
						jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
						ServletUtils.writeAndFlush(log, w, jsonRes);
						return;
					}
				} else {
					/*
					 * Not same user...
					 */
					if (!LoginService.hasPermission(currentUser,Permissions.USER_CHANGE_PASSWORD)) {
						// User does not have the permission
						jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
						ServletUtils.writeAndFlush(log, w, jsonRes);
						return;
					}
				}
				
				String currentPassword = request.getParameter("currentPassword");
				if (Utils.isNullOrEmpty(currentPassword)) {
					log.debug("Error with currentPassword parameter");
					throw new DataInvalidException();
				}
				
				String newPassword = request.getParameter("newPassword");
				if (Utils.isNullOrEmpty(newPassword)) {
					log.debug("Error with newPassword parameter");
					throw new DataInvalidException();
				}
				
				try {
					userService.changeUserPassword(userId, currentPassword, newPassword);
				} catch (Exception x) {
					//User not existing or current password invalid.
					log.debug("Error changing the user password.");
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("CHANGE_PASSWORD_WRONG_PASSWORD"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				jsonRes = GeoportalResponse.createSuccessResponse(null, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			/*
			 * RESET PASSWORD
			 */
			else if ("resetPassword".equalsIgnoreCase(oper)) {
				
				int userId = -1;
				try {
					String userIdStr = request.getParameter("userId");
					userId = Integer.parseInt(userIdStr);
				} catch (Exception x) {
					log.debug("Error parsing userId parameter.");
					throw new DataInvalidException();
				}
				
				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser,Permissions.USER_RESET_PASSWORD)) {
					// User does not have the permission
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				
				String newPassword = request.getParameter("newPassword");
				if (Utils.isNullOrEmpty(newPassword)) {
					throw new DataInvalidException();
				}
				
				
				userService.resetUserPassword(userId, newPassword);
				jsonRes = GeoportalResponse.createSuccessResponse(null, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
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
			jsonRes = GeoportalResponse.createErrorResponse(userMessages
					.getString("USER_DOES_NOT_HAVE_PERMISSION"));
			ServletUtils.writeAndFlush(log, w, jsonRes);
		} catch (OperationInvalidException oie) {
			log.debug("OperationInvalidException", oie);
			jsonRes = GeoportalResponse.createErrorResponse("Ya existe un usuario con el mismo nombre.");
			ServletUtils.writeAndFlush(log, w, jsonRes);
		} catch (Exception x) {
			log.debug("Generic exception", x);
			jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("GENERIC_ERROR"));
			ServletUtils.writeAndFlush(log, w, jsonRes);
		}

	}

}
