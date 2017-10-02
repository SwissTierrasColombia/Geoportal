package it.gesp.geoportal.services;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import org.apache.commons.io.input.ReversedLinesFileReader;
import org.apache.log4j.Logger;

public class LogService {
	private static final Logger log = Logger.getLogger(LogService.class);
	
//	public static void writeLog(User user, String context, String operation, String description) {
//		Session session = null;
//		try {
//			session = SessionFactoryManager.openSession();
//			Transaction tx = session.beginTransaction();
//			try {
//				new LogRepository().writeLog(session, user, context, operation, description);
//				tx.commit();
//			} catch (Exception x) {
//				log.debug(x);
//				tx.rollback();
//				throw x;
//			}
//		} catch (Exception x) {
//			log.debug(x);
//			throw new RuntimeException(x);
//		} finally {
//			session.close();
//		}
//	}

	public String getLastLogRowsFast(int numRows) throws IOException {
		
		StringBuilder strBld = new StringBuilder();
		
		/*
		 * Try to load log4j conf file...
		 */
		try {
			Properties props = new Properties();
			InputStream uuu = this.getClass().getClassLoader().getResourceAsStream("log4j.properties");
			props.load(uuu);
			
			String logFilePath = props.getProperty("log4j.appender.file.File");
			
			int found = logFilePath.indexOf("${catalina.home}");
			if (found > -1) {
				String catalinaHome = System.getProperty("catalina.home");
				logFilePath = logFilePath.replace("${catalina.home}", catalinaHome);
			}
			
			
			
			File fil = new File(logFilePath);
			ReversedLinesFileReader r = new ReversedLinesFileReader(fil);
			
			List<String> strings = new ArrayList<String>();
			for(int j=0; j<numRows; j++) {
				String line = r.readLine();
				strings.add(line);
				
				if (line == null) break;
			}
			
			for(int j= strings.size() - 1 ; j>=0; j--) {
				String s = strings.get(j);
				strBld.append(s);
				strBld.append(System.getProperty("line.separator"));
			}
			
			r.close();
	
			return strBld.toString();
		
		} catch (Exception x) {
			log.debug(x);
			throw new RuntimeException(x);
		}
	}
}