package it.gesp.geoportal.dao.repositories;

import it.gesp.geoportal.dao.entities.Log;
import it.gesp.geoportal.dao.entities.User;
import it.gesp.geoportal.dao.repositories.base.BaseRepository;

import java.util.Date;

import org.apache.log4j.Logger;
import org.hibernate.Session;

public class LogRepository extends BaseRepository<Log> {

	private static final Logger log = Logger.getLogger(LogRepository.class);
	
	public void writeLog(Session session, User user, String context, String operation, String description) {
		
		Log log = new Log();
		
		log.setContext(context);
		log.setOperation(operation);
		log.setDescription(description);
		log.setOperationTime(new Date());
		log.setUser(user);
		
		super.save(session, log);
	}
	
}
