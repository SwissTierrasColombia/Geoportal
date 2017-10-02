package it.gesp.geoportal.dao.entities;


import it.gesp.geoportal.constants.Constants;

import java.text.SimpleDateFormat;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;

@Entity
@Table(name = "vw_alerts")
public class VWAlert {

	private int idAlert;
	private int alertTypeId;
	private String geometryType;
	private Integer idUser;
	private String title;
	private String description;
	private String submitterName;
	private String submitterEmail;
	private String referenceCode;
	private Date insertTime;
	private Date lastChangeTime;
	private String wktGeometry;
	private String alertTypeName;	
	private String epsg;
	
	private String currentStatusCod;
	private String currentStatusName;
	
	private String departmentName;
	private String departmentCod;
	private String insertedByMuniName;
	private String insertedByMuniCod;
	private boolean fromSITMuni;
	
	private Date eventDate;
	private String eventDateStr;
	private String phoneNum;
	private String mobileNum;
	
	
	@Id
	@Column(name = "id_alert", nullable = false)
	public int getIdAlert() {
		return idAlert;
	}

	public void setIdAlert(int idAlert) {
		this.idAlert = idAlert;
	}
	
	@Column(name = "id_alert_type", nullable = false)
	public int getAlertTypeId() {
		return alertTypeId;
	}

	public void setAlertTypeId(int alertTypeId) {
		this.alertTypeId = alertTypeId;
	}
	
	@Column(name = "type_name", nullable = false)
	public String getAlertTypeName() {
		return alertTypeName;
	}

	public void setAlertTypeName(String alertTypeName) {
		this.alertTypeName = alertTypeName;
	}

	@Column(name = "wkt_geometry", nullable = false)
	public String getWktGeometry() {
		return wktGeometry;
	}

	public void setWktGeometry(String wktGeometry) {
		this.wktGeometry = wktGeometry;
	}

	@Column(name = "geometry_type", nullable = false)
	public String getGeometryType() {
		return geometryType;
	}

	public void setGeometryType(String geometryType) {
		this.geometryType = geometryType;
	}

	@Column(name = "title")
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@Transient
	public String getEpsg() {
		return epsg;
	}

	public void setEpsg(String epsg) {
		this.epsg = epsg;
	}

	@Column(name = "id_user", nullable=true)
	public Integer getIdUser() {
		return idUser;
	}

	public void setIdUser(Integer idUser) {
		this.idUser = idUser;
	}

	@Column(name = "description")
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	@Column(name = "submitter_name", nullable = true)
	public String getSubmitterName() {
		return submitterName;
	}

	public void setSubmitterName(String submitterName) {
		this.submitterName = submitterName;
	}

	@Column(name = "submitter_email", nullable = true)
	public String getSubmitterEmail() {
		return submitterEmail;
	}

	public void setSubmitterEmail(String submitterEmail) {
		this.submitterEmail = submitterEmail;
	}
	
	@Column(name = "reference_code", nullable = true)
	public String getReferenceCode() {
		return referenceCode;
	}

	public void setReferenceCode(String referenceCode) {
		this.referenceCode = referenceCode;
	}
	
	@Temporal(TemporalType.TIMESTAMP)
    @Column(name = "insert_time")
	public Date getInsertTime() {
		return insertTime;
	}

	public void setInsertTime(Date insertTime) {
		this.insertTime = insertTime;
	}

	@Temporal(TemporalType.TIMESTAMP)
    @Column(name = "date_change", nullable=true)
	public Date getLastChangeTime() {
		return lastChangeTime;
	}

	public void setLastChangeTime(Date lastChangeTime) {
		this.lastChangeTime = lastChangeTime;
	}
	
	@Column(name = "c_status_curr", nullable = false)
	public String getCurrentStatusCod() {
		return currentStatusCod;
	}

	public void setCurrentStatusCod(String currentStatusCod) {
		this.currentStatusCod = currentStatusCod;
	}

	@Column(name = "status_curr_name", nullable = false)
	public String getCurrentStatusName() {
		return currentStatusName;
	}

	public void setCurrentStatusName(String currentStatusName) {
		this.currentStatusName = currentStatusName;
	}
	
	@Column(name = "dep_name", nullable = true)
	public String getDepartmentName() {
		return departmentName;
	}

	public void setDepartmentName(String departmentName) {
		this.departmentName = departmentName;
	}

	@Column(name = "dep_cod", nullable = true)
	public String getDepartmentCod() {
		return departmentCod;
	}

	public void setDepartmentCod(String departmentCod) {
		this.departmentCod = departmentCod;
	}

	@Column(name = "inserted_by_muni_name", nullable = true)
	public String getInsertedByMuniName() {
		return insertedByMuniName;
	}

	public void setInsertedByMuniName(String insertedByMuniName) {
		this.insertedByMuniName = insertedByMuniName;
	}

	@Column(name = "inserted_by_muni_cod", nullable = true)
	public String getInsertedByMuniCod() {
		return insertedByMuniCod;
	}

	public void setInsertedByMuniCod(String insertedByMuniCod) {
		this.insertedByMuniCod = insertedByMuniCod;
	}

	@Column(name = "from_sit_muni", nullable = true)
	public boolean isFromSITMuni() {
		return fromSITMuni;
	}

	public void setFromSITMuni(boolean fromSITMuni) {
		this.fromSITMuni = fromSITMuni;
	}
	
	@Column(name = "date_event")
	public Date getEventDate() {
		return eventDate;
	}

	public void setEventDate(Date eventDate) {
		this.eventDate = eventDate;
		if (eventDate != null) {
			this.setEventDateStr(new SimpleDateFormat(Constants.DEFAULT_DATE_FORMAT).format(eventDate));
		}
	}

	@Column(name = "phone_num")
	public String getPhoneNum() {
		return phoneNum;
	}

	public void setPhoneNum(String phoneNum) {
		this.phoneNum = phoneNum;
	}

	@Column(name = "mobile_num")
	public String getMobileNum() {
		return mobileNum;
	}

	public void setMobileNum(String mobileNum) {
		this.mobileNum = mobileNum;
	}
	
//	@Transient
//	public void setEventDateStrFromDate() {
//		if (eventDate != null) {
//			this.setEventDateStr(new SimpleDateFormat(Constants.DEFAULT_DATE_FORMAT).format(eventDate));
//		}
//	}

	@Transient
	public String getEventDateStr() {
		return eventDateStr;
	}

	public void setEventDateStr(String eventDateStr) {
		this.eventDateStr = eventDateStr;
	}
}