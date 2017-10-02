package it.gesp.geoportal.dao.entities;

import it.gesp.geoportal.GsonExclude;

import java.util.HashSet;
import java.util.Set;

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
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

@Entity
@Table(name = "roles", uniqueConstraints = { @UniqueConstraint(columnNames = { "id_role" }) })
public class Role {

	private int idRole;
	private String roleName;
	private String roleDescription;
	
	@GsonExclude
	private Set<Permission> permissions = new HashSet<Permission>();

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_role", nullable = false, unique = true, length = 11)
	public int getIdRole() {
		return idRole;
	}

	public void setIdRole(int idRole) {
		this.idRole = idRole;
	}

	@Column(name = "role_name", nullable=false)
	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	/*
	 * Rimosso CascadeType = Delete perchè errore di cascade sul delete (da ruoli cercava di cancellare permission)
	 */
	@ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
	@JoinTable(name = "role_permission", joinColumns = { @JoinColumn(name = "id_role", nullable = false, updatable = false) }, inverseJoinColumns = { @JoinColumn(name = "id_permission", nullable = false, updatable = false) })
	//@BatchSize(size = 5)
	// Look: http://www.theotherian.com/2013/07/hibernate-joins-maxresults.html
	public Set<Permission> getPermissions() {
		return permissions;
	}

	public void setPermissions(Set<Permission> permissions) {
		this.permissions = permissions;
	}

	@Column(name = "description")
	public String getRoleDescription() {
		return roleDescription;
	}

	public void setRoleDescription(String roleDescription) {
		this.roleDescription = roleDescription;
	}
}