package it.gesp.geoportal.servlets;

import it.gesp.geoportal.PaginationObject;
import it.gesp.geoportal.PaginationRequest;
import it.gesp.geoportal.PaginationResult;
import it.gesp.geoportal.constants.Permissions;
import it.gesp.geoportal.dao.dto.AlertConfigurationDTO;
import it.gesp.geoportal.dao.dto.AlertCoordinatesDTO;
import it.gesp.geoportal.dao.dto.AlertDTO;
import it.gesp.geoportal.dao.dto.AlertIntersectionDTO;
import it.gesp.geoportal.dao.dto.AlertTypeDTO;
import it.gesp.geoportal.dao.entities.User;
import it.gesp.geoportal.dao.entities.VWAlert;
import it.gesp.geoportal.dao.repositories.AlertRepository;
import it.gesp.geoportal.exceptions.DataInvalidException;
import it.gesp.geoportal.exceptions.OperationInvalidException;
import it.gesp.geoportal.exceptions.PermissionInvalidException;
import it.gesp.geoportal.json.JsonFactory;
import it.gesp.geoportal.locale.LocaleUtils;
import it.gesp.geoportal.services.AlertService;
import it.gesp.geoportal.services.LoginService;
import it.gesp.geoportal.services.MapService;
import it.gesp.geoportal.utils.Utils;

import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.Type;
import java.text.MessageFormat;
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
import com.google.gson.reflect.TypeToken;

public class AlertServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private static final Logger log = Logger.getLogger(AlertServlet.class);
	
	private ResourceBundle dbMessages = LocaleUtils.getDBMessages();

	public AlertServlet() {
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
		
		it.gesp.geoportal.dao.entities.Map currentMap = new MapService().getMapByName("icf_map");
		int idMap = currentMap.getIdMap();
		
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
		if (currentUser == null && 
				(!"insert".equals(oper) && !"getGeomByReferenceCode".equals(oper) && !"getAlertAddedMessage".equals(oper) && !"getAlertsIntersectionConfigurationForUser".equals(oper)) 
			) {
			
			log.debug("Current user is null.");
			jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_NOT_LOGGED_IN"));
			ServletUtils.writeAndFlush(log, w, jsonRes);
			return;
		}
		
		try {
			
			/*
			 * ADMINISTRATION
			 */
			if ("getAlertConfiguration".equalsIgnoreCase(oper)) {
				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser, Permissions.ALERTS_CONFIG_ADMIN)) {
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				
				AlertConfigurationDTO conf = new AlertService().getAlertConfigurationDTO(idMap);
								
				jsonRes = GeoportalResponse.createSuccessResponseWithSerializationOfNulls(conf, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			
			else if ("saveAlertConfiguration".equalsIgnoreCase(oper)) {
				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser, Permissions.ALERTS_CONFIG_ADMIN)) {
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				
				String referenceLayerIdStr = request.getParameter("referenceLayerId");
				Integer referenceLayerId = null;
				if (!Utils.isNullOrEmpty(referenceLayerIdStr)) {
					try {
						referenceLayerId = Integer.parseInt(referenceLayerIdStr);
					} catch (Exception x) {
						log.debug("Error parsing referenceLayerIdStr parameter");
						throw new DataInvalidException();
					}	
				}
				
				String alertAddedMessage = request.getParameter("alertAddedMessage");
				
				AlertConfigurationDTO dto = new AlertConfigurationDTO();
				dto.setReferenceLayerId(referenceLayerId);
				dto.setAlertAddedMessage(alertAddedMessage);
				
				new AlertService().saveAlertsSettings(idMap,dto);
				
				//Save..
				//new LayerService().setReferenceLayerForAlert(idMap, referenceLayerId);
				
				jsonRes = GeoportalResponse.createSuccessResponse(null, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
				
			}
			
			else if ("getAlertsIntersectionConfigurationForUser".equalsIgnoreCase(oper)) {
				
				Map returnMap = new AlertService().getAlertIntersections(false);
				jsonRes = GeoportalResponse.createSuccessResponseWithSerializationOfNulls(returnMap, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			
			else if ("getAlertIntersectionConfiguration".equalsIgnoreCase(oper)) {
				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser, Permissions.ALERTS_CONFIG_ADMIN)) {
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				Map returnMap = new AlertService().getAlertIntersections(true);
				
				jsonRes = GeoportalResponse.createSuccessResponseWithSerializationOfNulls(returnMap, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			
			else if ("saveAlertIntersectionConfiguration".equalsIgnoreCase(oper)) {
				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser, Permissions.ALERTS_CONFIG_ADMIN)) {
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				
				String dataJson = request.getParameter("data");
				
				Map<String, AlertIntersectionDTO> intersectionDTOMap = null;
				
				try {
					Type collectionType = new TypeToken<Map<String, AlertIntersectionDTO>>() {
					}.getType();
					intersectionDTOMap = new Gson().fromJson(dataJson, collectionType);
					
				} catch (Exception x) {
					// Error parsing the featureList
					String errorJson = GeoportalResponse.createErrorResponse(userMessages.getString("NO_FEATURELIST_SPECIFIED"));
					ServletUtils.writeAndFlush(log, w, errorJson);
					return;
				}

				new AlertService().saveAlertIntersections(intersectionDTOMap);
				
				jsonRes = GeoportalResponse.createSuccessResponse(null, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			
			
//			else if ("referenceLayerList".equalsIgnoreCase(oper)) {
//				/*
//				 * Check whether the current user has the appropriate permission
//				 */
//				if (!LoginService.hasPermission(currentUser, Permissions.ALERTS_CONFIG_ADMIN)) {
//					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
//					ServletUtils.writeAndFlush(log, w, jsonRes);
//					return;
//				}
//				
//				AlertConfigurationDTO conf = new LayerService().getAlertConfigurationDTO(idMap);
//				
//				jsonRes = GeoportalResponse.createSuccessResponseWithSerializationOfNulls(conf, true);
//				ServletUtils.writeAndFlush(log, w, jsonRes);
//				
//			}
//			
//			else if ("saveReferenceLayer".equalsIgnoreCase(oper)) {
//				/*
//				 * Check whether the current user has the appropriate permission
//				 */
//				if (!LoginService.hasPermission(currentUser, Permissions.ALERTS_CONFIG_ADMIN)) {
//					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
//					ServletUtils.writeAndFlush(log, w, jsonRes);
//					return;
//				}
//				
//				String referenceLayerIdStr = request.getParameter("referenceLayerId");
//				Integer referenceLayerId = null;
//				if (!Utils.isNullOrEmpty(referenceLayerIdStr)) {
//					try {
//						referenceLayerId = Integer.parseInt(referenceLayerIdStr);
//					} catch (Exception x) {
//						log.debug("Error parsing referenceLayerIdStr parameter");
//						throw new DataInvalidException();
//					}	
//				}
//				
//				//Save..
//				new LayerService().setReferenceLayerForAlert(idMap, referenceLayerId);
//				
//				jsonRes = GeoportalResponse.createSuccessResponse(null, true);
//				ServletUtils.writeAndFlush(log, w, jsonRes);
//				
//			}
			
			else if ("getAlertAddedMessage".equalsIgnoreCase(oper)) {
				
				AlertConfigurationDTO conf = new AlertService().getAlertConfigurationDTO(idMap);
								
				jsonRes = GeoportalResponse.createSuccessResponseWithSerializationOfNulls(conf.getAlertAddedMessage(), true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			
			else if ("addAlertType".equalsIgnoreCase(oper)) {
				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser, Permissions.ALERTS_CONFIG_ADMIN)) {
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				
				String alertTypeName = request.getParameter("name");
				if (Utils.isNullOrEmpty(alertTypeName)) {
					log.debug("Error parsing name parameter");
					throw new DataInvalidException();
				}
				
				
				alertService.addAlertType(alertTypeName);
				
				jsonRes = GeoportalResponse.createSuccessResponse(null, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			
			else if ("updateAlertType".equalsIgnoreCase(oper)) {
				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser, Permissions.ALERTS_CONFIG_ADMIN)) {
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				
				String alertTypeJson = request.getParameter("alertType");
				if (Utils.isNullOrEmpty(alertTypeJson)) {
					log.debug("Error parsing alertType parameter");
					throw new DataInvalidException();
				}
				
				Gson gson = JsonFactory.getGson();
				
				AlertTypeDTO alertTypeDTO = new Gson().fromJson(alertTypeJson, AlertTypeDTO.class);
				
				alertService.updateAlertType(alertTypeDTO);
				
				jsonRes = GeoportalResponse.createSuccessResponse(null, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			
			else if ("deleteAlertType".equalsIgnoreCase(oper)) {
				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser, Permissions.ALERTS_CONFIG_ADMIN)) {
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				
				//alertTypeId
				int idAlertType = -1;
				try {
					String idAlertTypeStr = request.getParameter("idAlertType");
					idAlertType = Integer.parseInt(idAlertTypeStr);
				} catch (Exception x) {
					log.debug("Error parsing idAlertType parameter");
					throw new DataInvalidException();
				}
				
				alertService.deleteAlertType(idAlertType);
				
				jsonRes = GeoportalResponse.createSuccessResponse(null, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}

			/*
			 * CHECK IF USER CAN EDIT ALERT
			 */
			else if ("checkIfUserCanEdit".equals(oper)) {
				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser, Permissions.ALERTS_UPDATE)) {
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				
				//Get departments of the user based on permission list
				//String layerName = "m1102va001970_hn";

				//String x = request.getParameter("alert_x");
				//String y = request.getParameter("alert_y");
				String alertCoordsString = request.getParameter("alertCoords");
				
				if (alertCoordsString == null) {
					throw new DataInvalidException("Missing point coordinates");
				}
				
				// Parse alertCoords
				List<AlertCoordinatesDTO> alertCoordinates = null;
				try {
					
					Type collectionType = new TypeToken<List<AlertCoordinatesDTO>>() {}.getType();
					alertCoordinates = new Gson().fromJson(alertCoordsString,collectionType);
				} catch (Exception x) {
					log.debug("Error parsing alertCoords parameter", x);
					throw new DataInvalidException();
				}
				
				
				//x = "-87.15339691987192";
				//y = "15.162770568339457";
//				AlertCoordinatesDTO acDTO = new AlertCoordinatesDTO(x, y);
//				List<AlertCoordinatesDTO> alertCoordinates = new ArrayList<AlertCoordinatesDTO>();
//				alertCoordinates.add(acDTO);
				boolean res = alertService.checkIfUserCanEditAlerts(currentUser, alertCoordinates);
				
				jsonRes = GeoportalResponse.createSuccessResponse(res, true);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}
			
			/*
			 * GET
			 */
			else if ("getAll".equalsIgnoreCase(oper)) {

				PaginationResult<VWAlert> alerts = null;
				
				/*
				 * Check whether the current user has the appropriate permission
				 */
				if (!LoginService.hasPermission(currentUser, Permissions.ALERTS_READ)) {
					// User does not have the permission
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}

				//check if there is an idAlert filter
				String idAlertStr = request.getParameter("idAlert"); 
				Integer idAlert = null;
				if (!Utils.isNullOrEmpty(idAlertStr)) {
					try {
						idAlert = Integer.parseInt(idAlertStr);
					} catch (Exception x) {
						log.error("Error parsing idAlert parameter");
						throw new DataInvalidException();
					}
					log.debug("Get alert by id= " + idAlert);	
				}
				
				// Handle pagination
				PaginationRequest pagReq = new PaginationRequest(request);

				log.debug("Get paginated alerts.");
				alerts = alertService.getPaginatedAlerts(currentUser,
						pagReq.getStartFrom(), pagReq.getSize(),
						pagReq.getSortColumn(), pagReq.getSortDir(), idAlert);

				PaginationObject<VWAlert> paginationObject = PaginationObject
						.createFromPaginationResult(alerts);
				paginationObject.setDraw(pagReq.getPage());

				GeoportalResponse gpr = new GeoportalResponse();
				gpr.setSuccess(true);
				gpr.setResult(paginationObject);
				//jsonRes = new Gson().toJson(gpr);
				jsonRes = JsonFactory.getGson(true, true, false).toJson(gpr);
				log.debug("Response: " + jsonRes);
				ServletUtils.writeAndFlush(log, w, jsonRes);
			}

			else if ("getGeomByReferenceCode".equalsIgnoreCase(oper)) {
				
//				// Check that the user has the permission
//				if (!LoginService.hasPermission(currentUser, Permissions.ALERTS_READ)) {
//					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
//					ServletUtils.writeAndFlush(log, w, jsonRes);
//					return;
//				}
				
				String referenceCode = request.getParameter("referenceCode");
				if (Utils.isNullOrEmpty(referenceCode)) {
					log.debug("Error parsing referenceCode parameter");
					throw new DataInvalidException();
				} 
				
				log.debug("Get alert by referenceCode.");
				VWAlert alert = alertService.getAlertByReferenceCode(referenceCode);
				alertService.setEpsg(alert, AlertRepository.EPSG_DEFAULT_ALERTS);
				
				GeoportalResponse gpr = new GeoportalResponse();
				gpr.setSuccess(true);
				gpr.setResult(alert);
				jsonRes = new Gson().toJson(gpr);
				
				log.debug("Response: " + jsonRes);
				w.write(jsonRes);
				w.flush();
			}
			/*
			 * GET GEOMETRIES
			 */
			else if ("getGeoms".equalsIgnoreCase(oper)) {
				
				// Check that the user has the permission
				if (!LoginService.hasPermission(currentUser, Permissions.ALERTS_READ)) {
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}
				
				log.debug("Get alerts.");
				List<VWAlert> alerts = alertService.getAlerts(currentUser);
				alertService.setEpsg(alerts, AlertRepository.EPSG_DEFAULT_ALERTS);
				
				GeoportalResponse gpr = new GeoportalResponse();
				gpr.setSuccess(true);
				gpr.setResult(alerts);
				jsonRes = new Gson().toJson(gpr);
				
				log.debug("Response: " + jsonRes);
				w.write(jsonRes);
				w.flush();
			}
			
			/*
			 * SAVE (Anonymous or not...)
			 */
			else if ("insert".equalsIgnoreCase(oper)) {

				// Response
				GeoportalResponse gpr = new GeoportalResponse();
				
//				// Check that the user has the permission
//				if (!LoginService.hasPermission(currentUser, Permissions.ALERTS_INSERT)) {
//					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
//					ServletUtils.writeAndFlush(log, w, jsonRes);
//					return;
//				}
				
				String featureString = (String) request.getParameter("data");
				AlertDTO alertDTORequest = null;

				// Parse alert
				try {
					alertDTORequest = new Gson().fromJson(featureString, AlertDTO.class);
					alertDTORequest.setDateFromEventDateStr();

				} catch (Exception x) {
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("NO_DATA_SPECIFIED"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					return;
				}

				try {

					String alertReferenceCode = alertService.addAlertFromDTO(currentUser, alertDTORequest);

//					LogService.writeLog(currentUser,dbMessages.getString("ALERTS_CONTEXT"),
//							dbMessages.getString("ALERTS_SAVE_OPERATION"),
//							dbMessages.getString("ALERTS_SAVED_DESC"));

					gpr.setSuccess(true);
					Map<String, String> data = new HashMap<String, String>();
					data.put("referenceCode", alertReferenceCode);
					
					gpr.setResult(data);
					jsonRes = new Gson().toJson(gpr);

					log.debug("Feature saved. Response " + jsonRes);

					w.write(jsonRes);
					w.flush();

				} catch (DataInvalidException x) {
					jsonRes = GeoportalResponse.createErrorResponse(userMessages.getString("MISSING_PARAMETERS"));
					ServletUtils.writeAndFlush(log, w, jsonRes);
					log.debug("Data invalid exception", x);
				} 
			}

			/*
			 * UPDATE
			 */
			else if ("update".equalsIgnoreCase(oper)) {

				// Response
				GeoportalResponse gpr = new GeoportalResponse();

				// Check that the user has the permission
				if (!LoginService.hasPermission(currentUser,Permissions.ALERTS_UPDATE)) {
					throw new PermissionInvalidException(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
				}

				String featureString = (String) request.getParameter("data");
				AlertDTO alertDTORequest = null;

				// Parse alert
				try {
					alertDTORequest = new Gson().fromJson(featureString,AlertDTO.class);
					alertDTORequest.setDateFromEventDateStr();
				} catch (Exception x) {
					log.debug("Error parsing the the alert", x);
					throw new DataInvalidException();
				}

				// Update
				try {

					alertService.updateAlertFromDTO(currentUser, alertDTORequest);
					
					// Response
					gpr.setSuccess(true);
					jsonRes = new Gson().toJson(gpr);
					ServletUtils.writeAndFlush(log, w, jsonRes);

				} catch (Exception x) {
					log.debug("Error updating the alert", x);
					throw x;
				}
			/*
			 * CHANGE STATUS
			 */
			} else if ("changeStatus".equalsIgnoreCase(oper)){
				// Response
				GeoportalResponse gpr = new GeoportalResponse();
				
				// Check that the user has the permission
				if (!LoginService.hasPermission(currentUser,Permissions.ALERTS_CHANGE_STATUS)) {
					throw new PermissionInvalidException(userMessages.getString("USER_DOES_NOT_HAVE_PERMISSION"));
				}
				
				//Change status
				String newStatus = request.getParameter("status");
				String alertIdsString = request.getParameter("alertIds");
				String note = request.getParameter("note");
				
				List<Integer> alertIds = null;
				// Parse alert
				try {
					
					Type collectionType = new TypeToken<List<Integer>>() {}.getType();
					alertIds = new Gson().fromJson(alertIdsString,collectionType);
				} catch (Exception x) {
					log.debug("Error parsing the alert ids", x);
					throw new DataInvalidException();
				}
				
				try {
					alertService.changeAlertStatus(currentUser, alertIds, newStatus, note);
					
					// Response
					gpr.setSuccess(true);
					jsonRes = new Gson().toJson(gpr);
					log.debug("Alert Servlet response: UPDATE: feature saved. Response "+ jsonRes);
					ServletUtils.writeAndFlush(log, w, jsonRes);
					
				} catch (Exception x) {
					log.debug("Error in changing the alert status", x);
					throw x;
				}
				
			} else {
				log.debug("Alert Servlet Wrong OPER param");
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

}
