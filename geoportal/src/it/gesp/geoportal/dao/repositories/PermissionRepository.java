package it.gesp.geoportal.dao.repositories;

import it.gesp.geoportal.dao.entities.Permission;
import it.gesp.geoportal.dao.repositories.base.BaseRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

public class PermissionRepository extends BaseRepository<Permission> {
	
	private static final Logger log = Logger.getLogger(PermissionRepository.class);
	
	@SuppressWarnings("unchecked")
	public List<Permission> getPermissions(Session session) {
//		try {

			List<Permission> permissions = null;
			permissions = this.getAll(session, Permission.class);
			return permissions;

//		} catch (Exception x) {
//			// Log
//			throw x;
//		}
	}
	
	public List<Permission> getAvailablePermissionsForRole(Session session, int roleId) {
		String hql = "select p from Permission p " +
		"where p.id not in (" +
				" select p2.id from Permission p2 " +
				" join p2.roles r " +
				" where r.idRole = (:idRole) )";
		
		Query query = session.createQuery(hql);
		query.setParameter("idRole", roleId);
		List<Permission> availablePermissions = query.list();
		
		return availablePermissions;
		
	}
}
