package com.blueocean.tpf.common.component.excel.reader;

import java.io.InputStream;

import com.blueocean.tpf.common.component.excel.model.CellMapper;
import com.blueocean.tpf.common.component.excel.model.ExcelResult;

public interface IExcelReader {
	void setRowReader(IRowReader rowReader);
	
	ExcelResult read(String fileName);
	
	ExcelResult read(String fileName,Integer sheetIndex);
	
	ExcelResult read(String fileName,Integer sheetIndex,Integer startRow,Integer endRow);
	
	ExcelResult read(String fileName,CellMapper mapper);
	
	ExcelResult read(String fileName,Integer sheetIndex,CellMapper mapper);
	
	ExcelResult read(String fileName,Integer sheetIndex,Integer startRow,Integer endRow,CellMapper mapper);
	
	ExcelResult read(InputStream inputStream);
	
	ExcelResult read(InputStream inputStream,Integer sheetIndex);
	
	ExcelResult read(InputStream inputStream,Integer sheetIndex,Integer startRow,Integer endRow);
	
	ExcelResult read(InputStream inputStream,CellMapper mapper);
	
	ExcelResult read(InputStream inputStream,Integer sheetIndex,CellMapper mapper);
	
	ExcelResult read(InputStream inputStream,Integer sheetIndex,Integer startRow,Integer endRow,CellMapper mapper);
	
}
