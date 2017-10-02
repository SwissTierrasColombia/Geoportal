package it.gesp.geoportal.dao.repositories;

import it.gesp.geoportal.PaginationResult;
import it.gesp.geoportal.dao.GeometryType;
import it.gesp.geoportal.dao.SessionFactoryManager;
import it.gesp.geoportal.dao.dto.AlertSITDTO;
import it.gesp.geoportal.dao.dto.VWAlertSITRead;
import it.gesp.geoportal.dao.entities.Alert;
import it.gesp.geoportal.dao.entities.AlertStatus;
import it.gesp.geoportal.dao.entities.AlertType;
import it.gesp.geoportal.dao.entities.User;
import it.gesp.geoportal.dao.entities.VWAlert;
import it.gesp.geoportal.dao.repositories.base.BaseRepository;
import it.gesp.geoportal.exceptions.DataInvalidException;

import java.io.Serializable;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.criterion.CriteriaSpecification;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.hibernate.criterion.SimpleExpression;
import org.hibernate.transform.Transformers;

public class AlertRepository extends BaseRepository<Alert> {

	private static final String TABLE_ALERT_GEOM_POINT = SessionFactoryManager.SCHEMA_NAME + "." + "alert_geom_point";
	private static final String TABLE_ALERT_GEOM_LINE = SessionFactoryManager.SCHEMA_NAME + "." + "alert_geom_line";
	private static final String TABLE_ALERT_GEOM_POLYGON = SessionFactoryManager.SCHEMA_NAME + "." + "alert_geom_polygon";
	private static final String ALERT_STATUS_HISTORY_TABLE = SessionFactoryManager.SCHEMA_NAME + "." + "alert_status_history";

	private static final String TABLE_ALERT_GEOM_SEQUENCE = SessionFactoryManager.SCHEMA_NAME + "." + "alert_geoms";
	
	public static final String EPSG_DEFAULT_ALERTS = "4326";
	
	private String getGeomAlertTableName(String geometryType) {
		
		/*
		 * Check if geometry type is supported.
		 */
		if (!GeometryType.checkGeometryType(geometryType)) {
			throw new DataInvalidException("Geometry type not correct");
		}
		
		if (GeometryType.POINT.equals(geometryType)) {
			return TABLE_ALERT_GEOM_POINT;
		}
//		if (GeometryType.LINE.equals(geometryType)) {
//			return TABLE_ALERT_GEOM_LINE;
//		}
//		if (GeometryType.POLYGON.equals(geometryType)) {
//			return TABLE_ALERT_GEOM_POLYGON;
//		}
		return null;
	}

//	private String createPostgisTransformGeometryCommand(String geom, String destEpsg) {
//		String wktGeometryInsert = "ST_Transform(" + geom + ", "
//				+ destEpsg + ")";
//		return wktGeometryInsert;
//	}
	
	private String createPostgisGeometryFromTextCommand(String wktGeometry, String epsg) {
		String wktGeometryInsert = "ST_GeomFromText('" + wktGeometry + "', "
				+ epsg + ")";
		return wktGeometryInsert;
	}

	@SuppressWarnings("unchecked")
	public List<VWAlert> getAlerts(Session session, User user) {
//		try {

			int userId = user.getIdUser();
			List<VWAlert> alerts = null;
			
//			if (EPSG_DEFAULT_ALERTS.equals(destEpsg)) {
				//No need to reproject
				Criteria criteria = session.createCriteria(VWAlert.class);
				//criteria.add(Restrictions.eq("idUser", userId));
				alerts = criteria.list();
//			} 
//			else {
//				//Reprojection
//				alerts = session
//						.createSQLQuery(
//								"select A.id_alert, A.id_user, A.title, A.description, A.id_alert_type, "
//								+ "A.type_name, A.insert_time, A.geometry_type, "
//								+ "A.c_status_curr, A.status_curr_name, "
//								+ "ST_asText(ST_Transform(ST_GeomFromText(A.wkt_geometry, :sourceEpsg), :destEpsg)) AS wkt_geometry "
//								+ "from vw_alerts A where id_user = :idUser")
//						.addEntity(VWAlert.class)
//						.setParameter("sourceEpsg", EPSG_DEFAULT_ALERTS)
//						.setParameter("destEpsg", destEpsg)
//						.setParameter("idUser", userId)
//						.list();
//			}
			
			return alerts;

//		} catch (Exception x) {
//			// Log
//			throw x;
//		}
	}

	public VWAlert getAlertByReferenceCode(Session session, String referenceCode) {
		Criteria criteria = session.createCriteria(VWAlert.class);
		SimpleExpression expression = Restrictions.eq("referenceCode", referenceCode);
		criteria.add(expression);
		VWAlert alert = (VWAlert)criteria.uniqueResult();
		
		return alert;
	}
	
	public List<VWAlert> getAllAlerts(Session session) {
		List<VWAlert> alerts = null;
		alerts = this.getAll(session, VWAlert.class);
		return alerts;
	}
	
	/*
	 * @see getAlertsWithinWKTGeometry in AlertIntesectionRepository
	 */
	public List<AlertSITDTO> getAlertsForSITMunicipal(Session session) {
		Query geomQuery = session.createSQLQuery("select A.id_alert, id_alert_type, type_name, title, description, submitter_name, "
				+ "submitter_email, insert_time, c_status_curr, dep_name, dep_cod, inserted_by_muni_name, inserted_by_muni_cod, "
				+ "from_sit_muni, status_curr_name, "
				+ "date_event, phone_num, mobile_num, wkt_geometry "
				+ "from geoportal.vw_alerts_sit_read AS A ")
				.setResultTransformer( Transformers.aliasToBean(VWAlertSITRead.class));
				
		List<VWAlertSITRead> res = geomQuery.list();
		List<AlertSITDTO> alertSITList = AlertRepository.buildAlertSITDTOFromHibernateQuery(res);
		return alertSITList;
	}
	
	public PaginationResult<VWAlert> getPaginatedAlerts(Session session,
			User user, int from, int size, String orderCol, String sortDir, Integer idAlertFilter) {
//		try {

			int userId = user.getIdUser();

			Criteria criteria = session.createCriteria(VWAlert.class);
			
			//If there is a filter on the idAlert, add it.
			if (idAlertFilter != null) {
				criteria.add(Restrictions.eq("idAlert", idAlertFilter));
			}

			//SimpleExpression expression = Restrictions.eq("idUser", userId);
			
			// Do count
			long totalCount = (Long) criteria
					//.add(expression)
					.setProjection(Projections.rowCount()).uniqueResult();

			// Reset criteria
			criteria.setProjection(null);
			criteria.setResultTransformer(CriteriaSpecification.DISTINCT_ROOT_ENTITY);

			if (orderCol == null || orderCol.equals("")) {
				orderCol = "idAlert";
			}

			// Do query
			//criteria.add(expression);
			if ("desc".equalsIgnoreCase(sortDir)) {
				criteria.addOrder(Order.desc(orderCol));
			} else {
				criteria.addOrder(Order.asc(orderCol));
			}

			// Size
			criteria.setFirstResult(from);
			criteria.setMaxResults(size);

			List<VWAlert> alerts = criteria.list();
			
			
			PaginationResult<VWAlert> pr = new PaginationResult<VWAlert>();
			pr.setData(alerts);
			pr.setTotalSize(totalCount);

			return pr;

//		} catch (Exception x) {
//			// Log
//			throw x;
//		}
	}

	public void updateAlert(Session session, Alert dbAlert, Alert newAlert,
			String newWktGeometry) {

		//Submitter Name
		dbAlert.setSubmitterName(newAlert.getSubmitterName());
		
		dbAlert.setEventDate(newAlert.getEventDate());
		
		// Alert type
		dbAlert.setAlertType(newAlert.getAlertType());

		// Title
		//dbAlert.setTitle(newAlert.getTitle());

		//Dep
		dbAlert.setDepartmentCod(newAlert.getDepartmentCod());
		dbAlert.setDepartmentName(newAlert.getDepartmentName());
		
		//Muni - not updatable!
		// Description
		dbAlert.setDescription(newAlert.getDescription());

		//Submitter Email
		dbAlert.setSubmitterEmail(newAlert.getSubmitterEmail());
			
		//Phones
		dbAlert.setPhoneNum(newAlert.getPhoneNum());
		dbAlert.setMobileNum(newAlert.getMobileNum());
			
		// Geometry type
		boolean geomTypeChanged = false;
		if (!dbAlert.getGeometryType().equals(newAlert.getGeometryType())) {
			geomTypeChanged = true;
		}

		if (geomTypeChanged) {
			// Delete previous record from geometry table
			deleteGeometry(session, dbAlert.getGeometryId(), dbAlert.getGeometryType());

			// Add new record
			long geomId = addGeometry(session, newAlert.getGeometryType(), newWktGeometry);

			// Change references to geometry id...
			dbAlert.setGeometryId(geomId);
			
			//Set the new geometry type on alert table
			dbAlert.setGeometryType(newAlert.getGeometryType());
			
		} else {
			// Update geometry record
			updatedGeometry(session, dbAlert.getGeometryId(),
					dbAlert.getGeometryType(), newWktGeometry);
		}
		
		//Update alert
		session.update(dbAlert);
	}

	private void deleteGeometry(Session session, long idGeom,
			String geometryType) {
		boolean geometryOk = GeometryType.checkGeometryType(geometryType);

		if (!geometryOk) {
			throw new DataInvalidException("Geometry type not correct");
		}

		String alertGeomTableName = getGeomAlertTableName(geometryType);

		Query geomQuery = session.createSQLQuery(
				"delete from " + alertGeomTableName
						+ " where id_geom = :idGeom").setParameter("idGeom",
				idGeom);
		geomQuery.executeUpdate();
	}

	private long getNextValForGeometries(Session session) {
		Query seqQuery = session.createSQLQuery("select nextval(' "
				+ TABLE_ALERT_GEOM_SEQUENCE + " ')");
		BigInteger bi = (BigInteger) seqQuery.list().get(0);
		return bi.longValue();
	}

	private long addGeometry(Session session, String geometryType,
			String wktGeometryInsert) {
		String alertGeomTableName = getGeomAlertTableName(geometryType);

		long idGeom = getNextValForGeometries(session);

		Query geomQuery = session.createSQLQuery(
				"insert into " + alertGeomTableName
						+ " (id_geom, the_geom) VALUES (:idGeom, "
						+ createPostgisGeometryFromTextCommand(wktGeometryInsert, EPSG_DEFAULT_ALERTS) + ")").setParameter("idGeom",
				idGeom);
		geomQuery.executeUpdate();
		return idGeom;
	}

	private void updatedGeometry(Session session, long idGeom,
			String geometryType, String newWktGeometry) {
		String alertGeomTableName = getGeomAlertTableName(geometryType);

		Query geomQuery = session.createSQLQuery(
				"update " + alertGeomTableName + " set the_geom = "
						+ createPostgisGeometryFromTextCommand(newWktGeometry, EPSG_DEFAULT_ALERTS) + " where id_geom = :idGeom")
				.setParameter("idGeom", idGeom);
		geomQuery.executeUpdate();
	}

	public void addAlert(Session session, Alert alert, String wktGeometry) {

//		try {

			boolean geometryOk = GeometryType.checkGeometryType(alert
					.getGeometryType());
			if (!geometryOk) {
				throw new DataInvalidException("Geometry type not correct");
			}

//			//Check if transformation needed
//			if (!EPSG_DEFAULT_ALERTS.equals(destEpsg)) {
//				wktGeometryInsert = createPostgisTransformGeometryCommand(wktGeometryInsert, destEpsg);
//			}
			
			/*
			 * Add geometry
			 */
			long geomId = addGeometry(session, alert.getGeometryType(), wktGeometry);
			alert.setGeometryId(geomId);

			/*
			 * Add time
			 */
			alert.setInsertTime(new Date());

			/*
			 * Add data
			 */
			session.save(alert);
			
//		} catch (Exception x) {
//			// Log
//			throw x;
//		}
	}

	public void deleteAlert(Session session, int alertId, String geometryType) {
//		try {
			String alertGeomTableName = getGeomAlertTableName(geometryType);

			/*
			 * Delete geometry
			 */
			Query qGeom = session.createSQLQuery(
					"delete from " + alertGeomTableName
							+ " where id_alert = :alertId").setParameter(
					"alertId", alertId);
			qGeom.executeUpdate();

			/*
			 * Delete data
			 */
//			Query qData = session.createSQLQuery(
//					"delete from alerts where id_alert = :alertId")
//					.setParameter("alertId", alertId);
//			qData.executeUpdate();
			
			//Alternate delete
			Alert al = (Alert)this.loadByIdGeneral(session, Alert.class, alertId);
			session.delete(al);
			

//		} catch (Exception x) {
//			// Log
//			throw x;
//		}
	}

	public List<AlertType> getAlertTypes(Session session) throws Exception {
		try {
			session = SessionFactoryManager.openSession();
			Criteria criteria = session.createCriteria(AlertType.class);

			List<AlertType> types = criteria.list();

			/*
			 * vedi
			 * https://docs.jboss.org/hibernate/orm/3.3/reference/en/html/querysql
			 * .html
			 * 
			 * 
			 * List<AlertType> types2 = null; SQLQuery query =
			 * session.createSQLQuery(
			 * "select id_alert_type, name from alert_types ALTY JOIN localization LOC ON ALTY.key = LOC.key WHERE LOC.lang = :localeLang"
			 * ); query.addEntity(AlertType.class);
			 * query.setParameter("localeLang", "en"); types2 = query.list();
			 */

			return types;

		} catch (Exception x) {
			throw x;
		} finally {
			session.close();
		}
	}

	public AlertType getAlertTypeById(Session session, int id) {
		return (AlertType) session.load(AlertType.class, (Serializable) id);
	}

	public AlertStatus getAlertStatusByCode(Session session, String statusCode) {
		return (AlertStatus) session.load(AlertStatus.class,
				(Serializable) statusCode);
	}
	
	public void addAlertStatusHistory(Session session, AlertStatus as, Alert alert, String note) {
		Query geomQuery = session.createSQLQuery("insert into " + ALERT_STATUS_HISTORY_TABLE 
						+ " (id_alert, c_status, date_change, note) VALUES (:idAlert, :codStatus, :dateChange, :note)")
						.setParameter("idAlert", alert.getIdAlert())
						.setParameter("codStatus", as.getStatusCode())
						.setParameter("dateChange", new Date())
						.setParameter("note", note);
		
		geomQuery.executeUpdate();
	}
	
	static List<AlertSITDTO> buildAlertSITDTOFromHibernateQuery(List<VWAlertSITRead> data) {
		List<AlertSITDTO> res = new ArrayList<AlertSITDTO>();
		
		for(VWAlertSITRead row : data) {
			AlertSITDTO alert = new AlertSITDTO();
			
			alert.setReferenceCode(row.getReference_code());
			alert.setIdAlert(row.getId_alert());
			alert.setAlertTypeId(row.getId_alert_type());
			alert.setAlertTypeName(row.getType_name());
			alert.setDescription(row.getDescription());
			alert.setSubmitterName(row.getSubmitter_name());
			alert.setSubmitterEmail(row.getSubmitter_email());
			
			alert.setInsertTimeStrFromDate(row.getInsert_time());
			//alert.setInsertTime(row.getInsert_time());
			
			alert.setCurrentStatusCode(row.getC_status_curr());
			alert.setDepartmentName(row.getDep_name());
			alert.setDepartmentCod(row.getDep_cod());
			alert.setInsertedByMuniName(row.getInserted_by_muni_name());
			alert.setInsertedByMuniCod(row.getInserted_by_muni_name());
			alert.setFromSITMuni(row.getFrom_sit_muni());
			alert.setCurrentStatusName(row.getStatus_curr_name());
			alert.setWktGeometry(row.getWkt_geometry());
			
			//alert.setEventDate(row.getDate_event());
			alert.setEventDateStrFromDate(row.getDate_event());
			alert.setPhoneNum(row.getPhone_num());
			alert.setMobileNum(row.getMobile_num());
			
			alert.setEpsg("EPSG:" + EPSG_DEFAULT_ALERTS);
			
			res.add(alert);
		}
		
		return res;
	}
}
