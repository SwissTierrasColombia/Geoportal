package it.gesp.geoportal.dao.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

@Entity
@Table(name = "layer_types", uniqueConstraints = { @UniqueConstraint(columnNames = { "id_layer_type" }) })
public class LayerType {

	private int idLayerType;
	private String typeName;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_layer_type", nullable = false, unique = true)
	public int getIdLayerType() {
		return idLayerType;
	}

	public void setIdLayerType(int idLayerType) {
		this.idLayerType = idLayerType;
	}

	@Column(name = "s_type_name", nullable = false)
	public String getTypeName() {
		return typeName;
	}

	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}
	
}