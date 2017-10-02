package it.gesp.geoportal.dao.dto;

import it.gesp.geoportal.constants.Constants;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class AlertDTO {

	private int idAlert;
	private int alertTypeId;
	private String wktGeometry;
	private String geometryType;
	private String title;
	private String description;
	private String epsg;
	private Integer idUser;
	private String submitterName;
	private String submitterEmail;
	private String referenceCode;
	private Date insertTime;
	private String alertTypeName;
	private String alertStatusCode;
	
	private String departmentName;
	private String departmentCod;
	private String insertedByMuniName;
	private String insertedByMuniCod;
	private boolean fromSITMuni;

	private Date eventDate;
	private String eventDateStr;
	
	private String phoneNum;
	private String mobileNum;
	
	public int getIdAlert() {
		return idAlert;
	}

	public void setIdAlert(int idAlert) {
		this.idAlert = idAlert;
	}

	public String getWktGeometry() {
		return wktGeometry;
	}

	public void setWktGeometry(String wktGeometry) {
		this.wktGeometry = wktGeometry;
	}

	public String getGeometryType() {
		return geometryType;
	}

	public void setGeometryType(String geometryType) {
		this.geometryType = geometryType;
	}

	public String getEpsg() {
		return epsg;
	}

	public void setEpsg(String epsg) {
		this.epsg = epsg;
	}

	// public static AlertDTO parseAlert(Object ob) {
	// Object featureArray[] = (Object[]) ob;
	// int idAlert = (Integer) featureArray[0];
	// int idUser = (Integer) featureArray[1];
	// String title = (String) featureArray[2];
	// String wktGeometry = (String) featureArray[3];
	//
	// AlertDTO feat = new AlertDTO();
	// feat.setIdAlert(idAlert);
	// // feat.setUserName("" + idUser);
	// feat.setTitle(title);
	// feat.setWktGeometry(wktGeometry);
	// feat.setEpsg(EPSG_DEFAULT_ALERTS);
	// return feat;
	// }

	public int getAlertTypeId() {
		return alertTypeId;
	}

	public void setAlertTypeId(int alertTypeId) {
		this.alertTypeId = alertTypeId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Integer getIdUser() {
		return idUser;
	}

	public void setIdUser(Integer idUser) {
		this.idUser = idUser;
	}

	public Date getInsertTime() {
		return insertTime;
	}

	public void setInsertTime(Date insertTime) {
		this.insertTime = insertTime;
	}

	public String getAlertTypeName() {
		return alertTypeName;
	}

	public void setAlertTypeName(String alertTypeName) {
		this.alertTypeName = alertTypeName;
	}

	public String getAlertStatusCode() {
		return alertStatusCode;
	}

	public void setAlertStatusCode(String alertStatusCode) {
		this.alertStatusCode = alertStatusCode;
	}

	public String getSubmitterName() {
		return submitterName;
	}

	public void setSubmitterName(String submitterName) {
		this.submitterName = submitterName;
	}

	public String getSubmitterEmail() {
		return submitterEmail;
	}

	public void setSubmitterEmail(String submitterEmail) {
		this.submitterEmail = submitterEmail;
	}

	public String getReferenceCode() {
		return referenceCode;
	}

	public void setReferenceCode(String referenceCode) {
		this.referenceCode = referenceCode;
	}

	public String getDepartmentName() {
		return departmentName;
	}

	public void setDepartmentName(String departmentName) {
		this.departmentName = departmentName;
	}

	public String getDepartmentCod() {
		return departmentCod;
	}

	public void setDepartmentCod(String departmentCod) {
		this.departmentCod = departmentCod;
	}

	public String getInsertedByMuniName() {
		return insertedByMuniName;
	}

	public void setInsertedByMuniName(String insertedByMuniName) {
		this.insertedByMuniName = insertedByMuniName;
	}

	public String getInsertedByMuniCod() {
		return insertedByMuniCod;
	}

	public void setInsertedByMuniCod(String insertedByMuniCod) {
		this.insertedByMuniCod = insertedByMuniCod;
	}

	public boolean isFromSITMuni() {
		return fromSITMuni;
	}

	public void setFromSITMuni(boolean fromSITMuni) {
		this.fromSITMuni = fromSITMuni;
	}

	public Date getEventDate() {
		return eventDate;
	}

	public void setEventDate(Date eventDate) {
		this.eventDate = eventDate;
	}

	public String getPhoneNum() {
		return phoneNum;
	}

	public void setPhoneNum(String phoneNum) {
		this.phoneNum = phoneNum;
	}

	public String getMobileNum() {
		return mobileNum;
	}

	public void setMobileNum(String mobileNum) {
		this.mobileNum = mobileNum;
	}

	public String getEventDateStr() {
		return eventDateStr;
	}

	public void setEventDateStr(String eventDateStr) {
		this.eventDateStr = eventDateStr;
	}
	
	public void setDateFromEventDateStr() throws ParseException{
		if (eventDateStr != null) {
			 
			DateFormat df = new SimpleDateFormat(Constants.DEFAULT_DATE_FORMAT);
			Date result = null;
			
			result = df.parse(eventDateStr);
			this.setEventDate(result);
		}
	}
	public void setEventDateStrFromDate() {
		if (eventDate != null) {
			this.setEventDateStr(new SimpleDateFormat(Constants.DEFAULT_DATE_FORMAT).format(eventDate));
		}
	}

}