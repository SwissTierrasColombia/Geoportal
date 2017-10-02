package it.gesp.geoportal.services;

import static ch.lambdaj.Lambda.on;
import static ch.lambdaj.collection.LambdaCollections.with;
import it.gesp.geoportal.PaginationResult;
import it.gesp.geoportal.constants.AlertIntersections;
import it.gesp.geoportal.constants.AlertSettings;
import it.gesp.geoportal.constants.Permissions;
import it.gesp.geoportal.dao.AlertStatusCodeTypes;
import it.gesp.geoportal.dao.SessionFactoryManager;
import it.gesp.geoportal.dao.dto.AlertConfigurationDTO;
import it.gesp.geoportal.dao.dto.AlertCoordinatesDTO;
import it.gesp.geoportal.dao.dto.AlertDTO;
import it.gesp.geoportal.dao.dto.AlertIntersectionDTO;
import it.gesp.geoportal.dao.dto.AlertSITDTO;
import it.gesp.geoportal.dao.dto.AlertTypeDTO;
import it.gesp.geoportal.dao.entities.Alert;
import it.gesp.geoportal.dao.entities.AlertIntersection;
import it.gesp.geoportal.dao.entities.AlertSetting;
import it.gesp.geoportal.dao.entities.AlertStatus;
import it.gesp.geoportal.dao.entities.AlertType;
import it.gesp.geoportal.dao.entities.DepartmentPermissionMapping;
import it.gesp.geoportal.dao.entities.Layer;
import it.gesp.geoportal.dao.entities.User;
import it.gesp.geoportal.dao.entities.VWAlert;
import it.gesp.geoportal.dao.repositories.AlertIntesectionRepository;
import it.gesp.geoportal.dao.repositories.AlertRepository;
import it.gesp.geoportal.dao.repositories.AlertSettingsRepository;
import it.gesp.geoportal.dao.repositories.DepartmentPermissionMappingRepository;
import it.gesp.geoportal.dao.repositories.LayerRepository;
import it.gesp.geoportal.exceptions.DataInvalidException;
import it.gesp.geoportal.exceptions.OperationInvalidException;
import it.gesp.geoportal.exceptions.PermissionInvalidException;
import it.gesp.geoportal.utils.Utils;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.RandomStringUtils;
import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.Transaction;

public class AlertService {
	
	private static final Logger log = Logger.getLogger(AlertService.class);
	
	public List<AlertSITDTO> getAlertsInMunicipality(String municipalityKey) throws Exception {
		Session session = null;
		log.debug("Get alert in municipality " + municipalityKey);
		try {
			session = SessionFactoryManager.openSession();
			List<AlertSITDTO> alertList = null;

			AlertIntersection muniIntConfig = new AlertIntesectionRepository().getMunicipalitiesIntersection(session);
			
			log.debug("Checking if intersection with municipalities is active...");
			
			if (muniIntConfig.isActive()) {
				
				log.debug("Intersection with municipalities IS active.");
				
				String wkt = new WFSIntersectionService().getMunicipalityWKTGeometry(session, municipalityKey);
				alertList = new AlertIntesectionRepository().getAlertsWithinWKTGeometry(session, wkt, Integer.parseInt(AlertRepository.EPSG_DEFAULT_ALERTS));
			}
			else {
				
				log.debug("Intersection with municipalities IS NOT active. Returning all data!.");
				
				alertList = new AlertRepository().getAlertsForSITMunicipal(session);
			}
			
			return alertList;

		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	
	public List<AlertType> getAlertTypes() throws Exception {
		Session session = null;
		log.debug("Get alert types");
		try {
			session = SessionFactoryManager.openSession();
			AlertRepository rr = new AlertRepository();

			List<AlertType> types = rr.getAlertTypes(session);

			return types;

		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}

	public VWAlert getAlertByReferenceCode(String referenceCode) throws Exception {
		Session session = null;
		log.debug("Get alerts by reference code");
		try {
			session = SessionFactoryManager.openSession();
			AlertRepository rr = new AlertRepository();
			
			VWAlert alert = rr.getAlertByReferenceCode(session, referenceCode);
			
			if (alert == null) {
				throw OperationInvalidException.createAlertReferenceCodeExeption(referenceCode);
			}
			
			return alert;

		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	public void addAlertType(String alertTypeName) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			
			Transaction tx = session.beginTransaction();
			try {
				
				/*Verify that there is no alerttype with the same name*/
				String hql = "select count(*) from AlertType at"
						+ " where at.name = (:name)";

				Query query = session.createQuery(hql);
				query.setParameter("name", alertTypeName);
				Object res = query.uniqueResult();
				
				if ((Long)res > 0) {
					throw new OperationInvalidException("EXC_ALERT_TYPE_NAME_ALREADY_USED", "There is already an Alert Type with the same name.");
				}
				
				AlertType newAlertType = new AlertType();
				newAlertType.setName(alertTypeName);
				
				session.save(newAlertType);
				
				tx.commit();
				
			} catch (Exception x) {
				//log.debug(x);
				tx.rollback();
				throw x;
			}
			

		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	public void deleteAlertType(int alertTypeId) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			
			Transaction tx = session.beginTransaction();
			try {
				
				AlertRepository ar = new AlertRepository();
				
				/*
				 * Verify that the alertType exists
				 */
				AlertType existingAlertType = ar.getAlertTypeById(session, alertTypeId);
				if (existingAlertType == null) {
					throw OperationInvalidException.createMissingIdExeption("AlertType", alertTypeId);
				}
				
				
				/*Verify that there are no alerts using this AlertType*/
				String hql = "select count(*) from Alert a"
						+ " where a.alertType.idAlertType = (:alertTypeId)";

				Query query = session.createQuery(hql);
				query.setParameter("alertTypeId", alertTypeId);
				Object res = query.uniqueResult();
				
				if ((Long)res > 0) {
					throw new OperationInvalidException("EXC_ALERT_TYPE_DELETE_ERROR_ALERTS_ASSOCIATED", "The Alert Type cannot be deleted. There are {0} alerts using this Alert Type.", "" + (Long)res);
				}
				
				//Ok, can delete it!
				session.delete(existingAlertType);
				
				tx.commit();
				
			} catch (Exception x) {
				//log.debug(x);
				tx.rollback();
				throw x;
			}

		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	public void updateAlertType(AlertTypeDTO alertTypeDTO) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			
			Transaction tx = session.beginTransaction();
			try {
				
				AlertRepository ar = new AlertRepository();
				
				/*
				 * Verify that the alertType exists
				 */
				AlertType existingAlertType = ar.getAlertTypeById(session, alertTypeDTO.getIdAlertType());
				if (existingAlertType == null) {
					throw OperationInvalidException.createMissingIdExeption("AlertType", alertTypeDTO.getIdAlertType());
				}
				
				/*
				 * Verify that there are no other alert type using the same name
				 */
				String hql = "select count(*) from AlertType at"
						+ " where at.name = (:alertTypeName) "
						+ " and at.idAlertType <> (:alertTypeId)";
				

				Query query = session.createQuery(hql);
				query.setParameter("alertTypeName", alertTypeDTO.getName());
				query.setParameter("alertTypeId", alertTypeDTO.getIdAlertType());
				Object res = query.uniqueResult();
				
				if ((Long)res > 0) {
					throw new OperationInvalidException("EXC_ALERT_TYPE_NAME_ALREADY_USED", "There is already an Alert Type with the same name.");
				}
				
				existingAlertType.setName(alertTypeDTO.getName());
				
				//Ok, can update it!
				session.update(existingAlertType);
				
				tx.commit();
				
			} catch (Exception x) {
				//log.debug(x);
				tx.rollback();
				throw x;
			}
		
		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	
	}
//	public void saveAndUpdateAlertTypes(List<AlertTypeDTO> alertTypeDTOList) {
//		Session session = null;
//		try {
//			session = SessionFactoryManager.openSession();
//			
//			Transaction tx = session.beginTransaction();
//			try {
//				AlertRepository ar = new AlertRepository();
//				
//				//Cancellare quelli non specificati...
//				
//				//Rinominare quelli che hanno lo stesso id...
//				
//				//Aggiungere quelli che non hanno id...
//				
//				for (AlertTypeDTO alertTypeDTO : alertTypeDTOList) {
//					
//					if (alertTypeDTO.getAlertTypeId() != null) {
//						
//						AlertType existingAlert = ar.getAlertTypeById(session, alertTypeDTO.getAlertTypeId());
//						
//						if (existingAlert == null) {
//							throw OperationInvalidException.createMissingIdExeption("AlertType", alertTypeDTO.getAlertTypeId());
//						}
//						
//						//Rinominare quelli che hanno lo stesso id...
//						existingAlert.setName(alertTypeDTO.getName());
//						
//						session.update(existingAlert);
//					}
//					else {
//						//Aggiungere quelli che non hanno id...
//						AlertType newAlertType = new AlertType();
//						newAlertType.setName(alertTypeDTO.getName());
//					}
//				}
//				
//				//Missing...
//				//Cancellare quelli non specificati...
//				
//				tx.commit();
//				
//			} catch (Exception x) {
//				//log.debug(x);
//				tx.rollback();
//				throw x;
//			}
//			
//
//		} catch (Exception x) {
//			log.debug(x);
//			throw x;
//		} finally {
//			session.close();
//		}
//	}
	
	private boolean checkIsOk(AlertIntersectionDTO data) {
		boolean res = true;
		
		if (data.getActive() == true) {
			if (data.getDescColumnName() == null || data.getGeomColumnName() == null || data.getGeomColumnName() == null|| data.getKeyColumnName() == null || data.getLayerId() == null) 
				res = false;
		}
		
		return res;
	}
	
	public AlertIntersectionDTO getAlertDepartmentsIntersection() throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			return getAlertDepartmentsIntersection(session);

		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}	
	}
	
	public AlertIntersectionDTO getAlertDepartmentsIntersection(Session session) throws Exception {
		/*
		 * Departments
		 */
		AlertIntersection depAi = new AlertIntesectionRepository().getDepartmentsIntersection(session);
		AlertIntersectionDTO departmentAlertIntersectionDTO = null;
		if (depAi != null) {
			departmentAlertIntersectionDTO = AlertIntersectionDTO.parseFromAlertIntersection(depAi);
		} else {
			departmentAlertIntersectionDTO = new AlertIntersectionDTO();
		}

		return departmentAlertIntersectionDTO;
	}
	
	
	
	@SuppressWarnings("unchecked")
	public void saveAlertIntersections(Map<String, AlertIntersectionDTO> intersectionDTOMap) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			LayerRepository lr = new LayerRepository();
			AlertIntesectionRepository air = new AlertIntesectionRepository();
			
			Transaction tx = session.beginTransaction();
			try {
				AlertIntersectionDTO departmentIntersection = intersectionDTOMap.get("department");
				AlertIntersectionDTO municipalityIntersection = intersectionDTOMap.get("municipality");
				
				/*
				 * Fetch the AlertIntersections
				 */
				AlertIntersection existingDepartmentAlertIntersection = air.getDepartmentsIntersection(session);
				AlertIntersection existingMuniciAlertIntersection = air.getMunicipalitiesIntersection(session);
				
				if (existingDepartmentAlertIntersection == null) {
					throw OperationInvalidException.createMissingKeyExeption("AlertIntersection", AlertIntersections.ALERTS_DEPARTMENTS_INTERSECTION);
				}
				
				if (existingMuniciAlertIntersection == null) {
					throw OperationInvalidException.createMissingKeyExeption("AlertIntersection", AlertIntersections.ALERTS_MUNICIPALITIES_INTERSECTION);
				}
				
				Layer existingDepartmentLayer = null;
				Layer existingMunicipalityLayer = null;
				
				if (departmentIntersection.getLayerId() != null) {
					existingDepartmentLayer = lr.getById(session, Layer.class, departmentIntersection.getLayerId());
					
					if (existingDepartmentLayer == null) {
						throw OperationInvalidException.createMissingIdExeption("Layer", departmentIntersection.getLayerId());
					}
				
					/*
					 * If type is not WMS --> error
					 */
					if (!existingDepartmentLayer.getLayerType().getTypeName().equals("wms") ) {
						throw new OperationInvalidException("LAYER IS NOT A WMS!! ERROR");
					}
					
					/*
					 * It is not a Commercial Layer
					 */
					if (existingDepartmentLayer.getLayerSource() == null) {
						throw new OperationInvalidException("LAYER IS A COMMERCIAL LAYER!!! ERROR");
					}
				}
				
				//Municipality Layer
				if(municipalityIntersection.getLayerId() != null) {
					existingMunicipalityLayer = lr.getById(session, Layer.class, municipalityIntersection.getLayerId());
					
					if (existingMunicipalityLayer == null) {
						throw OperationInvalidException.createMissingIdExeption("Layer", municipalityIntersection.getLayerId());
					}
					
					/*
					 * If type is not WMS --> error
					 */
					if (!existingMunicipalityLayer.getLayerType().getTypeName().equals("wms") ) {
						throw new OperationInvalidException("LAYER IS NOT A WMS!! ERROR");
					}
					
					/*
					 * It is not a Commercial Layer
					 */
					if (existingMunicipalityLayer.getLayerSource() == null) {
						throw new OperationInvalidException("LAYER IS A COMMERCIAL LAYER!!! ERROR");
					}
				}
				
				if (departmentIntersection.getActive() == true && departmentIntersection.getLayerId() == null) {
					throw new OperationInvalidException("EXC_ALERTS_INTERSECTION_SAVE_DEPARTMENT_MISSING_REFLAYER", "Reference Layer for departments is missing");
				}
				
				if (municipalityIntersection.getActive() == true && municipalityIntersection.getLayerId() == null) {
					throw new OperationInvalidException("EXC_ALERTS_INTERSECTION_SAVE_MUNICIPALITY_MISSING_REFLAYER", "Reference Layer for departments is missing");
				}
				
				if (!checkIsOk(departmentIntersection)) {
					throw new OperationInvalidException("EXC_ALERTS_INTERSECTION_ACTIVE_CONTROL", "Active control");
				}
				
				if (!checkIsOk(municipalityIntersection)) {
					throw new OperationInvalidException("EXC_ALERTS_INTERSECTION_ACTIVE_CONTROL", "Active control");
				}
				
				existingDepartmentAlertIntersection.setDescColumnName(departmentIntersection.getDescColumnName());
				existingDepartmentAlertIntersection.setGeomColumnName(departmentIntersection.getGeomColumnName());
				existingDepartmentAlertIntersection.setKeyColumnName(departmentIntersection.getKeyColumnName());
				existingDepartmentAlertIntersection.setActive(departmentIntersection.getActive());
				existingDepartmentAlertIntersection.setReferenceLayer(existingDepartmentLayer);
				
				
				existingMuniciAlertIntersection.setDescColumnName(municipalityIntersection.getDescColumnName());
				existingMuniciAlertIntersection.setGeomColumnName(municipalityIntersection.getGeomColumnName());
				existingMuniciAlertIntersection.setKeyColumnName(municipalityIntersection.getKeyColumnName());
				existingMuniciAlertIntersection.setActive(municipalityIntersection.getActive());
				existingMuniciAlertIntersection.setReferenceLayer(existingMunicipalityLayer);
				
				//Save them
				air.update(session, existingDepartmentAlertIntersection);
				air.update(session, existingMuniciAlertIntersection);
				
				tx.commit();
				
			} catch (Exception x) {
				//log.debug(x);
				tx.rollback();
				throw x;
			}
		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}		
	}

	public boolean checkIfAlertIntersectUserDepartments(Session session, User user, AlertIntersectionDTO depIntersection, List<AlertCoordinatesDTO> alertCoordinates) throws Exception {
		List<String> columnValues = getDepartmentCodesPermissionForUser(session, user);
		
		//There are no permission on departments for the user.
		if (columnValues.size() < 1 ) {
			return false;
		}
		
		//Do intersection on Departments
		//AlertIntersectionDTO depIntersection = getAlertDepartmentsIntersection(session);	

		int num = new WFSIntersectionService().checkIfAlertIntersectsLayer(alertCoordinates, depIntersection.getLayerUrl(), depIntersection.getLayerName(), depIntersection.getKeyColumnName(), columnValues);
		if (num > 0) return true;
		return false;
	}
	
	public boolean checkIfUserCanEditAlerts(User user, List<AlertCoordinatesDTO> alertCoordinates) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			log.debug("checkIfUserCanEditAlerts");
			
			log.debug("Check if departments intersection is active.");
			AlertIntersectionDTO depIntersection = getAlertDepartmentsIntersection(session);
			if (depIntersection.getActive() == true) {
				log.debug("Departments intersection IS active... check if user can edit alerts...");
				return checkIfAlertIntersectUserDepartments(session, user, depIntersection, alertCoordinates);
			}
			else {
				log.debug("Departments intersection are NOT active.");
				return true;
			}
			
		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	public boolean checkIfAlertIntersectUserDepartments(User user, AlertIntersectionDTO depIntersection, List<AlertCoordinatesDTO> alertCoordinates) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			return checkIfAlertIntersectUserDepartments(session, user, depIntersection, alertCoordinates);
		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	private boolean checkIfAlertIsWithinDepartment(Session session, AlertCoordinatesDTO alertCoordinates, String depKey) throws Exception{

		log.debug("checkIfAlertIsWithinDepartment");
		//Do intersection on Departments
		AlertIntersectionDTO depIntersection = getAlertDepartmentsIntersection(session);
		
		log.debug("Checking if the intersection with the departments is active...");
		if (depIntersection.getActive() == true) {
			log.debug("Intersection with departments IS active");
			
			List<String> columnValues = new ArrayList<String>();
			columnValues.add(depKey);
			
			List<AlertCoordinatesDTO> coords = new ArrayList<AlertCoordinatesDTO>();
			coords.add(alertCoordinates);
			
			int num = new WFSIntersectionService().checkIfAlertIntersectsLayer(coords, depIntersection.getLayerUrl(), depIntersection.getLayerName(), depIntersection.getKeyColumnName(), columnValues);
			
			if (num > 0) return true;
			return false;
		}
		else {
			log.debug("Intersection with departments IS NOT active");
			return true;
		}
	}
	
	
	public List<String> getDepartmentCodesPermissionForUser(Session session, User user) throws Exception {
		
		//Get all permissions
		List<String> permissionCodList = user.getPermissionCodList();
		
		List<DepartmentPermissionMapping> departmentMappings = new DepartmentPermissionMappingRepository().getDepartmentPermissionMappingsFromPermissionList(session, permissionCodList);
		
		//Extract departmentCodes
		List<String> codDepartments = with(departmentMappings).extract((on(DepartmentPermissionMapping.class).getIdentifValue()));
		
		return codDepartments;
	}
	
	
	public Map getAlertIntersections(boolean includeLayerList) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			
			/*
			 * Departments
			 */
			AlertIntersection depAi = new AlertIntesectionRepository().getDepartmentsIntersection(session);
			AlertIntersectionDTO departmentAlertIntersectionDTO = null;
			if (depAi != null) {
				departmentAlertIntersectionDTO = AlertIntersectionDTO.parseFromAlertIntersection(depAi);
			} else {
				departmentAlertIntersectionDTO = new AlertIntersectionDTO();
			}
			
			/*
			 * Municipalities
			 */
			AlertIntersection munAi = new AlertIntesectionRepository().getMunicipalitiesIntersection(session);
			AlertIntersectionDTO municipalityAlertIntersectionDTO = null;
			if (munAi != null) {
				municipalityAlertIntersectionDTO = AlertIntersectionDTO.parseFromAlertIntersection(munAi);
			} else {
				municipalityAlertIntersectionDTO = new AlertIntersectionDTO();
			}
			
			Map<String, Object> returnMap = new HashMap<String, Object>();
			
			returnMap.put("department", departmentAlertIntersectionDTO);
			returnMap.put("municipality", municipalityAlertIntersectionDTO);
			
			if (includeLayerList) {
				/*
				 * Get reference layer(s)
				 */
				LayerRepository lr = new LayerRepository();
				
				//Exclude commercial layers
				List<Layer> layers = lr.getLayers(session, true);
				
				returnMap.put("layerList", layers);
			}
			
			return returnMap;

		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	public AlertConfigurationDTO getAlertConfigurationDTO(int mapId) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			
			/*
			 * Get reference layer(s)
			 */
			LayerRepository lr = new LayerRepository();
			
			List<Layer> layers = lr.getAssociatedLayers(session, mapId, true);
			Layer referenceLayerForAlert = lr.getReferenceLayerForAlerts(session, mapId);
			
			AlertConfigurationDTO conf = new AlertConfigurationDTO();
			conf.setLayerList(layers);
			if (referenceLayerForAlert != null) {
				conf.setReferenceLayerId(referenceLayerForAlert.getIdLayer());
			}
			
			/*
			 * Get message
			 */
			AlertSetting as = new AlertSettingsRepository().getAlertSettingByKey(session, AlertSettings.ALERTS_ADDED_NOTE_MESSAGE);
			conf.setAlertAddedMessage(as.getConfigValue());
			
			return conf;

		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	public void saveAlertsSettings(int mapId, AlertConfigurationDTO alertConfigurationDTO) throws Exception {
		Session session = null;
		log.debug("saveAlertsSettings");
		try {
			session = SessionFactoryManager.openSession();
			LayerRepository lr = new LayerRepository();
			Transaction tx = session.beginTransaction();
			try {
				//Set reference layer...
				lr.setReferenceLayerForAlert(session, mapId, alertConfigurationDTO.getReferenceLayerId());
				
				//Save message
				new AlertSettingsRepository().updateAlertSetting(session, AlertSettings.ALERTS_ADDED_NOTE_MESSAGE, alertConfigurationDTO.getAlertAddedMessage());
				
				tx.commit();

			} catch (Exception x) {
				log.debug(x);
				tx.rollback();
				throw x;
			}
		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	public List<VWAlert> getAllAlerts() throws Exception {
		Session session = null;
		log.debug("Get all alerts");
		try {
			session = SessionFactoryManager.openSession();
			AlertRepository rr = new AlertRepository();

			return rr.getAllAlerts(session);

		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	public List<VWAlert> getAlerts(User user) throws Exception {
		Session session = null;
		log.debug("Get alerts");
		try {
			session = SessionFactoryManager.openSession();
			AlertRepository rr = new AlertRepository();

			return rr.getAlerts(session, user);

		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	/**
	 * Gets all the alerts for the given user
	 * 
	 * @param user
	 * @return
	 */
	public PaginationResult<VWAlert> getPaginatedAlerts(User user, int from,
			int size, String orderCol, String sortDir, Integer idAlertFilter) throws Exception{
		Session session = null;
		log.debug("Get getPaginatedAlerts");
		try {
			session = SessionFactoryManager.openSession();
			AlertRepository rr = new AlertRepository();

			return rr.getPaginatedAlerts(session, user, from, size, orderCol, sortDir, idAlertFilter);

		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}

	public void deleteAlert(User user, int alertId, String geometryType) throws Exception {
		Session session = null;
		log.debug("Get getPaginatedAlerts");
		try {
			session = SessionFactoryManager.openSession();
			AlertRepository ar = new AlertRepository();
			Transaction tx = session.beginTransaction();
			try {
				VWAlert alertDb = (VWAlert) ar.getByIdGeneral(session, VWAlert.class, alertId);
				if (alertDb == null) {
					throw new OperationInvalidException("EXC_ALERT_NOT_EXISTS", "The specified alert does not exist");
				}

				if (alertDb.getIdUser() != alertId) {
					throw new OperationInvalidException("EXC_ALERT_DOES_NOT_BELONG_TO_USER", "The specifies alert does not belong to the user.");
				}

				ar.deleteAlert(session, alertId, geometryType);
				tx.commit();

			} catch (Exception x) {
				log.debug(x);
				tx.rollback();
				throw x;
			}
		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}

	private Alert createAlertFromDTO(Session session, AlertDTO alertDTO) {
		AlertRepository ar = new AlertRepository();
		Alert a = new Alert();

		// Alert type
		AlertType at = ar.getAlertTypeById(session, alertDTO.getAlertTypeId());
		a.setAlertType(at);
		
		// Alert Status
		AlertStatus as = ar.getAlertStatusByCode(session, alertDTO.getAlertStatusCode());
		a.setCurrentStatus(as);

		//Description
		a.setDescription(alertDTO.getDescription());
		
		//Title
		a.setTitle(alertDTO.getTitle());

		//Submitter name
		a.setSubmitterName(alertDTO.getSubmitterName());
		
		//Submitter email
		a.setSubmitterEmail(alertDTO.getSubmitterEmail());
		
		//Geometry type
		a.setGeometryType(alertDTO.getGeometryType());
		
		a.setDepartmentName(alertDTO.getDepartmentName());
		a.setDepartmentCod(alertDTO.getDepartmentCod());
		a.setInsertedByMuniCod(alertDTO.getInsertedByMuniCod());
		a.setInsertedByMuniName(alertDTO.getInsertedByMuniName());
		a.setFromSITMuni(alertDTO.isFromSITMuni());
		
		a.setEventDate(alertDTO.getEventDate());
		a.setPhoneNum(alertDTO.getPhoneNum());
		a.setMobileNum(alertDTO.getMobileNum());
		
		return a;
	}
	
	public String addAlertFromSITMunicipal(User user, AlertDTO alertDTO) throws Exception {
		Session session = null;
		log.debug("addAlertFromSITMunicipal");
		try {
			session = SessionFactoryManager.openSession();
			Transaction tx = session.beginTransaction();
			
			try {
				
				//Fetch the Department Name
				String depName = new WFSIntersectionService().getDepartmentDescriptionFromKey(session, alertDTO.getDepartmentCod());
				alertDTO.setDepartmentName(depName);
				
				String referenceCode = addAlertFromDTO(session, user, alertDTO);
				tx.commit();
				return referenceCode;
				
			} catch (Exception x) {
				log.debug(x);
				tx.rollback();
				throw x;
			}
		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	
	public String addAlertFromDTO(User optionalUser, AlertDTO alertDTO) throws Exception {
		Session session = null;
		log.debug("addAlertFromDTO");
		try {
			session = SessionFactoryManager.openSession();
			Transaction tx = session.beginTransaction();
			
			try {
				
				String referenceCode = addAlertFromDTO(session, optionalUser, alertDTO);
				tx.commit();
				return referenceCode;
				
			} catch (Exception x) {
				//log.debug(x);
				tx.rollback();
				throw x;
			}
		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	public String addAlertFromDTO(Session session, User optionalUser, AlertDTO alertDTO) throws Exception {
		
		AlertRepository ar = new AlertRepository();
		
		/*
		 * Test if the alert falls inside the correct Department
		 */
		boolean isWithinDepartment = checkIfAlertIsWithinDepartment(session, new AlertCoordinatesDTO(pointXFromGeom(alertDTO.getWktGeometry()), 
				pointYFromGeom(alertDTO.getWktGeometry())), alertDTO.getDepartmentCod());
		
		if (!isWithinDepartment) {
			throw new OperationInvalidException("EXC_ALERTS_INTERSECTION_ALERT_NOT_WITHIN_DEPARTMENT", "El reporte de incidencia no està ubicado dentro del Departamento seleccionado", alertDTO.getDepartmentCod());
		}
		
		/*
		 * Add alert status code
		 */
		alertDTO.setAlertStatusCode(AlertStatusCodeTypes.Inserted);
		
		
		Alert alert = createAlertFromDTO(session, alertDTO);
		
		String referenceCode = generateReferenceCodeForAlert(alert);
		alert.setReferenceCode(referenceCode);
		
		//Attach alert to the user
		alert.setUser(optionalUser);

		String wktGeometry = alertDTO.getWktGeometry();
		
		// Check the data
		if (!checkFieldsForAddAlert(alert, wktGeometry)) {
			throw new DataInvalidException();
		}

		ar.addAlert(session, alert, wktGeometry);
		return referenceCode;
	}

	private String pointXFromGeom(String wktPointGeometry) {
		wktPointGeometry = wktPointGeometry.trim();
		
		int idx = wktPointGeometry.indexOf("POINT(");
		String sub = wktPointGeometry.substring(idx + 6 , wktPointGeometry.length());
		
		int idx2 = sub.indexOf(" ");
		String xCoord = sub.substring(0, idx2+1);
		return xCoord.trim();
	}
	
	private String pointYFromGeom(String wktPointGeometry) {
		wktPointGeometry = wktPointGeometry.trim();
		 
		int idx = wktPointGeometry.indexOf("POINT(");
		String sub = wktPointGeometry.substring(idx + 6, wktPointGeometry.length());
		
		int idx2 = sub.indexOf(" ");
		String yCoord = sub.substring(idx2 + 1, sub.length() - 1);
		return yCoord.trim();
	}
	
	public void updateAlertFromDTO(User user, AlertDTO alertDTO) throws Exception {
		Session session = null;
		log.debug("updateAlertFromDTO");
		try {
			session = SessionFactoryManager.openSession();
			AlertRepository ar = new AlertRepository();
			Transaction tx = session.beginTransaction();
			
			try {
				/*
				 * Get Alert from database
				 */
				Alert dbAlert = (Alert) ar.getByIdGeneral(session, Alert.class, alertDTO.getIdAlert());
				if (dbAlert == null) {
					//log
					throw new DataInvalidException();
				}
				
				VWAlert dbVWAlert = (VWAlert) ar.getByIdGeneral(session, VWAlert.class, alertDTO.getIdAlert());
				if (dbVWAlert == null) {
					//log
					throw new DataInvalidException();
				}
				
				/*
				 * Test if the user has the permission for its department...
				 * We test on the original data, not the new ones.
				 */
				log.debug("Check if the intersection with departments is active...");
				
				AlertIntersectionDTO depIntersection = getAlertDepartmentsIntersection(session);
				if (depIntersection.getActive() == true) {
					log.debug("Intersection with departments IS active.");
					
					AlertCoordinatesDTO acDTO = new AlertCoordinatesDTO(pointXFromGeom(dbVWAlert.getWktGeometry()), pointYFromGeom(dbVWAlert.getWktGeometry()));
					List<AlertCoordinatesDTO> alertCoordinates = new ArrayList<AlertCoordinatesDTO>();
					alertCoordinates.add(acDTO);
					
					boolean res = this.checkIfAlertIntersectUserDepartments(session, user, depIntersection, alertCoordinates);
					
					if (!res) {
						throw new PermissionInvalidException();
					}
					
				} else {
					log.debug("Intersection with departments IS NOT active...");
				}
				
				
				// If the alert status is not specified, we use the same of the saved alert.
				if (Utils.isNullOrEmpty(alertDTO.getAlertStatusCode())) {
					alertDTO.setAlertStatusCode(dbAlert.getCurrentStatus().getStatusCode());
				}
				
				Alert requestAlert = createAlertFromDTO(session, alertDTO); 
				String wktGeometry = alertDTO.getWktGeometry();
				
				ar.updateAlert(session, dbAlert, requestAlert, wktGeometry);
				
				//commit
				tx.commit();
				log.debug("Commit done");
				
			} catch (Exception x) {
				log.debug(x);
				tx.rollback();
				throw x;
			}
			
		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	public void changeAlertStatus(User user, List<Integer> alertIdList, String newStatusCode, String note) throws Exception {
		/*
		 * Check that the user has a permission to perform the status change...
		 */
		log.debug("changeAlertStatus");
		//Approve
		if (AlertStatusCodeTypes.Approved.equals(newStatusCode)) {
			if (!LoginService.hasPermission(user, Permissions.ALERTS_CHANGE_STATUS)) {
				throw new PermissionInvalidException();
			}
		//Reject
		} else if (AlertStatusCodeTypes.Rejected.equals(newStatusCode)) {
			if (!LoginService.hasPermission(user, Permissions.ALERTS_CHANGE_STATUS)) {
				throw new PermissionInvalidException();
			}
		}
//		//Archived
//		else if (AlertStatusCodeTypes.Archived.equals(newStatusCode)) {
//			if (!LoginService.hasPermission(user, Permissions.ALERTS_CHANGE_STATUS)) {
//				throw new PermissionInvalidException();
//			}
//		}
		
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			AlertRepository ar = new AlertRepository();
			Transaction tx = session.beginTransaction();
			
			try {
				/*
				 * Get alert status as specified
				 */
				AlertStatus newAlertStatus = ar.getAlertStatusByCode(session, newStatusCode);
				
				/*
				 * Get Alerts from database (and check that they exist)
				 */
				List<Alert> alerts =  ar.getAll(session, Alert.class, "idAlert", alertIdList);
				if (alerts == null || alerts.size() == 0) {
					throw new DataInvalidException();
				}
		
				/*
				 * Update alerts
				 */
				AlertIntersectionDTO depIntersection = getAlertDepartmentsIntersection(session);
				
				boolean intersectionWithDepartmentsActive = false;
				log.debug("Checking if the intersection with the departments is active...");
				
				if (depIntersection.getActive() == true) {
					log.debug("Intersection with the departments IS active");
					intersectionWithDepartmentsActive = true;
					
				}
				else {
					log.debug("Intersection with the departments IS NOT active");
				}
				
				
				for (Alert a : alerts) {
					
					/*
					 * Test if the user has the permission for its department...
					 */
					VWAlert vwAlert = (VWAlert)ar.getByIdGeneral(session, VWAlert.class, a.getIdAlert());
					
					AlertCoordinatesDTO acDTO = new AlertCoordinatesDTO(pointXFromGeom(vwAlert.getWktGeometry()), pointYFromGeom(vwAlert.getWktGeometry()));
					List<AlertCoordinatesDTO> alertCoordinates = new ArrayList<AlertCoordinatesDTO>();
					alertCoordinates.add(acDTO);
					
					if (intersectionWithDepartmentsActive) {
						boolean res = this.checkIfAlertIntersectUserDepartments(session, user, depIntersection, alertCoordinates);
						
						if (!res) {
							throw new PermissionInvalidException();
						}
					}
					
					//Save old status into history...
					//a.getHistoryAlertStatus().add(a.getCurrentStatus());
					ar.addAlertStatusHistory(session, a.getCurrentStatus(), a, note);
					
					//update new status & time
					a.setCurrentStatus(newAlertStatus);
					a.setInsertTime(new Date());
					ar.update(session, a);
				}
				
				//commit
				tx.commit();
				log.debug("commit done");
				
			} catch (Exception x) {
				log.debug(x);
				tx.rollback();
				throw x;
			}
			
		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	

	private boolean checkFieldsForAddAlert(Alert alert, String wktGeometry) {
		log.debug("checkFieldsForAddAlert");
		
		// title
//		if (Utils.isNullOrEmpty(alert.getTitle()))
//			return false;

		// idType
		if (alert.getAlertType() == null)
			return false;

		// geometry type
		if (Utils.isNullOrEmpty(alert.getGeometryType()))
			return false;
		
		// geometry
		if (Utils.isNullOrEmpty(wktGeometry))
			return false;

		return true;
	}
	
	public void setEpsg(List<VWAlert> list, String epsg) {
		for(VWAlert a : list) {
			setEpsg(a, epsg);
		}
	}
	
	public void setEpsg(VWAlert alert, String epsg) {
		alert.setEpsg("EPSG:" + epsg);
	}
	
	
	private String generateReferenceCodeForAlert(Alert alert) {
		
		String alphab = RandomStringUtils.randomAlphabetic(4);
		String alphan = RandomStringUtils.randomAlphanumeric(3);
		
		String refCode = alphab + alphan;
		
		return refCode;
	}
}
