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
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

@Entity
@Table(name = "layergroups", uniqueConstraints = { @UniqueConstraint(columnNames = { "id_layergroup" }) })
public class LayerGroup {

	private int idLayerGroup;
	private String layerGroupName;
	private int idMap;
	private long position;
	private boolean background;
	
	@GsonExclude
	private Set<LayerGroupLayer> layerGroupLayer = new HashSet<LayerGroupLayer>(0);
	
	
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "pk.layerGroup", cascade=CascadeType.ALL)
	public Set<LayerGroupLayer> getLayerGroupLayer() {
		return layerGroupLayer;
	}

	public void setLayerGroupLayer(Set<LayerGroupLayer> layerGroupLayer) {
		this.layerGroupLayer = layerGroupLayer;
	}
	

//	@ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
//	@JoinTable(name = "user_permission", joinColumns = { @JoinColumn(name = "id_user", nullable = false, updatable = false) }, inverseJoinColumns = { @JoinColumn(name = "id_permission", nullable = false, updatable = false) })
//	//@BatchSize(size = 5)
//	// Look: http://www.theotherian.com/2013/07/hibernate-joins-maxresults.html
//	private Set<Permission> permissions = new HashSet<Permission>();

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_layergroup", nullable = false, unique = true)
	public int getIdLayerGroup() {
		return idLayerGroup;
	}

	public void setIdLayerGroup(int idLayerGroup) {
		this.idLayerGroup = idLayerGroup;
	}

	@Column(name = "s_name", nullable = false)
	public String getLayerGroupName() {
		return layerGroupName;
	}

	public void setLayerGroupName(String layerGroupName) {
		this.layerGroupName = layerGroupName;
	}

	@Column(name = "id_map", nullable = false)
	public int getIdMap() {
		return idMap;
	}

	public void setIdMap(int idMap) {
		this.idMap = idMap;
	}

	@Column(name = "position", nullable = false)
	public long getPosition() {
		return position;
	}

	public void setPosition(long position) {
		this.position = position;
	}

	@Column(name = "background", nullable = false)
	public boolean isBackground() {
		return background;
	}

	public void setBackground(boolean background) {
		this.background = background;
	}
	
}