package it.gesp.geoportal.dao.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

@Entity
@Table(name = "alerts_intersections", uniqueConstraints = { @UniqueConstraint(columnNames = { "id" }) })
public class AlertIntersection {

	private int id;
	private String name;
	private Layer referenceLayer;
	private String keyColumnName;
	private String descColumnName;
	private String geomColumnName;
	private boolean active;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false, unique = true)
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	@ManyToOne(fetch=FetchType.EAGER)
	@JoinColumn(name="id_layer", nullable=true)
	public Layer getReferenceLayer() {
		return referenceLayer;
	}

	public void setReferenceLayer(Layer referenceLayer) {
		this.referenceLayer = referenceLayer;
	}

	@Column(name = "name", nullable = false, unique = true)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "key_column_name", nullable = true)
	public String getKeyColumnName() {
		return keyColumnName;
	}

	public void setKeyColumnName(String keyColumnName) {
		this.keyColumnName = keyColumnName;
	}

	@Column(name = "desc_column_name", nullable = true)
	public String getDescColumnName() {
		return descColumnName;
	}

	public void setDescColumnName(String descColumnName) {
		this.descColumnName = descColumnName;
	}

	@Column(name = "geom_column_name", nullable = true)
	public String getGeomColumnName() {
		return geomColumnName;
	}

	public void setGeomColumnName(String geomColumnName) {
		this.geomColumnName = geomColumnName;
	}

	@Column(name = "active", nullable = true)
	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}
	
}