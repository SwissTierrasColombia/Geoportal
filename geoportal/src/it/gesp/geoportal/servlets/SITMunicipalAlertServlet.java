package it.gesp.geoportal.servlets;

import it.gesp.geoportal.constants.Constants;
import it.gesp.geoportal.dao.dto.AlertDTO;
import it.gesp.geoportal.dao.dto.AlertSITDTO;
import it.gesp.geoportal.dao.entities.AlertType;
import it.gesp.geoportal.dao.entities.User;
import it.gesp.geoportal.exceptions.DataInvalidException;
import it.gesp.geoportal.exceptions.OperationInvalidException;
import it.gesp.geoportal.exceptions.PermissionInvalidException;
import it.gesp.geoportal.locale.LocaleUtils;
import it.gesp.geoportal.services.AlertService;
import it.gesp.geoportal.services.LogService;
import it.gesp.geoportal.services.LoginService;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.MessageFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;

import com.google.gson.Gson;

public class SITMunicipalAlertServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private static final Logger log = Logger.getLogger(SITMunicipalAlertServlet.class);
	
	private ResourceBundle dbMessages = LocaleUtils.getDBMessages();

	public SITMunicipalAlertServlet() {
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
		
		User currentUser = LoginService.getLoggedInUserFromSession(currentSession);
		
		//it.gesp.geoportal.dao.entities.Map currentMap = new MapService().getMapByName("icf_map");
		//int idMap = currentMap.getIdMap();
		
		AlertService alertService = new AlertService();
		PrintWriter w = response.getWriter();
		String jsonRes = null;

		String oper = request.getParameter("oper");
		if (oper != null) {
			log.debug("Alert Servlet - Operation " + oper);
		}
		else {
			log.debug("Alert Servlet - NULL Operation parameter");
		}
		
		/*
		 * Check that the user is connected.
		 * The only allowed operation for anonimous users (aka not logged) are
		 * - insertAnonimous
		 * - getGeomByReferenceCode
		 */
		if (currentUser == null) {
			
			log.debug("Current user is null.");
			jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_NOT_LOGGED_IN"));
			ServletUtils.writeAndFlush(log, w, jsonRes);
			return;
		}
		
		try {
			
			// Check that the user has the permission
//			if (!LoginService.hasPermission(currentUser, Permissions.ALERTS_WS_MUNI_SIT)) {
//				jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
//				ServletUtils.writeAndFlush(log, w, jsonRes);
//				return;
//			}
			
			/*
			 * Get alert types
			 */
			if ("alertTypes".equalsIgnoreCase(oper)) {
				
				
				AlertService as = new AlertService();
				List<AlertType> alertTypes = as.getAlertTypes();

				jsonRes = GeoportalResponse.createSuccessResponse(alertTypes, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			
			/*
			 * INSERT FROM SIT MUNICIPAL
			 */
			else if ("insert".equalsIgnoreCase(oper)) {

				// Response
				GeoportalResponse gpr = new GeoportalResponse();
				
				String featureString = (String) request.getParameter("data");
				AlertSITDTO alertSITDTORequest = null;

				// Parse alert
				try {
					alertSITDTORequest = new Gson().fromJson(featureString, AlertSITDTO.class);
					
					/*
					 * Alert has been added by the SIT Municipal
					 */
					alertSITDTORequest.setFromSITMuni(true);

				} catch (Exception x) {
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("NO_DATA_SPECIFIED"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}

				//Test if all fields are OK
				checkRequiredFieldsAlertSitMunicipal(alertSITDTORequest);
				
				try {

					String alertReferenceCode = alertService.addAlertFromSITMunicipal(currentUser, alertSITDTORequest.getAsAlertDTO());

//					LogService.writeLog(currentUser,
//							dbMessages.getString("ALERTS_CONTEXT"),
//							dbMessages.getString("ALERTS_SAVE_OPERATION"),
//							dbMessages.getString("ALERTS_SAVED_DESC"));

					gpr.setSuccess(true);
					Map<String, String> data = new HashMap<String, String>();
					data.put("referenceCode", alertReferenceCode);
					
					gpr.setResult(data);
					jsonRes = new Gson().toJson(gpr);

					log.debug("Alert saved. Response " + jsonRes);

					w.write(jsonRes);
					w.flush();

				} catch (DataInvalidException x) {
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("MISSING_PARAMETERS"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					log.debug("Data invalid exception", x);
				} catch (Exception x) {
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("ERROR_SAVING_DATA"));
					log.debug("Generic exception", x);
					ServletUtils.writeAndFlush(log, w, jsonRes);
				}
			}
//			else if ("getAllAlerts".equalsIgnoreCase(oper)) {
//				
//				List<VWAlert> alerts = alertService.getAllAlerts();
//				jsonRes = GeoportalResponse.createSuccessResponseWithSerializationOfNulls(alerts, true);
//				ServletUtils.writeAndFlush(log, w, jsonRes);
//			}
			
			else if ("getAlertsForMunicipality".equalsIgnoreCase(oper)) {
				String municipalityCod = request.getParameter(("cod_muni"));
				
				if (municipalityCod == null || "".equals(municipalityCod.trim())) {
					log.debug("Error parsing imageFormat parameter");
					throw new DataInvalidException();
				}
				//es 901
				
				List<AlertSITDTO> alertList = alertService.getAlertsInMunicipality(municipalityCod);
				jsonRes = GeoportalResponse.createSuccessResponseWithSerializationOfNulls(alertList, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			
//			else if ("test".equals(oper)) {
//				new HttpCallService().prova();
//			}
			else {
				log.debug("SIT Mumicipal Alert Servlet: Wrong OPER param");
				throw new DataInvalidException();
			}

		} catch (DataInvalidException de) {
			if (de.getMessage() != null) {jsonRes = GeoportalResponse.createErrorResponse(de.getMessage());
			} else {
				jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("MISSING_PARAMETERS"));
			}
			ServletUtils.writeAndFlush(log, w, jsonRes);

		} catch (PermissionInvalidException pei) {
			log.debug("Permission invalid exception", pei);
			jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
			ServletUtils.writeAndFlush(log, w, jsonRes);
		} catch (OperationInvalidException oie) {
			try {
				String realMess = MessageFormat.format(userMessages.getString(oie.getExceptionCode()), (Object[])oie.getArgs());
				log.debug("OperationInvalidException", oie);
				jsonRes = GeoportalResponse.createErrorResponse(realMess, oie.getExceptionCode(), oie.getDetailException());
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
	
	
	private void checkRequiredFieldsAlertSitMunicipal(AlertSITDTO alertDTO) {
		
		//Municipality
		if (alertDTO.getInsertedByMuniCod() == null) throw new DataInvalidException("Missing municipality code");
		
		//In theory could desume directly with WFS call...
		if (alertDTO.getInsertedByMuniName() == null) throw new DataInvalidException("Missing municipality name");
		
		//Department (in theory Could desume directly with WFS call --- ??)
		if (alertDTO.getDepartmentCod() == null) throw new DataInvalidException("Missing department code");
		
		//Automcatically gets the name from the WFS.
		//if (alertDTO.getDepartmentName() == null) throw new DataInvalidException("Missing department name");
		
		//Alert description
		if (alertDTO.getDescription() == null) throw new DataInvalidException("Missing description");
		
		//Event date
		if (alertDTO.getEventDateStr() == null) throw new DataInvalidException("Missing eventDateStr");
		
		//Try to Parse date
		try {
			new SimpleDateFormat(Constants.DEFAULT_DATE_FORMAT).parse(alertDTO.getEventDateStr());
		} catch (ParseException exc) {
			throw new DataInvalidException("eventDateStr must be expressed in dd-MM-yyyy format");
		}
		
		//Contact info
		if (alertDTO.getSubmitterName() == null) throw new DataInvalidException("Missing submitter name");
		if (alertDTO.getSubmitterEmail() == null) throw new DataInvalidException("Missing submitter email");
		if (alertDTO.getMobileNum() == null) throw new DataInvalidException("Missing mobile phone num");
		if (alertDTO.getPhoneNum() == null) throw new DataInvalidException("Missing fixed phone num");
		
		//Geometry
		if (alertDTO.getWktGeometry() == null) throw new DataInvalidException("Missing WKT Geometry");
	}

}
