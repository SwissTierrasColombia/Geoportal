package it.gesp.geoportal.dao;

public class GeometryType {

	public static final String POINT = "point";
	public static final String LINE = "line";
	public static final String POLYGON = "polygon";
	
	public static boolean checkGeometryType(String geometryType) {
		
		/*
		 * Only Point is allowed
		 */
		if (POINT.equals(geometryType)) return true;
		//if (LINE.equals(geometryType)) return true;
		//if (POLYGON.equals(geometryType)) return true;
		return false;
	}
	
}
