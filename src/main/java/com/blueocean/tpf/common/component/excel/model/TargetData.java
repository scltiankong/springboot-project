package com.blueocean.tpf.common.component.excel.model;

import java.util.List;
import java.util.Set;

/**
 * 数据导入
 * @author scl
 *
 */
public class TargetData {
	
	private String table;
	private Set<String> properties;
	private List<?> datas;
	
	
	public TargetData() {}
	public TargetData(String table, Set<String> properties, List<?> datas) {
		super();
		this.table = table;
		this.properties = properties;
		this.datas = datas;
	}
	public String getTable() {
		return table;
	}
	public void setTable(String table) {
		this.table = table;
	}
	public Set<String> getProperties() {
		return properties;
	}
	public void setProperties(Set<String> properties) {
		this.properties = properties;
	}
	public List<?> getDatas() {
		return datas;
	}
	public void setDatas(List<?> datas) {
		this.datas = datas;
	}
}
