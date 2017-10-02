package it.gesp.geoportal.dao.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

@Entity
@Table(name = "departments_permissions_mapping", uniqueConstraints = { @UniqueConstraint(columnNames = { "id" }) })
public class DepartmentPermissionMapping {

	private int id;
	private String codPermission;
	private String identifValue;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false, unique = true)
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	
	@Column(name = "c_permission", length = 20, nullable = false)
	public String getCodPermission() {
		return codPermission;
	}
	public void setCodPermission(String codPermission) {
		this.codPermission = codPermission;
	}
	
	@Column(name = "identif_value", nullable = true)
	public String getIdentifValue() {
		return identifValue;
	}
	public void setIdentifValue(String identifValue) {
		this.identifValue = identifValue;
	}

}