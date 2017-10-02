package it.gesp.geoportal.services;

import it.gesp.geoportal.dao.dto.AlertCoordinatesDTO;
import it.gesp.geoportal.dao.dto.AlertIntersectionDTO;
import it.gesp.geoportal.dao.entities.AlertIntersection;
import it.gesp.geoportal.dao.repositories.AlertIntesectionRepository;
import it.gesp.geoportal.dao.repositories.AlertRepository;
import it.gesp.geoportal.exceptions.DataInvalidException;
import it.gesp.geoportal.exceptions.OperationInvalidException;

import java.net.URL;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Session;


public class WFSIntersectionService {

	private static final Logger log = Logger.getLogger(WFSIntersectionService.class);

	/**
	 * Performs a WFS call to fetch the description of the department with the given key.
	 * @param session
	 * @param key
	 * @return
	 * @throws Exception
	 */
	public String getDepartmentDescriptionFromKey(Session session, String key) throws Exception {
		AlertIntersectionDTO depDTO;
		
		log.debug("getDepartmentDescriptionFromKey " + key);
		
		//Get WFS URL
		AlertIntersection depAi = new AlertIntesectionRepository().getDepartmentsIntersection(session);
		depDTO = AlertIntersectionDTO.parseFromAlertIntersection(depAi);
	
		String req = buildBasicFilterWFSRequest_CSV(depDTO.getLayerUrl(), depDTO.getLayerName(), depDTO.getKeyColumnName(), key, depDTO.getDescColumnName());
		
		
		URL u = new URL(req);
		
		String responseString = new HttpCallService().performHttpCall(u);
		
		if (responseString != null) {
			//Get response
            if (responseString.indexOf("<?xml") > -1) {
            	/*
            	 * I asked for a CSV... with geoserver the XML response is for errors...
            	 */
            	throw OperationInvalidException.createMissingKeyExeption(responseString, "Department", key); 
            }
            String[] lines = responseString.split(System.getProperty("line.separator"));
            String data = lines[1];
            
            int idx = data.indexOf(",");
            String returnValue = data.substring(idx + 1, data.length());
            returnValue = returnValue.replaceAll("\"", "");
            
            log.debug("Parsed department name from key " + key + " = " + returnValue);    
            return returnValue;
            
		} else {
			log.error("Response string for getDepartmentDescriptionFromKey with key = " + key + " is null");
			throw new OperationInvalidException("EXC_ALERTS_DEPARTMENT_DESCRIPTION_NO_FETCHED", "Error fetching the name of the specified department", key);
		}
	}

	/**
	 * Performs a WFS call to the the WKT geometry of the given Municipality
	 * 
	 * The geometry is expressed in the ALERTS EPSG (4326 by default).
	 * 
	 * @param session
	 * @param key
	 * @return
	 * @throws Exception
	 */
	public String getMunicipalityWKTGeometry(Session session, String key) throws Exception{
		
		AlertIntersectionDTO muniDTO;
		
		log.debug("getMunicipalityWKTGeometry " + key);
		
		//Get WFS URL
		AlertIntersection muniAi = new AlertIntesectionRepository().getMunicipalitiesIntersection(session);
		muniDTO = AlertIntersectionDTO.parseFromAlertIntersection(muniAi);
	
		//URL u = new URL("http://192.168.10.72:8081/geoserver/icf/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=icf:m1103va002001_hn&maxFeatures=1&outputFormat=csv&propertyName=geom&cql_filter=cod_mun_%3D101");
		String req = buildBasicFilterWFSRequest_CSV(muniDTO.getLayerUrl(), muniDTO.getLayerName(), muniDTO.getKeyColumnName() , key, muniDTO.getGeomColumnName());
		URL u = new URL(req);
		
		String responseString = new HttpCallService().performHttpCall(u);
		
		if (responseString != null) {
			//Get response
            if (responseString.indexOf("<?xml") > -1) {
            	//Invalid data
            	throw OperationInvalidException.createMissingKeyExeption(responseString, "Municipality", key); 
            }
            String[] lines = responseString.split(System.getProperty("line.separator"));
            String data = lines[1];
            
            int idx = data.indexOf(",");
            String wkt = data.substring(idx + 1, data.length());
            wkt = wkt.replaceAll("\"", "");
            
            log.debug("Parsed WKT (truncated) from municipality key " + key + " = " + wkt.substring(0, Math.min(wkt.length(), 200)));
            return wkt;
		}
		else {
			log.debug("Response from URL " + u.toExternalForm() + " is null!");

			throw new DataInvalidException();
		}
	}
	
	/**
	 * Performs a WFS call to check if the given Alerts fall inside the
	 * areas of the 'intersectLayer' localized by the columnValues filter(s).
	 * 
	 * Return true or false
	 * 
	 * @param session
	 * @param key
	 * @return
	 * @throws Exception
	 */
	public int checkIfAlertIntersectsLayer(List<AlertCoordinatesDTO> alertCoordinates, String intersectLayerUrl, String intersectLayerName, String keyColumnName, List<String> columnValues) throws Exception {
		
//		String keyColumnName = "dep";
		
		if (log.isDebugEnabled()) {
			
			String logMsg = "checkIfAlertIntersectsLayer (AlertCoordinates: ";
			for(AlertCoordinatesDTO dto : alertCoordinates) {
				logMsg += "(" + dto.getxAlert() + ", " + dto.getyAlert() + ") ";
			}
			logMsg += " with layerName " + intersectLayerName + "(url: " + intersectLayerUrl + ") with keyColumnName " + keyColumnName + " and columnValues (";
			
			for (String val : columnValues) {
				logMsg += val + " ";
			}
			logMsg +=")";
			
			log.debug(logMsg);
		}
		
		String epsg =  "EPSG:" + AlertRepository.EPSG_DEFAULT_ALERTS;
		
		//Header
		String wfsBody = buildWFSRequestHeader();
		String orConditions = buildMultipleOrComparisonConditions(columnValues, keyColumnName);
		
		String intersectionConditions = buildMultipleAndIntersectionConditions(epsg, alertCoordinates);
		
		String query = "<wfs:Query typeName=\" " + intersectLayerName + " \" srsName=\" " + epsg + " \"> " +
				"<ogc:Filter xmlns:ogc=\"http://www.opengis.net/ogc\">" +
					"<ogc:And>" +
						orConditions + 
						intersectionConditions + 
					"</ogc:And>" + 
				"</ogc:Filter>"+
			"</wfs:Query>" + 
		"</wfs:GetFeature>";
		
		String body = wfsBody + query;
		
		URL u = new URL(intersectLayerUrl);
		String responseString = new HttpCallService().performHttpCall(u, body);
		
		int idx = responseString.indexOf("numberOfFeatures=\"");
		if (idx < 0) {
			//Invalid data
        	throw new OperationInvalidException(responseString, "EXC_WFS_CONNECTION_ERROR", "Connection error");
		}
		
		String numberTemp = responseString.substring(idx + 18, responseString.length());
		
		String number = numberTemp.substring(0, numberTemp.indexOf("\""));
		
		int num = Integer.parseInt(number);
		log.debug("checkIfAlertIntersectsLayer Intersect num:" + num);
		
		return num;
	}
	
	private String buildWFSRequestHeader() {
		String wfsBody = "<wfs:GetFeature " +
				 "service=\"WFS\" " +
				 "version=\"1.1.0\" " +
				 "outputFormat=\"text/xml; subtype=gml/2.1.2\" " +
				 "resultType=\"hits\" " +
				 "xmlns:wfs=\"http://www.opengis.net/wfs\" " +
				">";
		return wfsBody;
	}
	

	private String addOrCondition(String condition, String propertyName, String propertyValue) {
		String tempCondition = "<ogc:PropertyIsEqualTo matchCase=\"true\">" +
				"<ogc:PropertyName>" + propertyName + "</ogc:PropertyName>" +
				"<ogc:Literal>" + propertyValue + "</ogc:Literal>" +
			"</ogc:PropertyIsEqualTo>";
		
		if (condition == null || "".equals(condition)) {
			return tempCondition;
		}
		else {
			String res = "<ogc:Or>" + condition + tempCondition + "</ogc:Or>";
			return res;
		}
	}
	
	private String buildMultipleOrComparisonConditions(List<String> propertyValueList, String propertyName) {
		String condition = "";
		
		for(String propertyValue : propertyValueList) {
			condition = addOrCondition(condition, propertyName, propertyValue);
		}
		
		return condition;
	}
	
	private String addIntersectionCondition(String condition, String epsg, AlertCoordinatesDTO coords) {
		String tempCondition = "<ogc:Intersects>" +
				"<ogc:PropertyName/>" +
				"<gml:Point xmlns:gml=\"http://www.opengis.net/gml\" srsName=\" " + epsg + " \">" +
					"<gml:pos>" + coords.getxAlert() + " " + coords.getyAlert()  + "</gml:pos>" +
				"</gml:Point>" +
			"</ogc:Intersects>";
		
		if (condition == null || "".equals(condition)) {
			return tempCondition;
		}
		else {
			String res = "<ogc:And>" + condition + tempCondition + "</ogc:And>";
			return res;
		}
	}
	
	private String buildMultipleAndIntersectionConditions(String epsg, List<AlertCoordinatesDTO> alertCoordinates) {
		String condition = "";
		
		for(AlertCoordinatesDTO coords : alertCoordinates) {
			condition = addIntersectionCondition(condition, epsg, coords);
		}
		
		return condition;
	}
	
	private String buildBasicFilterWFSRequest_CSV(String layerUrl, String layerName, String filterKeyColumnName, String keyValue, String returnColumnName) {
		String request = "";
		
		//Geoserver URL - WFS service
		request += layerUrl;//aiDTO.getLayerUrl();
		
		//GetFeature
		request = HttpCallService.addParameterToURL(request, "service", "WFS");
		request = HttpCallService.addParameterToURL(request, "version", "1.0.0");
		
		request = HttpCallService.addParameterToURL(request, "request", "GetFeature");
		
		//"icf:m1103va002001_hn"
		request = HttpCallService.addParameterToURL(request, "typeName", layerName); //aiDTO.getLayerName()
		
		request = HttpCallService.addParameterToURL(request, "srsName", "EPSG:" + AlertRepository.EPSG_DEFAULT_ALERTS);
		request = HttpCallService.addParameterToURL(request, "outputFormat", "csv");
		request = HttpCallService.addParameterToURL(request, "propertyName", returnColumnName);
		request = HttpCallService.addParameterToURL(request, "cql_filter",  filterKeyColumnName + "=" + keyValue); //aiDTO.getKeyColumnName()
		
		/*
		 * Example
		 * http://192.168.10.72:8081/geoserver/icf/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=icf:m1103va002001_hn&maxFeatures=1&outputFormat=csv&propertyName=geom&cql_filter=cod_mun_%3D101
		 */
		return request;
	}
}
