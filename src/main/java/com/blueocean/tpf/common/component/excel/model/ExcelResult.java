package com.blueocean.tpf.common.component.excel.model;

import java.util.List;

/**
 * 读取excel的结果
 * @author scl
 *
 */
public class ExcelResult {
	private Object tipMsg;
	private List<Object> datas;
	public Object getTipMsg() {
		return tipMsg;
	}
	public void setTipMsg(Object tipMsg) {
		this.tipMsg = tipMsg;
	}
	public List<Object> getDatas() {
		return datas;
	}
	public void setDatas(List<Object> datas) {
		this.datas = datas;
	}
}
