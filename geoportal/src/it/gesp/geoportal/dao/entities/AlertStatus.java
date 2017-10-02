package it.gesp.geoportal.dao.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

@Entity
@Table(name = "alert_status", uniqueConstraints = { @UniqueConstraint(columnNames = { "c_status" }) })
public class AlertStatus {

	private String statusCode;
	private String name;

	@Id
	@Column(name = "c_status", nullable = false, unique = true)
	public String getStatusCode() {
		return statusCode;
	}

	public void setStatusCode(String statusCode) {
		this.statusCode = statusCode;
	}

	@Column(name = "name", nullable = false)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public boolean equals(Object obj) {
		if (!(obj instanceof AlertStatus))
			return false;
		if (obj == this)
			return true;

		AlertStatus as = (AlertStatus) obj;

		if (this.getStatusCode().equals(as.getStatusCode()))
			return true;

		return false;
	}
}