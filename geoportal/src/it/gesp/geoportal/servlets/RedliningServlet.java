package it.gesp.geoportal.servlets;

import it.gesp.geoportal.dao.RedlineTypes;
import it.gesp.geoportal.dao.dto.RedliningDTO;
import it.gesp.geoportal.dao.entities.User;
import it.gesp.geoportal.locale.LocaleUtils;
import it.gesp.geoportal.services.LogService;
import it.gesp.geoportal.services.LoginService;
import it.gesp.geoportal.services.RedlineService;

import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.ResourceBundle;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;


@WebServlet("/RedliningServlet")
public class RedliningServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private static final Logger log = Logger.getLogger(RedliningServlet.class);
	private ResourceBundle dbMessages = LocaleUtils.getDBMessages();
	
	public RedliningServlet() {
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

		//ResourceBundle userMessages = LocaleUtils.getUserMessages("en");
		
		HttpSession currentSession = request.getSession(false);
		String currentLanguage = LoginService.getCurrentLanguageFromSessionOrDefault(currentSession);
		ResourceBundle userMessages = LocaleUtils.getUserMessages(currentLanguage);
		
		User currentUser = LoginService.getLoggedInUserFromSession(currentSession);

		RedlineService redlineService = new RedlineService();
		
		String oper = request.getParameter("oper");
		String type = request.getParameter("type");
		
		if (oper != null) {
			log.debug("Redlining Servlet - Operation " + oper);
		}
		else {
			log.debug("Redlining Servlet - NULL Operation parameter");
		}
		
		try {
			/*
			 * GET 
			 */
			if ("get".equals(oper)) {
				
				PrintWriter w = response.getWriter();
				
				List<RedliningDTO> redlinings = new ArrayList<RedliningDTO>();
				if (currentUser != null) {
					
					String redlineType = request.getParameter("type");
					
					if (RedlineTypes.COMMENTARY.equals(type)) {
						//Permission test
					} else if (RedlineTypes.REDLINE.equals(type)) {
						//Permission test
					} else {
						//Error...
						String err = GeoportalResponse.createErrorResponse(userMessages.getString("TYPE_PARAMETER_MISSING_OR_INVALID"));
						ServletUtils.writeAndFlush(log, w, err);
						return;
					}
					
					
					redlinings = redlineService.getRedlinings(currentUser, redlineType);
					//LogService.writeLog(currentUser, dbMessages.getString("REDLINE_CONTEXT"), dbMessages.getString("REDLINE_GET_OPERATION"), dbMessages.getString("REDLINE_RETRIEVED_DESC"));
				}
				
				GeoportalResponse gpr = new GeoportalResponse();
				gpr.setSuccess(true);
				gpr.setResult(redlinings);
				String jsonRes = new Gson().toJson(gpr);
	
				ServletUtils.writeAndFlush(log, w, jsonRes);
			} 
			
			/*
			 * SAVE
			 */
			else if ("save".equals(oper)) {
	
				// Response
				GeoportalResponse gpr = new GeoportalResponse();
				PrintWriter w = response.getWriter();
				
				/*
				 * If the user is not logged in, SAVE cannot be done.
				 */
				if (currentUser == null) {
					String jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_NOT_LOGGED_IN"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				
				// Save all
				String featureListString = (String) request.getParameter("list");
	
				List<RedliningDTO> featureList = null;
				// Parse redlinings
				try {
					Type collectionType = new TypeToken<List<RedliningDTO>>() {
					}.getType();
					featureList = new Gson().fromJson(featureListString, collectionType);
					
				} catch (Exception x) {
					// Error parsing the featureList
					String jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("NO_FEATURELIST_SPECIFIED"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
				}
				try {
	
					String redlineType = request.getParameter("type");
					
					if (RedlineTypes.COMMENTARY.equals(type)) {
						//Permission test
					} else if (RedlineTypes.REDLINE.equals(type)) {
						//Permission test
					} else {
						//Error...
						String err = GeoportalResponse.createErrorResponse(userMessages.getString("TYPE_PARAMETER_MISSING_OR_INVALID"));
						ServletUtils.writeAndFlush(log, w, err);
						return;
					}
					
					redlineService.saveAllRedlinings(currentUser, featureList, redlineType);
					
					//LogService.writeLog(currentUser, dbMessages.getString("REDLINE_CONTEXT"), dbMessages.getString("REDLINE_SAVE_OPERATION"), dbMessages.getString("REDLINE_SAVED_DESC"));
					
					gpr.setSuccess(true);
					String jsonRes = new Gson().toJson(gpr);
					
					log.debug("Redlining Servlet response: SAVE: " + featureList.size()
							+ " feature saved. Response " + jsonRes);
					ServletUtils.writeAndFlush(log, w, jsonRes);
	
				} catch (Exception x) {
					log.debug("Generic exception", x);
					String jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("ERROR_SAVING_DATA"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					w.write(jsonRes);
					w.flush();
				}
				
			} else {
				log.debug("Redlining Servlet Wrong OPER param");
			}
		} catch (Exception x) {
			log.debug(x);
		}
	}

}
