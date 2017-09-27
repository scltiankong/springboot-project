package com.blueocean.tpf.common.component.excel.model;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;

/**
 * 单元格映射实体类
 * @author scl
 *
 */
public class CellMapper{
	private String tableName;
	private Map<Integer, String> map;
	private Map<Integer, Function<Object, Object>> cellValueHandle;
	private Set<String> properties;
	private CellMapper(String tableName) {
		map = new HashMap<Integer, String>();
		properties = new HashSet<>();
		this.tableName = tableName;
	}
	public static CellMapper buildMapper(String tableName){
		return new CellMapper(tableName);
	}
	public Map<Integer, String> getMap() {
		return map;
	}
	public CellMapper addMapping(Integer cellIndex,String property){
		map.put(cellIndex, property);
		properties.add(property);
		return this;
	}
	public CellMapper setCellHandle(Integer cellIndex,Function<Object, Object> handle){
		if (cellValueHandle == null) {
			cellValueHandle = new HashMap<>();
		}
		cellValueHandle.put(cellIndex, handle);
		return this;
	}
	public Map<Integer, Function<Object, Object>> getCellValueHandle() {
		return cellValueHandle;
	}
	public Set<String> getProperties(){
		return properties;
	}
	public String getTableName() {
		return tableName;
	}
}
