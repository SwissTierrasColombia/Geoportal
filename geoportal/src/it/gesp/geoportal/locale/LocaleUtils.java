package it.gesp.geoportal.locale;

import java.util.Locale;
import java.util.ResourceBundle;

/**
 * Refs : http://docs.oracle.com/javase/tutorial/i18n/intro/after.html
 * 
 */

public class LocaleUtils {

	/*
	 * DB MESSAGES
	 */
	private static final ResourceBundle dbMessages;
	private static final String DB_MESSAGES_PROPERTY_FILE_NAME = "DBMessagesBundle";
	
	static {
		Locale spanishLocale = new Locale("es");
		dbMessages = ResourceBundle.getBundle(DB_MESSAGES_PROPERTY_FILE_NAME, spanishLocale);
	}
	
	public static ResourceBundle getDBMessages() {
		return dbMessages;
	}
	
	/*
	 * USER MESSAGES
	 */
	private static final String USER_MESSAGES_PROPERTY_FILE_NAME = "UserMessagesBundle";
	
	private static String defaultLanguage = "es";
	
	private static final ResourceBundle userMessages_EN;
	private static final ResourceBundle userMessages_ES;
	
	static {
		Locale englishLocale = new Locale("en");
		Locale spanishLocale = new Locale("es");
		
		userMessages_EN = ResourceBundle.getBundle(USER_MESSAGES_PROPERTY_FILE_NAME, englishLocale);
		userMessages_ES = ResourceBundle.getBundle(USER_MESSAGES_PROPERTY_FILE_NAME, spanishLocale);
	}
	
	public static ResourceBundle getUserMessages(String lang) {
		if ("en".equals(lang)) {
			return userMessages_EN;
		}
		if ("es".equals(lang)) {
			return userMessages_ES;
		}
		return null;
	}
	
	public static boolean isLanguageSupported(String languageCode) {
		if ("en".equals(languageCode)) return true;
		if ("es".equals(languageCode)) return true;
		
		return false;
	}
	
	public static String getDefaultLanguage() {
		return LocaleUtils.defaultLanguage;
	}
	
	
//	public static List<Object> applyLocalization(List<Object> dataList, Class clazz, String keyProperty, String valueProperty) {
//		
//		for (Object o : dataList) {
//			try {
//				Field propertyKeyField  = clazz.getField(keyProperty);
//				Field propertyValueField  = clazz.getField(valueProperty);
//				
//				String keyValue = (String) propertyKeyField.get(o);
//				String value = "pippo " + Math.random();
//				
//				propertyValueField.set(o, value);
//				
//			} catch (NoSuchFieldException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			} catch (SecurityException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			} catch (IllegalArgumentException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			} catch (IllegalAccessException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}	
//		}
//		
//		
//		
//		
//		
//		return null;
//	}
	
}
