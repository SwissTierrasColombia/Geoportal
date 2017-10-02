package it.gesp.geoportal.dao.dto;

import java.util.Date;

public class VWAlertSITRead {
	private Integer id_alert;
	private Integer id_alert_type;
	private String type_name;
	private String title;
	private String reference_code;
	private String description;
	private String submitter_name;
	private String submitter_email;
	private Date insert_time;
	private String c_status_curr;
	private String status_curr_name;
	private String dep_name;
	private String dep_cod;
	private String inserted_by_muni_name;
	private String inserted_by_muni_cod;
	private Boolean from_sit_muni;
	private String wkt_geometry;
	
	private Date date_event;
	private String phone_num;
	private String mobile_num;
	
	public Integer getId_alert() {
		return id_alert;
	}
	public void setId_alert(Integer id_alert) {
		this.id_alert = id_alert;
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
	
	public Integer getId_alert_type() {
		return id_alert_type;
	}
	public void setId_alert_type(Integer id_alert_type) {
		this.id_alert_type = id_alert_type;
	}
	public Date getInsert_time() {
		return insert_time;
	}
	public void setInsert_time(Date insert_time) {
		this.insert_time = insert_time;
	}
	
	public String getSubmitter_name() {
		return submitter_name;
	}
	public void setSubmitter_name(String submitter_name) {
		this.submitter_name = submitter_name;
	}
	public String getSubmitter_email() {
		return submitter_email;
	}
	public void setSubmitter_email(String submitter_email) {
		this.submitter_email = submitter_email;
	}
	public String getDep_name() {
		return dep_name;
	}
	public void setDep_name(String dep_name) {
		this.dep_name = dep_name;
	}
	public String getDep_cod() {
		return dep_cod;
	}
	public void setDep_cod(String dep_cod) {
		this.dep_cod = dep_cod;
	}
	public Boolean getFrom_sit_muni() {
		return from_sit_muni;
	}
	public void setFrom_sit_muni(Boolean from_sit_muni) {
		this.from_sit_muni = from_sit_muni;
	}
	public String getType_name() {
		return type_name;
	}
	public void setType_name(String type_name) {
		this.type_name = type_name;
	}
	public String getC_status_curr() {
		return c_status_curr;
	}
	public void setC_status_curr(String c_status_curr) {
		this.c_status_curr = c_status_curr;
	}
	public String getStatus_curr_name() {
		return status_curr_name;
	}
	public void setStatus_curr_name(String status_curr_name) {
		this.status_curr_name = status_curr_name;
	}
	public String getWkt_geometry() {
		return wkt_geometry;
	}
	public void setWkt_geometry(String wkt_geometry) {
		this.wkt_geometry = wkt_geometry;
	}
	public Date getDate_event() {
		return date_event;
	}
	public void setDate_event(Date date_event) {
		this.date_event = date_event;
	}
	public String getPhone_num() {
		return phone_num;
	}
	public void setPhone_num(String phone_num) {
		this.phone_num = phone_num;
	}
	public String getMobile_num() {
		return mobile_num;
	}
	public void setMobile_num(String mobile_num) {
		this.mobile_num = mobile_num;
	}
	public String getInserted_by_muni_name() {
		return inserted_by_muni_name;
	}
	public void setInserted_by_muni_name(String inserted_by_muni_name) {
		this.inserted_by_muni_name = inserted_by_muni_name;
	}
	public String getInserted_by_muni_cod() {
		return inserted_by_muni_cod;
	}
	public void setInserted_by_muni_cod(String inserted_by_muni_cod) {
		this.inserted_by_muni_cod = inserted_by_muni_cod;
	}
	public String getReference_code() {
		return reference_code;
	}
	public void setReference_code(String reference_code) {
		this.reference_code = reference_code;
	}
	
}
