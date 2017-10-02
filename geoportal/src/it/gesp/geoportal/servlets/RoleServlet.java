package it.gesp.geoportal.servlets;

import it.gesp.geoportal.PaginationObject;
import it.gesp.geoportal.constants.Permissions;
import it.gesp.geoportal.dao.entities.Permission;
import it.gesp.geoportal.dao.entities.Role;
import it.gesp.geoportal.dao.entities.User;
import it.gesp.geoportal.exceptions.DataInvalidException;
import it.gesp.geoportal.exceptions.OperationInvalidException;
import it.gesp.geoportal.exceptions.PermissionInvalidException;
import it.gesp.geoportal.locale.LocaleUtils;
import it.gesp.geoportal.services.LoginService;
import it.gesp.geoportal.services.RoleService;
import it.gesp.geoportal.utils.Utils;

import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.lang.reflect.Type;
import java.nio.charset.StandardCharsets;
import java.text.MessageFormat;
import java.util.List;
import java.util.ResourceBundle;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class RoleServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private static final Logger log = Logger.getLogger(RoleServlet.class);
	private ResourceBundle dbMessages = LocaleUtils.getDBMessages();
	//private ResourceBundle userMessages = LocaleUtils.getUserMessages("en");

	public RoleServlet() {
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

		RoleService roleService = new RoleService();
		PrintWriter w = response.getWriter();
		
		//String currentCH = response.getCharacterEncoding();
		//PrintWriter w = new PrintWriter(new OutputStreamWriter(response.getOutputStream(), StandardCharsets.UTF_8), true);
				
		
		
		String jsonRes = null;

		String oper = request.getParameter("oper");
		if (oper != null) {
			log.debug("Role Servlet - Operation " + oper);
		}
		else {
			log.debug("Role Servlet - NULL Operation parameter");
		}

		/*
		 * Check that the user is connected
		 */
		if (currentUser == null) {
			jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_NOT_LOGGED_IN"));
			ServletUtils.writeAndFlush(log, w, jsonRes);
			return;
		}

		try {

			/*
			 * GET ROLES
			 */
			if ("roles".equalsIgnoreCase(oper)) {

				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser,Permissions.ROLE_ADMIN)) {
					// User does not have the permission
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}

				List<Role> roles = roleService.getRoles();
				
				PaginationObject<Role> paginationObject = PaginationObject.createFromList(roles);
				jsonRes = GeoportalResponse.createSuccessResponse(paginationObject, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			} 
			/*
			 * GET AVAILABLE PERMISSIONS PER ROLE
			 */
			else if ("availablePermissions".equalsIgnoreCase(oper)) {
				
				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser,Permissions.ROLE_ADMIN)) {
					// User does not have the permission
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				int roleId = -1;
				try {
				String roleIdStr = request.getParameter("roleId");
				roleId = Integer.parseInt(roleIdStr);
				} catch (Exception x) {
					//log
					throw new DataInvalidException();
				}

				List<Permission> permissions = roleService.getAvailablePermissionsForRole(roleId);
				jsonRes = GeoportalResponse.createSuccessResponse(permissions, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			/*
			 * GET ASSOCIATED PERMISSIONS PER ROLE
			 */
			else if ("associatedPermissions".equalsIgnoreCase(oper)) {
				
				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser,Permissions.ROLE_ADMIN)) {
					// User does not have the permission
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				int roleId = -1;
				try {
				String roleIdStr = request.getParameter("roleId");
				roleId = Integer.parseInt(roleIdStr);
				} catch (Exception x) {
					log.debug("Error parsing roleId parameter", x);
					throw new DataInvalidException();
				}

				Set<Permission> permissions = roleService.getPermissionsForRole(roleId);
				jsonRes = GeoportalResponse.createSuccessResponse(permissions, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			/*
			 * SET PERMISSIONS TO ROLE
			 */
			else if ("setPermissions".equalsIgnoreCase(oper)) {
				
				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser,Permissions.ROLE_ADMIN)) {
					// User does not have the permission
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				
				int roleId = -1;
				try {
				String roleIdStr = request.getParameter("roleId");
				roleId = Integer.parseInt(roleIdStr);
				} catch (Exception x) {
					log.debug("Error parsing roleId parameter", x);
					throw new DataInvalidException();
				}

				List<Integer> permissionIds = null;
				String permissionIdsString = request.getParameter("permissionIds");
				// Parse permissions
				try {
					
					Type collectionType = new TypeToken<List<Integer>>() {}.getType();
					permissionIds = new Gson().fromJson(permissionIdsString,collectionType);
				} catch (Exception x) {
					log.debug("Error parsing permissionIds parameter", x);
					throw new DataInvalidException();
				}
				
				roleService.setPermissionsForRole(roleId, permissionIds);
				jsonRes = GeoportalResponse.createSuccessResponse(null, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			/*
			 * DELETE ROLE
			 */
			else if ("deleteRole".equalsIgnoreCase(oper)) {
				
				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser,Permissions.ROLE_ADMIN)) {
					// User does not have the permission
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				int roleId = -1;
				try {
				String roleIdStr = request.getParameter("roleId");
				roleId = Integer.parseInt(roleIdStr);
				} catch (Exception x) {
					log.debug("Error parsing roleId parameter", x);
					throw new DataInvalidException();
				}

				roleService.deleteRole(roleId);
				jsonRes = GeoportalResponse.createSuccessResponse(null, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			/*
			 * ADD ROLE
			 */
			else if ("addRole".equalsIgnoreCase(oper)) {
				
				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser,Permissions.ROLE_ADMIN)) {
					// User does not have the permission
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				
				String roleName = request.getParameter("roleName");
				if (Utils.isNullOrEmpty(roleName)) {
					log.debug("role name is NULL");
					throw new DataInvalidException();
				}
				
				String roleDescription = request.getParameter("roleDescription");
				if (Utils.isNullOrEmpty(roleDescription)) {
					log.debug("roleDescription is NULL");
					throw new DataInvalidException();
				}
				
				Role role = new Role();
				role.setRoleName(roleName);
				role.setRoleDescription(roleDescription);
				roleService.addRole(role);
				jsonRes = GeoportalResponse.createSuccessResponse(role, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			/*
			 * UPDATE ROLE
			 */
			else if ("updateRole".equalsIgnoreCase(oper)) {
				
				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser,Permissions.ROLE_ADMIN)) {
					// User does not have the permission
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				
				int roleId = -1;
				try {
				String roleIdStr = request.getParameter("roleId");
				roleId = Integer.parseInt(roleIdStr);
				} catch (Exception x) {
					log.debug("Error parsing roleId parameter", x);
					throw new DataInvalidException();
				}
				
				String roleName = request.getParameter("roleName");
				if (Utils.isNullOrEmpty(roleName)) {
					log.debug("role name is NULL");
					throw new DataInvalidException();
				}
				
				String roleDescription = request.getParameter("roleDescription");
				if (Utils.isNullOrEmpty(roleDescription)) {
					log.debug("roleDescription is NULL");
					throw new DataInvalidException();
				}
				
				Role role = new Role();
				role.setIdRole(roleId);
				role.setRoleName(roleName);
				role.setRoleDescription(roleDescription);
				roleService.updateRole(role);
				jsonRes = GeoportalResponse.createSuccessResponse(role, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			else {
				log.debug("Wrong OPER param");
				throw new DataInvalidException();

			}

		} catch (DataInvalidException de) {
			log.debug("Data invalid exception", de);
			if (de.getMessage() != null) {
				jsonRes = GeoportalResponse.createErrorResponse(de.getMessage());
			} else {
				jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("MISSING_PARAMETERS"));
			}
			ServletUtils.writeAndFlush(log, w, jsonRes);

		} catch (PermissionInvalidException pei) {
			log.debug("Permission invalid exception", pei);
			jsonRes = GeoportalResponse.createErrorResponse(userMessages
					.getString("USER_DOES_NOT_HAVE_PERMISSION"));
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
