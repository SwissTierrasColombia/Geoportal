package it.gesp.geoportal.services;

import it.gesp.geoportal.dao.SessionFactoryManager;
import it.gesp.geoportal.dao.entities.Role;
import it.gesp.geoportal.dao.entities.User;
import it.gesp.geoportal.dao.repositories.RoleRepository;
import it.gesp.geoportal.dao.repositories.UserRepository;
import it.gesp.geoportal.exceptions.OperationInvalidException;

import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.hibernate.Transaction;

public class UserService {
	private static final Logger log = Logger.getLogger(UserService.class);
	
	public List<User> getUsers() throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			UserRepository ur = new UserRepository();

			return ur.getUsers(session, false);

		} catch (Exception x) {
			log.debug(x);
			throw x;
		} finally {
			session.close();
		}
	}
	
	public void addUser(User user, int idRole) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			UserRepository ur = new UserRepository();
			RoleRepository rr = new RoleRepository();

			Transaction tx = session.beginTransaction();
			try {
				
				/*
				 * An user can be inserted if it does not exist
				 * or, if it exists, it is in the "deleted" state 
				 */
				User existingUser = ur.getUserForLoginByUsername(session, user.getUsername(), false);
				if (existingUser != null && !existingUser.isDeleted()) {
					throw new OperationInvalidException("A user with the same username already exists.");	
				}
				
				Role role = rr.loadById(session, Role.class, idRole);
				user.setRole(role);
				ur.save(session, user);

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
	
	public void updateUser(User newUser, int idRole) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			UserRepository ur = new UserRepository();
			RoleRepository rr = new RoleRepository();

			Transaction tx = session.beginTransaction();
			try {
				
				/*
				 * An user can be modified if it exists.
				 */
				User existingUser = ur.getById(session, User.class, newUser.getIdUser());
				if (existingUser == null) {
					throw OperationInvalidException.createMissingIdExeption("User", newUser.getIdUser());
				}
				
				Role existingRole = rr.loadById(session, Role.class, idRole);
				if (existingRole == null) {
					throw OperationInvalidException.createMissingIdExeption("Role", idRole);
				}
				
				existingUser.setRole(existingRole);
				existingUser.setPassword(newUser.getPassword());
				
				ur.update(session, existingUser);

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
	
	public void deleteUser(int userId) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			UserRepository ur = new UserRepository();

			Transaction tx = session.beginTransaction();
			try {
				User user = ur.getById(session, User.class, userId);
				
				if (user.isDeleted()) {
					throw new OperationInvalidException("User already deleted.");	
				}
				
				user.setDeleted(true);
				user.setRole(null);
				ur.save(session, user);
				
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
	
	public void toggleEnableUser(int userId, boolean enable) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			UserRepository ur = new UserRepository();

			Transaction tx = session.beginTransaction();
			try {
				User user = ur.getById(session, User.class, userId);
				
				if (user.isDisabled() && !enable) {
					throw new OperationInvalidException("User already disabled.");	
				}
				
				if (!user.isDisabled() && enable) {
					throw new OperationInvalidException("User already enabled.");	
				}
				
				user.setDisabled(!enable);
				ur.save(session, user);
				
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
	
	
	public void setRoleForUser(int idUser, int idRole) throws Exception {
		
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			UserRepository ur = new UserRepository();
			RoleRepository rr = new RoleRepository();

			Transaction tx = session.beginTransaction();
			try {
				User user = ur.loadById(session, User.class, idUser);
				Role role = rr.loadById(session, Role.class, idRole);
				user.setRole(role);
				ur.save(session, user);
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
	
	public void resetUserPassword(int idUser, String newPassword) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			UserRepository ur = new UserRepository();

			Transaction tx = session.beginTransaction();
			try {
				User user = ur.getById(session, User.class, idUser);
				if (user == null) {
					throw new OperationInvalidException("Specified userid " + idUser + " not existing.");
				}

				user.setPassword(newPassword);
				ur.save(session, user);
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
	
	public void changeUserPassword(int idUser, String currentPassword, String newPassword) throws Exception {
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			UserRepository ur = new UserRepository();

			Transaction tx = session.beginTransaction();
			try {
				User user = ur.getById(session, User.class, idUser);
				if (user == null) {
					throw new OperationInvalidException("Specified userid " + idUser + " not existing.");
				}
				if (!user.getPassword().equals(currentPassword)) {
					throw new OperationInvalidException("Supplied password is not valid");
				}

				user.setPassword(newPassword);
				ur.save(session, user);
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
	
	
	public User getUserByUsername(String username, boolean includePermissions) {
		UserRepository ur = new UserRepository();

		try {
			User user = ur.getUserByUsername(username, includePermissions);
			return user;
		} catch (Exception e) {
			log.debug(e);
			throw new RuntimeException(e);
		}
	}

	public User doLoginUser(String username, String hashedPassword) throws Exception {
		UserRepository ur = new UserRepository();
		User user = ur.getUserByUsername(username, true);
		if (user != null && user.getPassword().equals(hashedPassword)) {
			return user;
		}
		return null;
	}
	
	
}
