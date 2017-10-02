package it.gesp.geoportal.dao.dto;

import it.gesp.geoportal.constants.Constants;
import it.gesp.geoportal.dao.GeometryType;
import it.gesp.geoportal.exceptions.DataInvalidException;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class AlertSITDTO {

	private int idAlert;
	private int alertTypeId;
	private String alertTypeName;
	private String description;
	
	private String submitterName;
	private String submitterEmail;
	//private Date insertTime;
	private String insertTimeString;
	private String alertStatusCode;
	private String departmentName;
	private String departmentCod;
	private String insertedByMuniName;
	private String insertedByMuniCod;
	private boolean fromSITMuni;
	private String currentStatusCode;
	private String currentStatusName;
	private String wktGeometry;
	//private Date eventDate;
	private String eventDateStr;
	private String epsg;
	private String referenceCode;
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

	public String getEpsg() {
		return epsg;
	}

	public void setEpsg(String epsg) {
		this.epsg = epsg;
	}

	public int getAlertTypeId() {
		return alertTypeId;
	}

	public void setAlertTypeId(int alertTypeId) {
		this.alertTypeId = alertTypeId;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
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
	
	public void setInsertTimeStrFromDate(Date insertDate) {
		if (insertDate != null) {
			this.setInsertTimeString(new SimpleDateFormat(Constants.DEFAULT_TIME_FORMAT).format(insertDate));
		}
	}
	
	public void setEventDateStrFromDate(Date eventDate) {
		if (eventDate != null) {
			this.setEventDateStr(new SimpleDateFormat(Constants.DEFAULT_DATE_FORMAT).format(eventDate));
		}
	}

	public String getInsertTimeString() {
		return insertTimeString;
	}

	public void setInsertTimeString(String insertTimeString) {
		this.insertTimeString = insertTimeString;
	}

	public String getCurrentStatusCode() {
		return currentStatusCode;
	}

	public void setCurrentStatusCode(String currentStatusCode) {
		this.currentStatusCode = currentStatusCode;
	}

	public String getCurrentStatusName() {
		return currentStatusName;
	}

	public void setCurrentStatusName(String currentStatusName) {
		this.currentStatusName = currentStatusName;
	}

	public AlertDTO getAsAlertDTO() {
		AlertDTO alertDTO = new AlertDTO();
		
		//alertDTO.setAlertStatusCode(this.alertStatusCode);
		alertDTO.setAlertTypeId(this.alertTypeId);
		//alertDTO.setAlertTypeName(this.alertTypeName);
		
		//Event date...
		alertDTO.setEventDateStr(this.eventDateStr);
		//Parse date
		try {
			alertDTO.setDateFromEventDateStr();
		} catch (ParseException exc) {
			throw new DataInvalidException("eventDateStr must be expressed in dd-MM-yyyy format");
		}
		
		//alertDTO.setEventDateStrFromDate();
		
		alertDTO.setDepartmentCod(this.departmentCod);
		alertDTO.setDepartmentName(this.departmentName);
		
		alertDTO.setDescription(this.description);
		//alertDTO.setEpsg(this.epsg);
		alertDTO.setFromSITMuni(this.fromSITMuni);
		
		alertDTO.setInsertedByMuniCod(this.insertedByMuniCod);
		alertDTO.setInsertedByMuniName(this.insertedByMuniName);
		alertDTO.setMobileNum(this.mobileNum);
		alertDTO.setPhoneNum(this.phoneNum);
		alertDTO.setSubmitterEmail(this.submitterEmail);
		alertDTO.setSubmitterName(this.submitterName);
		alertDTO.setWktGeometry(this.wktGeometry);
		alertDTO.setGeometryType(GeometryType.POINT);
		
		return alertDTO;
	}
	
}