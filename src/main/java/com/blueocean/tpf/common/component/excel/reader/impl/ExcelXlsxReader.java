package com.blueocean.tpf.common.component.excel.reader.impl;

import java.io.IOException;
import java.io.InputStream;
import java.util.Iterator;

import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.openxml4j.exceptions.OpenXML4JException;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.xssf.eventusermodel.XSSFReader;
import org.apache.poi.xssf.model.SharedStringsTable;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;
import org.xml.sax.helpers.XMLReaderFactory;

import com.blueocean.tpf.common.component.excel.model.CellMapper;
import com.blueocean.tpf.common.component.excel.model.ExcelResult;
import com.blueocean.tpf.common.component.excel.reader.ExcelReaderHandler;
import com.blueocean.tpf.common.exception.CustomException;
/** 
 * 抽象Excel2007读取器，excel2007的底层数据结构是xml文件，采用SAX的事件驱动的方法解析 
 * xml，需要继承DefaultHandler，在遇到文件内容时，事件会触发，这种做法可以大大降低 
 * 内存的耗费，特别使用于大数据量的文件。 
 * 
 */  
public class ExcelXlsxReader  extends AbstractExcelReader{
	private static final String SAXParser = "org.apache.xerces.parsers.SAXParser";
	private ExcelReaderHandler handler = new DefaultExcelHandler();
	private SharedStringsTable sharedStringsTable;
    public SharedStringsTable getSharedStringsTable() {
		return sharedStringsTable;
	}
	public void setHandler(ExcelReaderHandler handler) {
		if (handler != null) {
			this.handler = handler;
		}
	}
	public long getMinRow(){
		return minRow;
	}
	public long getMaxRow(){
		return maxRow;
	}
	public int getSheetIndex(){
		return sheetIndex;
	}
	private ExcelResult process(InputStream inputStream) throws Exception{
		OPCPackage pkg = OPCPackage.open(inputStream);
        return process(pkg);
	}
	private ExcelResult process(OPCPackage pkg)
			throws IOException, OpenXML4JException, InvalidFormatException, SAXException {
		XSSFReader r = new XSSFReader(pkg);
        sharedStringsTable = r.getSharedStringsTable();
        XMLReader parser = fetchSheetParser();
        if (this.bindSheet != null) {
        	sheetIndex = this.bindSheet+1;
        	// 根据 rId# 或 rSheet# 查找sheet  
        	InputStream sheet = r.getSheet("rId"+sheetIndex);
        	InputSource sheetSource = new InputSource(sheet);
        	parser.parse(sheetSource);
        	sheet.close();
		}else {
			Iterator<InputStream> sheets = r.getSheetsData();  
	        while (sheets.hasNext()) {
	        	sheetIndex++;
	            InputStream sheet = sheets.next();
	            InputSource sheetSource = new InputSource(sheet);
	            parser.parse(sheetSource);
	            sheet.close();
	        }
		}
		return result;
	}
	private ExcelResult process(String fileName) throws Exception{
		OPCPackage pkg = OPCPackage.open(fileName);
		return process(pkg);
	}
	public XMLReader fetchSheetParser() throws SAXException {  
		 XMLReader reader = XMLReaderFactory.createXMLReader(SAXParser);
		 if (this.handler == null) {
			throw new CustomException("ExcelReaderHandler必须设置");
		 }
		 reader.setContentHandler(this.handler);
		 this.handler.init(this);
		 return reader; 
    }
	@Override
	public ExcelResult read(InputStream inputStream, Integer sheetIndex, Integer startRow, Integer endRow,
			CellMapper mapper) {
		init(sheetIndex, startRow, endRow, mapper);
		try {
			return process(inputStream);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	@Override
	public ExcelResult read(String fileName, Integer sheetIndex, Integer startRow, Integer endRow, CellMapper mapper) {
		init(sheetIndex, startRow, endRow, mapper);
		try {
			return process(fileName);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
}
