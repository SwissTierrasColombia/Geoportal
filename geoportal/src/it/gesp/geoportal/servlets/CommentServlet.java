package it.gesp.geoportal.servlets;

import it.gesp.geoportal.constants.Permissions;
import it.gesp.geoportal.dao.entities.Comment;
import it.gesp.geoportal.dao.entities.User;
import it.gesp.geoportal.exceptions.DataInvalidException;
import it.gesp.geoportal.exceptions.OperationInvalidException;
import it.gesp.geoportal.exceptions.PermissionInvalidException;
import it.gesp.geoportal.locale.LocaleUtils;
import it.gesp.geoportal.services.CommentService;
import it.gesp.geoportal.services.LoginService;
import it.gesp.geoportal.services.UserService;

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


public class CommentServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private static final Logger log = Logger.getLogger(CommentServlet.class);
	//private ResourceBundle dbMessages = LocaleUtils.getDBMessages();
	
	public CommentServlet() {
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
		String currentLanguage = LoginService.getCurrentLanguageFromSessionOrDefault(currentSession);
		ResourceBundle userMessages = LocaleUtils.getUserMessages(currentLanguage);
		
		//User currentUser = LoginService.getLoggedInUserFromSession(currentSession);
		User currentUser = new UserService().getUserByUsername("mosef", true);
		
		CommentService commentService = new CommentService();
		
		
		PrintWriter w = response.getWriter();
		String jsonRes = null;

		String oper = request.getParameter("oper");

		try {

			/*
			 * GET COMMENT
			 */
			if ("getComment".equalsIgnoreCase(oper)) {

				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser,Permissions.COMMENTS_READ)) {
					// User does not have the permission
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}

				Comment comment = commentService.getCommentByUser(currentUser);
				jsonRes = GeoportalResponse.createSuccessResponse(comment, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			
			/*
			 * SAVE COMMENT
			 */
			else if ("saveComment".equalsIgnoreCase(oper)) {

				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser,Permissions.COMMENTS_INSERT)) {
					// User does not have the permission
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}

				//Can be null...
				String commentText = request.getParameter("commentText");
				
				commentService.saveCommentForUser(currentUser, commentText);
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
