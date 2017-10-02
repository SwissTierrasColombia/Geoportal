package it.gesp.geoportal.dao.entities;

import it.gesp.geoportal.GsonExclude;

import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

@Entity
@Table(name = "permissions", uniqueConstraints = { @UniqueConstraint(columnNames = { "id_permission" }) })
public class Permission {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_permission", nullable = false, unique = true, length = 11)
	private int idPermission;

	@Column(name = "c_permission", length = 20, nullable = false)
	private String codPermission;

	@Column(name = "description", length = 50, nullable = true)
	private String description;

	@Column(name = "description_en", length = 50, nullable = true)
	private String enDescription;
	
	@Column(name = "description_es", length = 50, nullable = true)
	private String esDescription;
	
	@GsonExclude
	@ManyToMany(mappedBy = "permissions")
	private Set<Role> roles;
	
	public int getIdPermission() {
		return idPermission;
	}

	public void setIdPermission(int idPermission) {
		this.idPermission = idPermission;
	}

	public String getCodPermission() {
		return codPermission;
	}

	public void setCodPermission(String codPermission) {
		this.codPermission = codPermission;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Set<Role> getRoles() {
		return roles;
	}

	public void setRoles(Set<Role> roles) {
		this.roles = roles;
	}

	public String getEnDescription() {
		return enDescription;
	}

	public void setEnDescription(String enDescription) {
		this.enDescription = enDescription;
	}

	public String getEsDescription() {
		return esDescription;
	}

	public void setEsDescription(String esDescription) {
		this.esDescription = esDescription;
	}

}