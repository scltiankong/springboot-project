package com.blueocean.tpf.common.component.excel.reader;

import org.xml.sax.helpers.DefaultHandler;

import com.blueocean.tpf.common.component.excel.model.CellMapper;
import com.blueocean.tpf.common.component.excel.reader.impl.ExcelXlsxReader;

public abstract class ExcelReaderHandler extends DefaultHandler{
	protected  CellMapper mapper;
	public abstract void init(ExcelXlsxReader excelXlsxReader);
	public void setMapper(CellMapper mapper) {
		this.mapper = mapper;
	}
}
