package it.gesp.geoportal.dao.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

@Entity
@Table(name = "alerts_settings", uniqueConstraints = { @UniqueConstraint(columnNames = { "id" }) })
public class AlertSetting {

	private int idAlertSetting;
	private String configKey;
	private String configValue;
	
	public AlertSetting() {
		
	}
	
	public AlertSetting(String key, String value) {
		this.configKey = key;
		this.configValue = value;
	}
	
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false, unique = true)
	public int getIdAlertSetting() {
		return idAlertSetting;
	}

	public void setIdAlertSetting(int idAlertSetting) {
		this.idAlertSetting = idAlertSetting;
	}

	@Column(name = "key", unique=true, nullable=false)
	public String getConfigKey() {
		return configKey;
	}

	public void setConfigKey(String configKey) {
		this.configKey = configKey;
	}

	@Column(name = "value", unique=true, nullable=false)
	public String getConfigValue() {
		return configValue;
	}

	public void setConfigValue(String configValue) {
		this.configValue = configValue;
	}
}