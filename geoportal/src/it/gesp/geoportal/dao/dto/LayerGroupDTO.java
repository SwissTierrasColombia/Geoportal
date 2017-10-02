package it.gesp.geoportal.dao.dto;

import it.gesp.geoportal.dao.entities.MapConfigVw;

import java.util.ArrayList;
import java.util.List;


public class LayerGroupDTO {

	private int idLayerGroup;
	private String layerGroupName;
	private int idMap;
	private long position;
	private boolean backgroundGroup;
	private List<LayerDTO> layerList = new ArrayList<LayerDTO>();
	
	public int getIdLayerGroup() {
		return idLayerGroup;
	}
	public void setIdLayerGroup(int idLayerGroup) {
		this.idLayerGroup = idLayerGroup;
	}
	public String getLayerGroupName() {
		return layerGroupName;
	}
	public void setLayerGroupName(String layerGroupName) {
		this.layerGroupName = layerGroupName;
	}
	public int getIdMap() {
		return idMap;
	}
	public void setIdMap(int idMap) {
		this.idMap = idMap;
	}
	public List<LayerDTO> getLayerList() {
		return layerList;
	}
	public void setLayerList(List<LayerDTO> layerList) {
		this.layerList = layerList;
	}
	
	public static List <LayerGroupDTO> createGroupsAndLayersDTO(List<MapConfigVw> list) {
		List<LayerGroupDTO> result = new ArrayList<LayerGroupDTO>();
		
		List<Integer> groupIds = new ArrayList<Integer>();
		
		for (MapConfigVw mc : list) {
			if (!groupIds.contains(mc.getId().getIdLayerGroup())) {
				groupIds.add(mc.getId().getIdLayerGroup());
			}
		}
		
		for(int groupId : groupIds) {
			LayerGroupDTO lgDTO = LayerGroupDTO.createLayerGroupDTOFromMapConfigVw(list, groupId);
			result.add(lgDTO);
		}
		
		return result;
		
	}
	
	private static LayerGroupDTO createLayerGroupDTOFromMapConfigVw(List<MapConfigVw> list, int idLayerGroup) {
		LayerGroupDTO lgDTO = new LayerGroupDTO();
		
		boolean groupAdded = false;
		
		for (MapConfigVw mc : list) {
			if (idLayerGroup != mc.getId().getIdLayerGroup()) continue;
			
			if (!groupAdded) {
				lgDTO = new LayerGroupDTO();
				
				lgDTO.setIdLayerGroup(mc.getId().getIdLayerGroup());
				lgDTO.setIdMap(mc.getIdMap());
				lgDTO.setLayerGroupName(mc.getLayerGroupName());
				lgDTO.setPosition(mc.getLayerGroupPosition());
				lgDTO.setBackgroundGroup(mc.getBackgroundGroup());
				
				groupAdded = true;
			}
			
			//Add layer (if a layer is associated to the layergroup...)
			LayerDTO lay = LayerDTO.parseLayerDTOFromMapConfig(mc);
			
			if (lay != null) {
				lgDTO.getLayerList().add(lay);
			}
		}
		
		return lgDTO;
	}
	public long getPosition() {
		return position;
	}
	public void setPosition(long position) {
		this.position = position;
	}
	public boolean isBackgroundGroup() {
		return backgroundGroup;
	}
	public void setBackgroundGroup(boolean background) {
		this.backgroundGroup = background;
	}
}