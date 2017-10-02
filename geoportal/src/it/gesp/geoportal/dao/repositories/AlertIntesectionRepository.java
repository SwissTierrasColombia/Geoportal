package it.gesp.geoportal.dao.repositories;

import it.gesp.geoportal.constants.AlertIntersections;
import it.gesp.geoportal.dao.dto.AlertSITDTO;
import it.gesp.geoportal.dao.dto.VWAlertSITRead;
import it.gesp.geoportal.dao.entities.AlertIntersection;
import it.gesp.geoportal.dao.repositories.base.BaseRepository;

import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;

@SuppressWarnings("rawtypes")
public class AlertIntesectionRepository extends BaseRepository {

	private static final Logger log = Logger.getLogger(AlertIntesectionRepository.class);
	
	public AlertIntersection getDepartmentsIntersection(Session session) {
		Query query = session.createQuery("select a from AlertIntersection a where name = :name");
		query.setParameter("name", AlertIntersections.ALERTS_DEPARTMENTS_INTERSECTION);
		List res = query.list();
		
		AlertIntersection ai = null;
		if (res.size() > 0) {
			ai = (AlertIntersection)res.get(0);	
		}
		  
		return ai;
	}
	
	public AlertIntersection getMunicipalitiesIntersection(Session session) {
		Query query = session.createQuery("select a from AlertIntersection a where name = :name");
		query.setParameter("name", AlertIntersections.ALERTS_MUNICIPALITIES_INTERSECTION);
		List res = query.list();
		
		AlertIntersection ai = null;
		if (res.size() > 0) {
			ai = (AlertIntersection)res.get(0);	
		}
		  
		return ai;
	}
	
	
	/*
	 * @See getAlertsForSITMunicipal in AlertRepository
	 */
	public List<AlertSITDTO> getAlertsWithinWKTGeometry(Session session, String municipalityWKT, int codEpsg) {
		Query geomQuery = session.createSQLQuery("select A.id_alert, id_alert_type, type_name, title, description, submitter_name, "
				+ "submitter_email, insert_time, c_status_curr, dep_name, dep_cod, inserted_by_muni_name, inserted_by_muni_cod, "
				+ "from_sit_muni, status_curr_name, "
				+ "date_event, phone_num, mobile_num, wkt_geometry, reference_code "
				+ "from geoportal.vw_alerts_sit_read AS A where ST_Intersects(A.st_geomfromtext, ST_GeomFromText(:wkt, :codEpsg)) ")
				.setParameter("wkt",municipalityWKT)
				.setParameter("codEpsg", codEpsg)
				.setResultTransformer( Transformers.aliasToBean(VWAlertSITRead.class));
				
		List<VWAlertSITRead> res = geomQuery.list();
		
		List<AlertSITDTO> alertList = AlertRepository.buildAlertSITDTOFromHibernateQuery(res);
		return alertList;
	}
	
}
