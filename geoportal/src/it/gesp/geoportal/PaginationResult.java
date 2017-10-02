package it.gesp.geoportal;

import java.util.List;

public class PaginationResult<T> {
	
	public PaginationResult() {
		
	};
	
	public PaginationResult(List<T> list) {
		this.data = list;
		this.setTotalSize(list.size());
	};
	
	public List<T> data;
	public long totalSize;
	
	public List<T> getData() {
		return data;
	}
	public void setData(List<T> data) {
		this.data = data;
	}
	public long getTotalSize() {
		return totalSize;
	}
	public void setTotalSize(long totalSize) {
		this.totalSize = totalSize;
	}
	
}