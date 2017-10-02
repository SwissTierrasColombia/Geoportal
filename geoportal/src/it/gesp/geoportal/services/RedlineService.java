package it.gesp.geoportal.services;

import it.gesp.geoportal.dao.GeometryType;
import it.gesp.geoportal.dao.RedlineTypes;
import it.gesp.geoportal.dao.SessionFactoryManager;
import it.gesp.geoportal.dao.dto.RedliningDTO;
import it.gesp.geoportal.dao.entities.User;
import it.gesp.geoportal.dao.repositories.RedliningRepository;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.hibernate.Transaction;

public class RedlineService {
	private static final Logger log = Logger.getLogger(RedlineService.class);
	/**
	 * Gets all the redlines for the given user
	 * 
	 * @param user
	 * @return
	 */
	public List<RedliningDTO> getRedlinings(User user, String redlineType) throws Exception {
		Session session = null;
		log.debug("getRedlinings");
		try {
			session = SessionFactoryManager.openSession();
			RedliningRepository rr = new RedliningRepository();

			List<RedliningDTO> redLines = new ArrayList<RedliningDTO>();

			redLines.addAll(rr.getRedliningsByGeometryType(session, user,
					GeometryType.POINT, redlineType));

			/*
			 * Redlines can be of any geom type. Comments are of point type
			 * only.
			 */
			if (RedlineTypes.REDLINE.equals(redlineType)) {

				redLines.addAll(rr.getRedliningsByGeometryType(session, user,
						GeometryType.LINE, redlineType));
				redLines.addAll(rr.getRedliningsByGeometryType(session, user,
						GeometryType.POLYGON, redlineType));
			}

			return redLines;

		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}

	/**
	 * Saves all the redlines on the database.
	 * 
	 * @param user
	 * @param redlines
	 */
	public void saveAllRedlinings(User user, List<RedliningDTO> redlines,
			String redlineType) throws Exception {
		Session session = null;
		log.debug("saveAllRedlinings");
		try {
			session = SessionFactoryManager.openSession();
			RedliningRepository rr = new RedliningRepository();
			Transaction tx = session.beginTransaction();
			try {

				// Delete all
				rr.removeUserRedlinings(session, user, GeometryType.POINT,
						redlineType);

				/*
				 * Redlines can be of any geom type. Comments are of point type
				 * only.
				 */
				if (RedlineTypes.REDLINE.equals(redlineType)) {
					rr.removeUserRedlinings(session, user, GeometryType.LINE,
							redlineType);
					rr.removeUserRedlinings(session, user,
							GeometryType.POLYGON, redlineType);
				}

				// Add all
				for (RedliningDTO redline : redlines) {
					rr.addRedlining(session, user, redline, redlineType);
				}
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
}
