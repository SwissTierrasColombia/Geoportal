package it.gesp.geoportal.dao.entities;

import java.io.Serializable;

import javax.persistence.Embeddable;
import javax.persistence.ManyToOne;

@Embeddable
public class LayerGroupLayerId implements Serializable {

	private LayerGroup layerGroup;
    private Layer layer;
    
	@ManyToOne
	public LayerGroup getLayerGroup() {
		return layerGroup;
	}
 
	public void setLayerGroup(LayerGroup layerGroup) {
		this.layerGroup = layerGroup;
	}
 
	@ManyToOne
	public Layer getLayer() {
		return layer;
	}
 
	public void setLayer(Layer layer) {
		this.layer = layer;
	}
 
	public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
 
        LayerGroupLayerId that = (LayerGroupLayerId) o;
 
        if (layerGroup != null ? !layerGroup.equals(that.layerGroup) : that.layerGroup != null) return false;
        if (layer != null ? !layer.equals(that.layer) : that.layer != null)
            return false;
 
        return true;
    }
 
    public int hashCode() {
        int result;
        result = (layerGroup != null ? layerGroup.hashCode() : 0);
        result = 31 * result + (layer != null ? layer.hashCode() : 0);
        return result;
    }
	
}