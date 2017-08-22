package com.blueocean.tpf.common.data;

import java.util.List;
import java.util.Map;


/**
 * easy ui grid page result
 * 
 * @author kangminggang
 *
 */
public class PageQueryResult{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -2716645500370259904L;
	
	private int total;
	private Object rows;
	private int size;
	private List content;
//	private Map<String, List<Object>> map;
	public int getSize() {
		return size;
	}

	public void setSize(int size) {
		this.size = size;
	}

	public List getContent() {
		return content;
	}

	public void setContent(List content) {
		this.content = content;
	}

	public PageQueryResult(int total, Object rows) {

		this.total = total;
		this.rows = rows;
	}
	/*public PageQueryResult(int total, Map<String, List<Object>> map) {

		this.total = total;
		this.map = map;
	}*/

	public int getTotal() {
	
		return total;
	}
	
	public void setTotal(int total) {
	
		this.total = total;
	}
	
	public Object getRows() {
	
		return rows;
	}
	
	public void setRows(Object rows) {
	
		this.rows = rows;
	}
	
	
//	public Map<String, List<Object>> getMap() {
//		return map;
//	}
//
//	public void setMap(Map<String, List<Object>> map) {
//		this.map = map;
//	}

	public static PageQueryResult getInstance(int total,Object rows){
		return new PageQueryResult(total, rows);
	}
//	public static PageQueryResult getInstances(int total,Map<String, List<Object>> map){
//		return new PageQueryResult(total, map);
//	}
}
