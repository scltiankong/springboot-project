package com.blueocean.tpf.excel.valid;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ExcelValidRule  extends HashMap<Integer, Validator <Object, String>>{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private static final String NO_CHECK_ROW = "nocheckrows";
	private static final String NO_CHECK_CELL = "nocheckcells";
	private Map<Object, List<Integer>> filters = new HashMap<>();

	public static ExcelValidRule createRule(){
		return new ExcelValidRule();
	}
	/**
	 * 添加校验规则
	 * @param index
	 * @param pre
	 * @return
	 */
	public ExcelValidRule addRule(Integer index,Validator <Object, String> valid){
		put(index,valid);
		return this;
	}
	public ExcelValidRule setNoCheckRows(Integer...rows){
		return setNoCheckRows(Arrays.asList(rows));
	}
	public ExcelValidRule setNoCheckRows4Sheet(Integer sheet,Integer...rows){
		return setNoCheckRows(sheet,Arrays.asList(rows));
	}
	public ExcelValidRule setNoCheckRows(List<Integer> rows){
		filters.put(NO_CHECK_ROW, rows);
		return this;
	}
	public ExcelValidRule setNoCheckRows(Integer sheet,List<Integer> rows){
		filters.put(sheet, rows);
		return this;
	}
	public List<Integer> noCheckRows(){
		List<Integer> noCheckRows = filters.get(NO_CHECK_ROW);
		if (noCheckRows == null) {
			noCheckRows = new ArrayList<>();
			noCheckRows.add(0);
		}
		return  noCheckRows;
	}
	public List<Integer> noCheckRows(Integer sheet){
		return  filters.get(sheet);
	}
	public ExcelValidRule setNoCheckCells(Integer...cells){
		return setNoCheckRows(Arrays.asList(cells));
	}
	public ExcelValidRule setNoCheckCells(List<Integer> cells){
		filters.put(NO_CHECK_ROW, cells);
		return this;
	}
	public List<Integer> noCheckCells(){
		return  filters.get(NO_CHECK_CELL);
	}
	public List<Integer> noCheckCells(Integer sheet){
		return  filters.get(sheet);
	}
	public String valid(Integer index,Object value){
		Validator<Object, String> validator = get(index);
		if (validator == null) {
			return null;
		}
		String msg = validator.apply(value);
		return msg;
	}
}
