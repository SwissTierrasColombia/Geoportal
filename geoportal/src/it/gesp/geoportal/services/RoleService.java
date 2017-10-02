package it.gesp.geoportal.services;

import it.gesp.geoportal.dao.SessionFactoryManager;
import it.gesp.geoportal.dao.entities.Permission;
import it.gesp.geoportal.dao.entities.Role;
import it.gesp.geoportal.dao.entities.User;
import it.gesp.geoportal.dao.repositories.PermissionRepository;
import it.gesp.geoportal.dao.repositories.RoleRepository;
import it.gesp.geoportal.dao.repositories.UserRepository;
import it.gesp.geoportal.exceptions.OperationInvalidException;

import java.util.List;
import java.util.Set;

import org.apache.log4j.Logger;
import org.hibernate.Hibernate;
import org.hibernate.Session;
import org.hibernate.Transaction;

public class RoleService {
	private static final Logger log = Logger.getLogger(RoleService.class);
	
	public List<Role> getRoles() throws Exception {
		Session session = null;
		log.debug("getRoles");;
		try {
			session = SessionFactoryManager.openSession();
			RoleRepository rr = new RoleRepository();

			return rr.getRoles(session);

		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}

	public void addRole(Role role) throws Exception {
		Session session = null;
		log.debug("addRole");
		try {
			session = SessionFactoryManager.openSession();
			RoleRepository rr = new RoleRepository();

			Transaction tx = session.beginTransaction();
			try {
				rr.save(session, role);
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
	
	public void updateRole(Role role) throws Exception {
		Session session = null;
		log.debug("updateRole");
		try {
			session = SessionFactoryManager.openSession();
			RoleRepository rr = new RoleRepository();

			Role roleDb = rr.getById(session, Role.class, role.getIdRole());
			if (roleDb == null) {
				throw OperationInvalidException.createMissingIdExeption("Role", role.getIdRole());
			}
			
			Transaction tx = session.beginTransaction();
			try {
				
				roleDb.setRoleDescription(role.getRoleDescription());
				roleDb.setRoleName(role.getRoleName());
				
				rr.save(session, roleDb);
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
	
	public void deleteRole(int roleId) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			RoleRepository rr = new RoleRepository();

			Transaction tx = session.beginTransaction();
			try {
				List<User> activeUsers = new UserRepository().getUsersForRoleId(session, roleId);
				
				if (activeUsers.size() > 0) {
					throw new OperationInvalidException("EXC_ROLE_DELETE_ERROR_USERS_USING_ROLE", "The role cannot be deleted. There are " + activeUsers.size() + " users using this role.", "" + activeUsers.size());
				}
				rr.deleteRole(session, roleId);
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
	
	public void setPermissionsForRole(int roleId, List<Integer> permissionIds) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			RoleRepository rr = new RoleRepository();

			Transaction tx = session.beginTransaction();
			try {
				
				//Remove all permissions from role...
				Role role = rr.getById(session, Role.class, roleId);
				role.getPermissions().clear();
				
				//Add specified permissions to role (if specified)
				if (permissionIds.size() > 0) {
					List<Permission> permissionsToSet = rr.getAll(session, Permission.class, "idPermission", permissionIds);
					role.getPermissions().addAll(permissionsToSet);
				}
				
				//Save it
				rr.save(session, role);
				
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
	
	
	public Set<Permission> getPermissionsForRole(int roleId) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			RoleRepository rr = new RoleRepository();
			
			Set<Permission> permissions = null;
			Role role = rr.loadById(session, Role.class, roleId);
			permissions = role.getPermissions();
			
			//Loads permission eagerly
			Hibernate.initialize(permissions);
			
			return permissions;

		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	public List<Permission> getAvailablePermissionsForRole(int roleId) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			PermissionRepository pr = new PermissionRepository();

			return pr.getAvailablePermissionsForRole(session, roleId);

		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
}
