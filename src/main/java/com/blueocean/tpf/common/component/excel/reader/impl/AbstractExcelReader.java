package com.blueocean.tpf.common.component.excel.reader.impl;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import com.blueocean.tpf.common.component.excel.model.CellMapper;
import com.blueocean.tpf.common.component.excel.model.ExcelResult;
import com.blueocean.tpf.common.component.excel.reader.IExcelReader;
import com.blueocean.tpf.common.component.excel.reader.IRowReader;

/**
 * 抽象Excel2003读取器，通过实现HSSFListener监听器，采用事件驱动模式解析excel2003
 * 中的内容，遇到特定事件才会触发，大大减少了内存的使用。
 * 
 */
public abstract class AbstractExcelReader extends Common implements IExcelReader{
	protected IRowReader rowReader = new DefaultRowReader();
	protected List<Object> rowData = new ArrayList<Object>();
	protected ExcelResult result = new ExcelResult();
	public AbstractExcelReader() {
		if (result == null) {
			result = new ExcelResult();
		}
		result.setDatas(new ArrayList<>());
	}
	public void setRowReader(IRowReader rowReader) {
		if (rowReader != null) {
			this.rowReader = rowReader;
		}
	}
	public IRowReader getRowReader() {
		return rowReader;
	}
	public List<Object> getRowData() {
		return rowData;
	}
	@Override
	public ExcelResult read(String fileName) {
		try {
			return read(new FileInputStream(fileName));
		} catch (FileNotFoundException e) {
			return null;
		}
	}

	@Override
	public ExcelResult read(String fileName, Integer sheetIndex) {
		try {
			return read(new FileInputStream(fileName),sheetIndex);
		} catch (FileNotFoundException e) {
			return null;
		}
	}

	@Override
	public ExcelResult read(String fileName, Integer sheetIndex, Integer startRow, Integer endRow) {
		try {
			return read(new FileInputStream(fileName),sheetIndex,startRow,endRow);
		} catch (FileNotFoundException e) {
			return null;
		}
	}

	@Override
	public ExcelResult read(String fileName, CellMapper mapper) {
		try {
			return read(new FileInputStream(fileName),mapper);
		} catch (FileNotFoundException e) {
			return null;
		}
	}

	@Override
	public ExcelResult read(String fileName, Integer sheetIndex, CellMapper mapper) {
		try {
			return read(new FileInputStream(fileName),sheetIndex,mapper);
		} catch (FileNotFoundException e) {
			return null;
		}
	}

	@Override
	public ExcelResult read(String fileName, Integer sheetIndex, Integer startRow, Integer endRow, CellMapper mapper) {
		try {
			return read(new FileInputStream(fileName),sheetIndex,startRow,endRow,mapper);
		} catch (FileNotFoundException e) {
			return null;
		}
	}

	@Override
	public ExcelResult read(InputStream inputStream) {
		return read(inputStream, null, null, null, null);
	}

	@Override
	public ExcelResult read(InputStream inputStream, Integer sheetIndex) {
		return read(inputStream, sheetIndex, null, null, null);
	}

	@Override
	public ExcelResult read(InputStream inputStream, Integer sheetIndex, Integer startRow, Integer endRow) {
		return read(inputStream, sheetIndex, startRow, endRow, null);
	}

	@Override
	public ExcelResult read(InputStream inputStream, CellMapper mapper) {
		return read(inputStream, null, null, null, mapper);
	}

	@Override
	public ExcelResult read(InputStream inputStream, Integer sheetIndex, CellMapper mapper) {
		return read(inputStream, sheetIndex, null, null, mapper);
	}
	public ExcelResult getResult() {
		return result;
	}
}
