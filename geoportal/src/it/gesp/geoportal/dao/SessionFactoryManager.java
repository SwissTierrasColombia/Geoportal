package it.gesp.geoportal.dao;

import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;
import org.hibernate.service.ServiceRegistryBuilder;

/*
 * http://www.journaldev.com/2882/hibernate-tutorial-for-beginners-using-xml-annotations-and-property-configurations
 */

public class SessionFactoryManager {

	public static final String SCHEMA_NAME = "geoportal";
	
	private static final Logger log = Logger
			.getLogger(SessionFactoryManager.class);

	private static SessionFactory sessionFactory;

	public static void shutdownSessionFactory() {
		log.info("Shutting down session factory.");
		sessionFactory.close();
		log.info("Session factory successfully shut down.");
	}
	
	@SuppressWarnings("deprecation")
	public static void initSessionFactory() {

		log.info("Init session factory.");

		Configuration configuration = new Configuration();
		configuration.configure("hibernate.cfg.xml");

		ServiceRegistry serviceRegistry = new ServiceRegistryBuilder()
				.applySettings(configuration.getProperties()).build();

		sessionFactory = configuration.buildSessionFactory(serviceRegistry);

		log.info("Session factory correctly initialized.");
	}

	public static Session openSession() {
		log.debug("opening session");

		if (sessionFactory == null) {
			initSessionFactory();
		}

		log.debug("session returned");
		/*
		 * Creates a brand-new session that must be managed and flushed
		 */
		return sessionFactory.openSession();
		
		/*
		 * This is automatically managed (it is bound to the thread
		 */
		//return sessionFactory.getCurrentSession();
	}
}
