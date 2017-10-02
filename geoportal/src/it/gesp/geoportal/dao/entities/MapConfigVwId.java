package it.gesp.geoportal.dao.entities;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class MapConfigVwId implements Serializable {
    
    /**
	 * 
	 */
	private static final long serialVersionUID = 367787292361604432L;
	private int idLayerGroup;
    private int idLayer;

	@Column(name = "id_layergroup", nullable = false)
	public int getIdLayerGroup() {
		return idLayerGroup;
	}

	public void setIdLayerGroup(int idLayerGroup) {
		this.idLayerGroup = idLayerGroup;
	}

	@Column(name = "id_layer", nullable = false)
	public int getIdLayer() {
		return idLayer;
	}

	public void setIdLayer(int idLayer) {
		this.idLayer = idLayer;
	}

}