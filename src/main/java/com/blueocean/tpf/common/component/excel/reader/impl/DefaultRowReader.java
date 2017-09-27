package com.blueocean.tpf.common.component.excel.reader.impl;

import com.blueocean.tpf.common.component.excel.model.CellMapper;
import com.blueocean.tpf.common.component.excel.reader.IExcelReader;
import com.blueocean.tpf.common.component.excel.reader.IRowReader;

public class DefaultRowReader implements IRowReader{
	 /* 业务逻辑实现方法 
     * @see com.eprosun.util.excel.IRowReader#getRows(int, int, java.util.List) 
     */  
	@Override
	public void getRows(IExcelReader excelReader,int curRow,CellMapper mapper) {
		AbstractExcelReader reader = (AbstractExcelReader) excelReader;
        try {
			System.out.print(reader.sheetIndex+" ");  
			System.out.print(curRow+" ");  
			System.out.println(reader.getRowData());  
		} catch (Exception e) {
			e.printStackTrace();
			reader.result.getDatas().add(curRow);
//			System.out.print(reader.sheetIndex+" ");  
//			System.out.print(curRow+" ");  
//			System.out.println(reader.getRowData());  
		}
	}

	@Override
	public void ops(CellMapper mapper) {
		System.err.println(mapper);
	}
}
