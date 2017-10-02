package it.gesp.geoportal.dao.entities;

import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.UniqueConstraint;

@Entity
@Table(name = "alerts", uniqueConstraints = { @UniqueConstraint(columnNames = { "id_alert" }) })
public class Alert {

	private int idAlert;
	private User user;
	private String title;
	private String description;
	private String submitterName;
	private String submitterEmail;
	private String referenceCode;
	private AlertStatus currentStatus;
	private List<AlertStatus> historyAlertStatus;
	private AlertType alertType;
	private Date insertTime;
	private String geometryType;
	private long geometryId;
	
	private String departmentName;
	private String departmentCod;
	private String insertedByMuniName;
	private String insertedByMuniCod;
	
	private Date eventDate;
	private String phoneNum;
	private String mobileNum;
	
	private boolean fromSITMuni;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_alert", nullable = false, unique = true)
	public int getIdAlert() {
		return idAlert;
	}

	public void setIdAlert(int idAlert) {
		this.idAlert = idAlert;
	}

	@ManyToOne
	@JoinColumn(name="id_user", nullable=true)
	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
	
	@Column(name = "title", nullable=true)
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}
	
	@Column(name = "description", length = 20, nullable = true)
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
	
	@ManyToOne
	@JoinColumn(name="c_status_curr")
	public AlertStatus getCurrentStatus() {
		return currentStatus;
	}

	public void setCurrentStatus(AlertStatus currentStatus) {
		this.currentStatus = currentStatus;
	}
	
	@ManyToOne
	@JoinColumn(name="id_alert_type")
	public AlertType getAlertType() {
		return alertType;
	}

	public void setAlertType(AlertType alertType) {
		this.alertType = alertType;
	}
	
	@Temporal(TemporalType.TIMESTAMP)
    @Column(name = "insert_time", nullable = false)
	public Date getInsertTime() {
		return insertTime;
	}

	public void setInsertTime(Date insertTime) {
		this.insertTime = insertTime;
	}
	
	@Column(name = "geometry_type", nullable = false)
	public String getGeometryType() {
		return geometryType;
	}

	public void setGeometryType(String geometryType) {
		this.geometryType = geometryType;
	}

	@Column(name = "id_geom", nullable = false)
	public long getGeometryId() {
		return geometryId;
	}

	public void setGeometryId(long geometryId) {
		this.geometryId = geometryId;
	}

	@ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@JoinTable(name = "alert_status_history", joinColumns = { @JoinColumn(name = "id_alert") }, inverseJoinColumns = { @JoinColumn(name = "c_status") })
	//@BatchSize(size = 5)
	// Look: http://www.theotherian.com/2013/07/hibernate-joins-maxresults.html
	public List<AlertStatus> getHistoryAlertStatus() {
		return historyAlertStatus;
	}

	public void setHistoryAlertStatus(List<AlertStatus> historyAlertStatus) {
		this.historyAlertStatus = historyAlertStatus;
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
	
}