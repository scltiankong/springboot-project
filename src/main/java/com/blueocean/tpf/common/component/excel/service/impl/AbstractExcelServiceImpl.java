package com.blueocean.tpf.common.component.excel.service.impl;

import java.io.File;
import java.io.OutputStream;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.blueocean.tpf.common.component.excel.model.CellMapper;
import com.blueocean.tpf.common.component.excel.model.ExcelResult;
import com.blueocean.tpf.common.component.excel.service.ExcelReaderService;
import com.blueocean.tpf.common.component.excel.service.ExcelWriterService;
import com.blueocean.tpf.common.component.excel.valid.ExcelValidRule;
@SuppressWarnings("rawtypes")
public  abstract  class AbstractExcelServiceImpl implements ExcelReaderService,ExcelWriterService{

	@Override
	public ExcelResult validExcelContent(MultipartFile file, ExcelValidRule rule) {
		return null;
	}

	@Override
	public void exportObj2Excel(String outPath, List objs, Class clz) {
		
	}

	@Override
	public void exportObj2Excel(OutputStream os, List objs, Class clz) {
		
	}

	@Override
	public ExcelResult readExcel(File file, CellMapper mapper, Integer titleRow) {
		return null;
	}

	@Override
	public ExcelResult readExcel(String fileName, CellMapper mapper, Integer titleRow) {
		return null;
	}

	@Override
	public ExcelResult readExcel(String fileName, CellMapper mapper, Integer startRow, Integer endRow) {
		return null;
	}

	@Override
	public List<Object> readExcel2Objs(String fileName, Class clz, int readLine, int tailLine) {
		return null;
	}

	@Override
	public List<Object> readExcel2Objs(String path, Class clz) {
		return null;
	}

	public abstract ExcelResult readExcel(String filePath, CellMapper mapper, ExcelValidRule rule, Integer titleRow);
}
