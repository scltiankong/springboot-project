package com.blueocean.tpf.common.component.excel.reader.impl;

import com.blueocean.tpf.common.component.excel.model.CellMapper;

public abstract class Common {
	protected Integer bindSheet = 0;
	protected int sheetIndex = -1;
	protected int cellIndex;
	protected boolean isCell;
	protected int minRow = 1;//默认从第一行开始，表头为第0行
	protected long maxRow = Long.MAX_VALUE;  
	protected int curCol = 0;
	protected CellMapper mapper;
	protected void init(Integer sheetIndex, Integer startRow, Integer endRow, CellMapper mapper) {
		try {
			this.bindSheet = sheetIndex;
		} catch (Exception e) {}
		try {
			this.minRow = startRow;
		} catch (Exception e) {}
		try {
			this.maxRow = endRow;
		} catch (Exception e) {}
		this.mapper = mapper;
	}

	protected boolean sheetAccess() {
		if (bindSheet == null || sheetIndex == bindSheet) {
			return true;
		}
		return false;
	}
	protected boolean isAccess(int curRow){
        if(curRow >= minRow && curRow <= maxRow){  
            return true;  
        }  
        return false;  
    }
}
