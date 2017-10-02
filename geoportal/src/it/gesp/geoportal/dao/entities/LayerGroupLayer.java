package it.gesp.geoportal.dao.entities;

import javax.persistence.AssociationOverride;
import javax.persistence.AssociationOverrides;
import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@Table(name = "layergroups_layers")
@AssociationOverrides({
	@AssociationOverride(name = "pk.layerGroup", 
		joinColumns = @JoinColumn(name = "id_layergroup")),
	@AssociationOverride(name = "pk.layer", 
		joinColumns = @JoinColumn(name = "id_layer")) })
public class LayerGroupLayer {

	private boolean enabled;
	private long position;
	
	private LayerGroupLayerId pk = new LayerGroupLayerId();
	
	@EmbeddedId
	public LayerGroupLayerId getPk() {
		return pk;
	}
	public void setPk(LayerGroupLayerId pk) {
		this.pk = pk;
	}
	
	@Column(name = "enabled", nullable = false)
	public boolean isEnabled() {
		return enabled;
	}
	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}
	
	@Column(name = "position", nullable = false)
	public long getPosition() {
		return position;
	}
	public void setPosition(long position) {
		this.position = position;
	}
	
	@Transient
	public Layer getLayer() {
		return getPk().getLayer();
	}
	
	@Transient
	public LayerGroup getLayerGroup() {
		return getPk().getLayerGroup();
	}
	
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;
 
		LayerGroupLayer that = (LayerGroupLayer) o;
 
		if (getPk() != null ? !getPk().equals(that.getPk())
				: that.getPk() != null)
			return false;
 
		return true;
	}
 
	public int hashCode() {
		return (getPk() != null ? getPk().hashCode() : 0);
	}
}