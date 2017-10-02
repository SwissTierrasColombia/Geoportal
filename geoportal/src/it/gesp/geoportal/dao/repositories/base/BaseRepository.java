package it.gesp.geoportal.dao.repositories.base;

import it.gesp.geoportal.dao.SessionFactoryManager;

import java.io.Serializable;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;

public class BaseRepository<T> {
	private static final Logger log = Logger.getLogger(BaseRepository.class);

	protected void commitTransaction(Transaction transaction) {
		transaction.commit();
	}

	protected void rollbackTransaction(Transaction transaction) {
		transaction.rollback();
	}

	protected void closeSession(Session session) {
		session.close();
	}

	public void save(T obj) throws Exception{
		try {
			Session session = SessionFactoryManager.openSession();
			Transaction transaction = session.beginTransaction();

			try {
				save(session, obj);
				commitTransaction(transaction);

			} catch (Exception x) {
				// log
				log.debug("Error saving object of type ", x);
				rollbackTransaction(transaction);
				log.debug("Transaction rolled back");

				// rethrow
				throw x;
			} finally {
				closeSession(session);
			}

		} catch (Exception x) {
			// log
			log.debug("Error", x);
			throw x;
		}
	}

	public void update(Session session, T obj) {
		session.update(obj);
	}
	
	public void save(Session session, T obj) {
		session.saveOrUpdate(obj);
	}

	public void delete(T obj) throws Exception{
		try {
			Session session = SessionFactoryManager.openSession();
			Transaction transaction = session.beginTransaction();
			try {
				delete(session, obj);
				commitTransaction(transaction);
			} catch (Exception x) {
				// log
				log.debug("Error deleting object of type ", x);
				rollbackTransaction(transaction);
				log.debug("Transaction rolled back");

				// rethrow
				throw x;
			} finally {
				closeSession(session);
			}
		} catch (Exception x) {
			// log
			log.debug("Error", x);
			throw x;
		}
	}

	public void delete(Session session, T obj) {
		session.delete(obj);
	}

	@SuppressWarnings("unchecked")
	public <T> List<T> getAll(Session session, Class<T> type) {
		return (List<T>) session.createCriteria(type).list();
	}
	
	public <T> List<T> getAll(Session session, Class<T> type, String attributeName, List<Integer> ids) {
		return (List<T>) session.createCriteria(type).add(Restrictions.in(attributeName, ids)).list();
	}
	
	public T loadById(Class<T> objType, int objId) throws Exception{
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			return loadById(session, objType, objId);

		} catch (Exception x) {
			// log
			log.debug("Error", x);
			throw x;
		} finally {
			closeSession(session);
		}
	}

	public T loadById(Session session, Class<T> clazz, int objId) {
		return (T) session.load(clazz, (Serializable) objId);
	}
	
	public Object loadByIdGeneral(Session session, Class clazz, int objId) {
		return session.load(clazz, (Serializable) objId);
	}
	
	public T getById(Class<T> objType, int objId) throws Exception{
		Session session = null;
		try {
			session = SessionFactoryManager.openSession();
			return getById(session, objType, objId);

		} catch (Exception x) {
			// log
			log.debug("Error", x);
			throw x;
		} finally {
			closeSession(session);
		}
	}

	public T getById(Session session, Class<T> clazz, int objId) {
		return (T) session.get(clazz, (Serializable) objId);
	}
	
	public Object getByIdGeneral(Session session, Class clazz, int objId) {
		return session.get(clazz, (Serializable) objId);
	}
}
