package it.gesp.geoportal.servlets;

import it.gesp.geoportal.dao.entities.AlertType;
import it.gesp.geoportal.exceptions.DataInvalidException;
import it.gesp.geoportal.locale.LocaleUtils;
import it.gesp.geoportal.services.AlertService;
import it.gesp.geoportal.services.LoginService;

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

import com.google.gson.Gson;

public class GeneralDataServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private static final Logger log = Logger.getLogger(RedliningServlet.class);
	private ResourceBundle dbMessages = LocaleUtils.getDBMessages();

	public GeneralDataServlet() {
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

		String jsonRes = null;
		PrintWriter w = response.getWriter();

		String oper = request.getParameter("oper");

		if (oper != null) {
			log.debug("General Data Servlet - Operation " + oper);
		}
		else {
			log.debug("General Data Servlet - NULL Operation parameter");
		}
		
		try {
			/*
			 * GET
			 */
			if ("get".equalsIgnoreCase(oper)) {

				String object = request.getParameter("object");
				log.debug("Object: " + object.toString());

				if ("alertTypes".equalsIgnoreCase(object)) {
					
					/*
					 * Available for everyone
					 */
					AlertService as = new AlertService();
					List<AlertType> alertTypes = as.getAlertTypes();
					
					GeoportalResponse gpr = new GeoportalResponse();
					gpr.setSuccess(true);
					gpr.setResult(alertTypes);
					jsonRes = new Gson().toJson(gpr);
					
					ServletUtils.writeAndFlush(log, w, jsonRes);
				}
				else {
					log.debug("Passed object is invalid");
					throw new DataInvalidException();	
				}
				
			} else {
				log.debug("Passed oper is invalid");
				throw new DataInvalidException();
			}

		} catch (DataInvalidException de) {
			log.debug("Data invalid exception", de);
			jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("MISSING_PARAMETERS"));
			ServletUtils.writeAndFlush(log, w, jsonRes);
		} catch (Exception x) {
			log.debug("Generic exception", x);
			jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("GENERIC_ERROR"));
			log.debug("Alert Servlet - GENERIC_ERROR");
			ServletUtils.writeAndFlush(log, w, jsonRes);
		}
	}

}
