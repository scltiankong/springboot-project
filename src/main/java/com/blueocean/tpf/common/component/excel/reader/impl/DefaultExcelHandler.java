package com.blueocean.tpf.common.component.excel.reader.impl;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.poi.xssf.usermodel.XSSFRichTextString;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;

import com.blueocean.tpf.common.component.excel.reader.ExcelReaderHandler;
import com.blueocean.tpf.common.component.excel.util.ExcelReaderUtil;
import com.blueocean.tpf.common.component.excel.util.ExcelUtil;

public class DefaultExcelHandler  extends ExcelReaderHandler{
	private ExcelXlsxReader reader;
    private String lastContents;
    private int cellIndex;
    private boolean isCell = false;
    private int curRow = 0;
    private int curCol = 0;
	/** 
     * 每个单元格开始时的处理 
     */  
    @Override  
    public void startElement(String uri, String localName, String name,  
            Attributes attributes) throws SAXException {  
    	//如果这是一个新行
//		createNewRow(name);
    	if (reader.isAccess(curRow)) {
    		// c => cell 代表单元格
    		if("c".equals(name)) {
    			if(reader.isAccess(curRow)){
    				String cellCoordinate = attributes.getValue("r");
    				setCellIndex(cellCoordinate);
    				String cellType = attributes.getValue("t");
    				if("s".equals(cellType)) {
    					isCell = true;
    				} else {
    					isCell = false;
    				}
    				
    			}
    		}
    		// Clear contents cache
    		lastContents = "";
		}
    }
    /**
     * 根据单元格坐标设置列号
     * @param cellCoordinate
     */
    private void setCellIndex(String cellCoordinate) {
        Pattern  pattern=Pattern.compile("([a-zA-Z]+)(\\d+)");  
        Matcher  ma=pattern.matcher(cellCoordinate);  
        ma.find();
        String column = ma.group(1);
        cellIndex = ExcelUtil.getInstance().columnToIndex(column)-1;
	}
	/** 
     * 每个元素标签结束时的处理 
     */  
	@Override  
    public void endElement(String uri, String localName, String name)  
            throws SAXException {
		if(reader.isAccess(curRow)){
			// Process the last contents as required.
			// Do now, as characters() may be called more than once
			if(isCell) {
				int idx = Integer.parseInt(lastContents);
				lastContents = new XSSFRichTextString(reader.getSharedStringsTable().getEntryAt(idx)).toString();
				isCell = false;
			}
			// v => contents of a cell
			if("v".equals(name)) {
				filledEmptyDatas();
				Object value = ExcelReaderUtil.mapperValue(lastContents,reader.mapper, curCol);
				curCol ++;
				reader.getRowData().add(value);
			}
		}
		createNewRow(name);
    }
	/**
	 * 填充空单元格的值
	 */
	private void filledEmptyDatas() {
		for (; curCol < cellIndex; curCol++) {
			reader.getRowData().add(null);
		}
	}
    @Override  
    public void characters(char[] ch, int start, int length)  
            throws SAXException {  
        if(reader.isAccess(curRow)){  
            lastContents += new String(ch, start, length);  
        }  
    }  
    /** 
     * 如果文档结束后，发现读取的末尾行正处在当前行中，存储下这行 
     * （存在这样一种情况，当待读取的末尾行正好是文档最后一行时，最后一行无法存到集合中， 
     * 因为最后一行没有下一行了，所以不为启动starElement()方法， 
     * 当然我们可以通过指定最大列来处理，但不想那么做，扩展性不好） 
     */  
	@Override  
    public void endDocument ()throws SAXException{
		curRow = 0;
		reader.getRowReader().ops(mapper);
    }
    /**
     * 创建新行
     * @param name
     */
	private void createNewRow(String name) {
		if("row".equals(name)){
			curRow++;//当前行+1
			curCol = 0;
			if (reader.isAccess(curRow)) {
				List<Object> rowData = reader.getRowData();
				//存储上一行数据 
				if(rowData!=null&&!rowData.isEmpty()){  
					reader.getRowReader().getRows(reader,curRow,mapper);
					rowData.clear();
				}
			}
		}
	}
	@Override
	public void init(ExcelXlsxReader excelXlsxReader) {
		this.reader =  excelXlsxReader;
		this.mapper = excelXlsxReader.mapper;
	}
}
