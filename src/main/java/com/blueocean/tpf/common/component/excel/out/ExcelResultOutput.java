package com.blueocean.tpf.common.component.excel.out;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.blueocean.tpf.common.component.excel.model.CellMapper;
import com.blueocean.tpf.common.component.excel.model.ExcelResult;

public class ExcelResultOutput implements ExcelOutputSystem<List<String>>{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private ExcelResult result;
	private Map<Integer, String> map;
	List<Object> datas = new ArrayList<>();
	public ExcelResultOutput(CellMapper cellMapper) {
		result = new ExcelResult();
		result.setDatas(datas);
		this.map = cellMapper.getMap();
	}
	@Override
	public void output(List<String> data) {
		Map<String, Object> obj = new HashMap<>();
		for (int i = 0; i < data.size(); i++) {
			obj.put(map.get(i), data.get(i));
		}
		datas.add(obj);
	}
	public ExcelResult getResult() {
		return result;
	}
}
