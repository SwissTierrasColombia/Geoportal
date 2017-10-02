package it.gesp.geoportal.dao.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

@Entity
@Table(name = "alert_types", uniqueConstraints = { @UniqueConstraint(columnNames = { "id_alert_type" }) })
public class AlertType {

	private int idAlertType;
	private String name;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_alert_type", nullable = false, unique = true)
	public int getIdAlertType() {
		return idAlertType;
	}

	public void setIdAlertType(int idAlertType) {
		this.idAlertType = idAlertType;
	}
	
	@Column(name = "name", nullable = false)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}