package com.blueocean.tpf.common.component.excel.service.impl;

import java.io.File;
import java.util.List;

import org.springframework.stereotype.Service;

import com.blueocean.tpf.common.component.excel.model.CellMapper;
import com.blueocean.tpf.common.component.excel.model.ExcelEngine;
import com.blueocean.tpf.common.component.excel.model.ExcelResult;
import com.blueocean.tpf.common.component.excel.reader.IExcelReader;
import com.blueocean.tpf.common.component.excel.reader.impl.DefaultRowReader;
import com.blueocean.tpf.common.component.excel.service.ExcelReaderService;
@Service("excelReaderService")
public class ExcelReaderServiceImpl implements ExcelReaderService{
	private ExcelEngine excelEngine = ExcelEngine.getEngine();
	@Override
	public ExcelResult readExcel(File file, CellMapper mapper, Integer titleRow) {
		return readExcel(file.getAbsolutePath(), mapper, titleRow,null);
	}
	@Override
	public ExcelResult readExcel(String fileName, CellMapper mapper, Integer titleRow) {
		return readExcel(fileName, mapper, titleRow,null);
	}

	@Override
	public ExcelResult readExcel(String fileName, CellMapper mapper, Integer startRow, Integer endRow) {
		IExcelReader reader = excelEngine.getReader(fileName);
		reader.setRowReader(new DefaultRowReader());
		return reader.read(fileName, 0,startRow,endRow,mapper);
	}
	@Override
	public List<Object> readExcel2Objs(String path, Class clz, int readLine, int tailLine) {
		return null;
	}

	@Override
	public List<Object> readExcel2Objs(String path, Class clz) {
		return null;
	} 
}
