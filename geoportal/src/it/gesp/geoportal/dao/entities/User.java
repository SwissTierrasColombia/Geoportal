package it.gesp.geoportal.dao.entities;

import it.gesp.geoportal.GsonExclude;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;

@Entity
@Table(name = "users", uniqueConstraints = { @UniqueConstraint(columnNames = { "id_user" }) })
public class User {

	private int idUser;
	private String username;
	private String password;
	
	@GsonExclude
	private boolean deleted;
	
	private boolean disabled;
	
	private Role role;
	private List<String> permissionCodList;

//	@ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
//	@JoinTable(name = "user_permission", joinColumns = { @JoinColumn(name = "id_user", nullable = false, updatable = false) }, inverseJoinColumns = { @JoinColumn(name = "id_permission", nullable = false, updatable = false) })
//	//@BatchSize(size = 5)
//	// Look: http://www.theotherian.com/2013/07/hibernate-joins-maxresults.html
//	private Set<Permission> permissions = new HashSet<Permission>();

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_user", nullable = false, unique = true, length = 11)
	public int getIdUser() {
		return idUser;
	}

	public void setIdUser(int idUser) {
		this.idUser = idUser;
	}

	@Column(name = "username", length = 20, nullable = false)
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	@Column(name = "password_hash", nullable = false)
	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@ManyToOne()
	@JoinColumn(name="id_role", nullable = true)
	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	@Transient
	public List<String> getPermissionCodList() {
		return permissionCodList;
	}

	public void setPermissionCodList(List<String> permissionCodList) {
		this.permissionCodList = permissionCodList;
	}

	@Column(name = "f_deleted")
	public boolean isDeleted() {
		return deleted;
	}

	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}

	@Column(name = "f_disabled")
	public boolean isDisabled() {
		return disabled;
	}

	public void setDisabled(boolean disabled) {
		this.disabled = disabled;
	}

//	public List<String> getPermissionCodList() {
//		//match, get the modules
//		Set<Permission> permissions = this.getPermissions();
//		List<String> permissionCodList = new ArrayList<String>();
//
//		for (Permission p : permissions) {
//			permissionCodList.add(p.getCodPermission());
//		}
//		return permissionCodList;
//	}

	
}