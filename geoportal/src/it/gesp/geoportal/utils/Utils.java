package it.gesp.geoportal.utils;

public class Utils {

	public static boolean isNullOrEmpty(String s) {
		if (s == null || "".equals(s.trim())) return true;
		
		return false;
	}
}
