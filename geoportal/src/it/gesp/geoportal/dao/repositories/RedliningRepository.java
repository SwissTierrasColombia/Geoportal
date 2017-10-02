package it.gesp.geoportal.dao.repositories;

import it.gesp.geoportal.dao.GeometryType;
import it.gesp.geoportal.dao.SessionFactoryManager;
import it.gesp.geoportal.dao.dto.RedliningDTO;
import it.gesp.geoportal.dao.entities.User;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;

public class RedliningRepository {
	private static final String TABLE_REDLINING_POINT = SessionFactoryManager.SCHEMA_NAME + "." + "redlining_point";
	private static final String TABLE_REDLINING_LINE = SessionFactoryManager.SCHEMA_NAME + "." + "redlining_line";
	private static final String TABLE_REDLINING_POLYGON = SessionFactoryManager.SCHEMA_NAME + "."  + "redlining_polygon";

	private String getRedliningTableName(String geometryType) {
		if (GeometryType.POINT.equals(geometryType)) {
			return TABLE_REDLINING_POINT;
		}
		if (GeometryType.LINE.equals(geometryType)) {
			return TABLE_REDLINING_LINE;
		}
		if (GeometryType.POLYGON.equals(geometryType)) {
			return TABLE_REDLINING_POLYGON;
		}
		return null;
	}

	private String createPostgisGeometryCommand(String wktGeometry, String epsg) {
		String wktGeometryInsert = "ST_GeomFromText('" + wktGeometry + "', "
				+ epsg + ")";
		return wktGeometryInsert;
	}

	public List<RedliningDTO> getRedliningsByGeometryType(Session session,
			User user, String geometryType, String redlineType) {
//		try {

			int userId = user.getIdUser();
			String tableName = getRedliningTableName(geometryType);
			
			Query query = session.createSQLQuery(
					"select id_redlining, id_user, label, ST_AsText(the_geom) from "
							+ tableName + " where id_user = :idUser and type = :redlineType")
					.setParameter("idUser", userId)
					.setParameter("redlineType", redlineType);
			List result = query.list();

			List<RedliningDTO> redLinings = new ArrayList<RedliningDTO>();
			for (Object ob : result) {
				RedliningDTO feat = RedliningDTO.parseRedlining(ob);
				feat.setGeometryType(geometryType);
				redLinings.add(feat);
			}

			return redLinings;

//		} catch (Exception x) {
//			// Log
//			throw x;
//		}
	}

	public void addRedlining(Session session, User user, RedliningDTO redline, String redlineType) {
		int idUser = user.getIdUser();
		String tableName = getRedliningTableName(redline.getGeometryType());
		String wktGeometry = redline.getWktGeometry();

		String wktGeometryInsert = createPostgisGeometryCommand(
				wktGeometry, "4326");
		Query query = session.createSQLQuery(
				"insert into " + tableName
						+ " (id_user, type, label, the_geom) VALUES(:idUser, :redlineType, :label, "
						+ wktGeometryInsert + ")").setParameter("idUser", idUser).setParameter("redlineType", redlineType).setParameter("label", redline.getLabel());
		query.executeUpdate();
	}

	public void removeUserRedlinings(Session session, User user,
		String geometryType,  String redlineType) {

	
		int idUser = user.getIdUser();

		String tableName = getRedliningTableName(geometryType);
		
		/*
		 * Delete
		 */
		Query query = session.createSQLQuery(
				"delete from  " + tableName + " where id_user = :idUser and type = :redlineType")
				.setParameter("idUser", idUser).setParameter("redlineType", redlineType);

		query.executeUpdate();
		 
	}

	// public void updateRedlining(User user, String geometryType,
	// String wktGeometry, int idRedlining) {
	// try {
	// Session session = SessionFactoryManager.openSession();
	// Transaction tx = session.beginTransaction();
	// try {
	//
	// String tableName = getRedliningTableName(geometryType);
	//
	// int idUser = user.getIdUser();
	//
	// // Test if exists
	// RedliningDTO redlining = getRedliningById(session,
	// geometryType, idRedlining);
	// if (redlining == null) {
	// throw new RuntimeException("redline not existing");
	// }
	//
	// // Test if user is ok
	// if (1 != idUser) {
	// throw new RuntimeException("redline of a different user");
	// }
	//
	// String wktGeometryInsert = createPostgisGeometryCommand(
	// wktGeometry, "4326");
	// Query query = session.createSQLQuery(
	// "update " + tableName + " SET the_geom = "
	// + wktGeometryInsert
	// + " where id_redlining = :idRedLining")
	// .setParameter("idRedLining", idRedlining);
	// query.executeUpdate();
	// tx.commit();
	// } catch (Exception x) {
	// tx.rollback();
	// throw x;
	// }
	// } catch (Exception x) {
	// // Log
	// throw x;
	// }
	// }
	//
	// public void removeRedlining(User user, String geometryType, int
	// idFeature) {
	// try {
	// Session session = SessionFactoryManager.openSession();
	// Transaction tx = session.beginTransaction();
	// try {
	// int idUser = user.getIdUser();
	//
	// String tableName = getRedliningTableName(geometryType);
	// /*
	// * Delete
	// */
	// Query query = session
	// .createSQLQuery(
	// "delete from  "
	// + tableName
	// + " where id_user = :idUser and id_feature = :idFeature")
	// .setParameter("idUser", idUser)
	// .setParameter("idFeature", idFeature);
	//
	// query.executeUpdate();
	// tx.commit();
	// } catch (Exception x) {
	// tx.rollback();
	// throw x;
	// }
	// } catch (Exception x) {
	// // Log
	// throw x;
	// }
	// }
	//
	// private RedliningDTO getRedliningById(Session session, String
	// geometryType,
	// int idRedlining) {
	//
	// RedliningDTO feat = null;
	// String tableName = getRedliningTableName(geometryType);
	//
	// try {
	// Query query = session
	// .createSQLQuery(
	// "select id_redlining, id_user, ST_AsText(the_geom) from "
	// + tableName
	// + " where  id_redlining = :idRedlining")
	// .setParameter("idRedlining", idRedlining);
	//
	// List res = query.list();
	// if (res.size() == 1) {
	// Object ob = res.get(0);
	// feat = parseRedlining(ob);
	// feat.setGeometryType(geometryType);
	// } else {
	// throw new RuntimeException("redlining non esistente");
	// }
	//
	// } catch (Exception x) {
	//
	// }
	// return feat;
	// }

}
