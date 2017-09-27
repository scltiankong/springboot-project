package com.blueocean.tpf.common.component.excel.service.impl;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.xssf.eventusermodel.XSSFReader;
import org.apache.poi.xssf.model.SharedStringsTable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.xml.sax.ContentHandler;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;
import org.xml.sax.helpers.XMLReaderFactory;

import com.blueocean.tpf.common.component.excel.model.CellMapper;
import com.blueocean.tpf.common.component.excel.model.ExcelPageHandler;
import com.blueocean.tpf.common.component.excel.model.ExcelResult;
import com.blueocean.tpf.common.component.excel.out.ExcelResultOutput;
import com.blueocean.tpf.common.component.excel.service.ExcelSaxReaderService;
import com.blueocean.tpf.common.component.excel.valid.ExcelValidRule;
import com.blueocean.tpf.common.exception.CustomException;
@Service("excelSaxReaderService")
public class ExcelSaxReaderServiceImpl implements ExcelSaxReaderService{

	@Override
	public ExcelResult validExcelContent(MultipartFile file, ExcelValidRule rule) {
		return null;
	}

	@Override
	public ExcelResult readExcel(File file, Map<Integer, String> cellMapping, Integer titleRow) {
		return null;
	}

	@Override
	public ExcelResult readExcel(String filePath, Map<Integer, String> cellMapping, Integer titleRow) {
		return null;
	}

	@Override
	public ExcelResult readExcel(String filePath, CellMapper mapper, Integer titleRow) {
		return null;
	}

	@Override
	public ExcelResult readExcel(String filePath, CellMapper mapper, Integer startRow, Integer endRow) {
		ExcelResult result = new ExcelResult();
		OPCPackage pkg = null;
		try {
			pkg = OPCPackage.open(filePath);
			XSSFReader reader = new XSSFReader( pkg );
			SharedStringsTable sst = reader.getSharedStringsTable();
			
			XMLReader parser = fetchSheetParser(sst,mapper,startRow,endRow);
			InputStream sheet = reader.getSheet("rId1");  
	        InputSource sheetSource = new InputSource(sheet);
	        parser.parse(sheetSource);  
	        sheet.close();
			/*Iterator<InputStream> sheets = reader.getSheetsData();
			while(sheets.hasNext()) {
				InputStream sheet = sheets.next();
				InputSource sheetSource = new InputSource(sheet);
				parser.parse(sheetSource);
				sheet.close();
			}*/
		} catch (Exception e) {
			e.printStackTrace();
			throw new CustomException(e);
		}finally {
			try {
				if (pkg != null) {
					pkg.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
        return result;
	}
	private XMLReader fetchSheetParser(SharedStringsTable sst, CellMapper mapper, Integer startRow, Integer endRow) 
			throws SAXException {  
        XMLReader reader = XMLReaderFactory
        				.createXMLReader("org.apache.xerces.parsers.SAXParser" );  
		ContentHandler handler = new ExcelPageHandler(sst,new ExcelResultOutput(mapper),startRow,endRow);
        reader.setContentHandler(handler);
        return reader;
    }

	@Override
	public ExcelResult readExcel(String filePath, Map<Integer, String> cellMapping, ExcelValidRule rule,
			Integer titleRow) {
		return null;
	}
	/** 
     * 指定获取第一个sheet 
     * @param filename 
     * @throws Exception 
     */  
    public ExcelResult processFirstSheet(String fileName) throws Exception {  
        OPCPackage pkg = OPCPackage.open(fileName);  
        XSSFReader reader = new XSSFReader( pkg );  
        SharedStringsTable sst = reader.getSharedStringsTable();
        XMLReader parser = fetchSheetParser(sst,null,null,null);  
        // To look up the Sheet Name / Sheet Order / rID,  
        // you need to process the core Workbook stream.
        // Normally it's of the form rId# or rSheet#  
        InputStream sheet = reader.getSheet("rId1");  
        InputSource sheetSource = new InputSource(sheet);
        parser.parse(sheetSource);  
        sheet.close();
        ExcelPageHandler contentHandler = (ExcelPageHandler) parser.getContentHandler();
        ExcelResultOutput ops = (ExcelResultOutput) contentHandler.getOps();
		return ops.getResult();  
    } 
}
