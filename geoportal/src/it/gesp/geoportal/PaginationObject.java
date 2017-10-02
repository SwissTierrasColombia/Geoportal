package it.gesp.geoportal;

import java.util.List;

public class PaginationObject<T> {
	public int draw;
	public long recordsTotal;
	public long recordsFiltered;
	public List<T> data;
	
	public int getDraw() {
		return draw;
	}
	public void setDraw(int draw) {
		this.draw = draw;
	}
	public long getRecordsTotal() {
		return recordsTotal;
	}
	public void setRecordsTotal(long recordsTotal) {
		this.recordsTotal = recordsTotal;
	}
	public long getRecordsFiltered() {
		return recordsFiltered;
	}
	public void setRecordsFiltered(long recordsFiltered) {
		this.recordsFiltered = recordsFiltered;
	}
	public List<T> getData() {
		return data;
	}
	public void setData(List<T> data) {
		this.data = data;
	}
	
	public static PaginationObject createFromList(List list ) {
		PaginationObject po = new PaginationObject();
		po.setData(list);
		po.setRecordsTotal(list.size());
		po.setRecordsFiltered(list.size());
		
		return po;
	}
	
	public static PaginationObject createFromPaginationResult(PaginationResult pr ) {
		PaginationObject po = new PaginationObject();
		po.setData(pr.getData());
		po.setRecordsTotal(pr.getTotalSize());
		po.setRecordsFiltered(pr.getTotalSize());
		
		return po;
		
	}
}