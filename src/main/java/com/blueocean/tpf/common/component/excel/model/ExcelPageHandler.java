package com.blueocean.tpf.common.component.excel.model;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.poi.xssf.model.SharedStringsTable;
import org.apache.poi.xssf.usermodel.XSSFRichTextString;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

import com.blueocean.tpf.common.component.excel.out.ExcelOutputSystem;
import com.blueocean.tpf.common.component.excel.util.ExcelUtil;

@SuppressWarnings(value={"rawtypes","unchecked"})
public class ExcelPageHandler  extends DefaultHandler{
	private ExcelOutputSystem ops;
    private SharedStringsTable sst;
    private String lastContents;
    private int cellIndex;
    private boolean isCell;
    private int startRow = 1;
    private int endRow;  
    private int currRow = -1;
    private int curCol = 0;
    private List<String> rowData;
    List<List<String>> datas;
    public ExcelPageHandler(SharedStringsTable sst) {  
        this.sst = sst;
        this.endRow = sst.getCount();
        datas = new ArrayList<>();
    }
    public ExcelPageHandler(SharedStringsTable sst,ExcelOutputSystem ops) {  
    	this(sst);
    	this.ops = ops;
    }
    public ExcelPageHandler(SharedStringsTable sst,ExcelOutputSystem ops,
    		Integer startRow,Integer endRow) {
    	this(sst, ops);
    	if (startRow != null) {
    		this.startRow = startRow;
		}
    	if (endRow != null) {
    		this.endRow = endRow;
    	}
    }
    public ExcelPageHandler(SharedStringsTable sst,
    		int startRow,int endRow) {
    	this(sst);
    	this.startRow = startRow;
    	this.endRow = endRow;
    }
    public ExcelOutputSystem getOps() {
		return ops;
	}
	/** 
     * 每个单元格开始时的处理 
     */  
    @Override  
    public void startElement(String uri, String localName, String name,  
            Attributes attributes) throws SAXException {  
    	//如果这是一个新行
		createNewRow(name);
    	if (isAccess()) {
    		// c => cell 代表单元格
    		if("c".equals(name)) {
    			if(isAccess()){
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
        cellIndex = ExcelUtil.getInstance().columnToIndex(column);
	}
	/** 
     * 每个元素标签结束时的处理 
     */  
	@Override  
    public void endElement(String uri, String localName, String name)  
            throws SAXException {
		if(isAccess()){
			// Process the last contents as required.
			// Do now, as characters() may be called more than once
			if(isCell) {
				int idx = Integer.parseInt(lastContents);
				lastContents = new XSSFRichTextString(sst.getEntryAt(idx)).toString();
				isCell = false;
			}
			// v => contents of a cell
			if("v".equals(name)) {
				curCol ++;
				filledEmptyDatas();
				rowData.add(lastContents.trim());
			}
		}
    }
	/**
	 * 填充空单元格的值
	 */
	private void filledEmptyDatas() {
		for (; curCol < cellIndex; curCol++) {
			rowData.add(null);
		}
	}
    @Override  
    public void characters(char[] ch, int start, int length)  
            throws SAXException {  
        if(isAccess()){  
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
        if(rowData!=null&&isAccess()&&!rowData.isEmpty()){  
        	datas.add(rowData);
        }  
        ops.output(datas);
    }
    private boolean isAccess(){  
        if(currRow >= startRow && startRow <= endRow){  
            return true;  
        }  
        return false;  
    }
    /**
     * 创建新行
     * @param name
     */
	private void createNewRow(String name) {
		if("row".equals(name)){
			currRow++;//当前行+1
			curCol = 0;
			//存储上一行数据 
			if(rowData!=null&&isAccess()&&!rowData.isEmpty()){  
				datas.add(rowData);
			}
			if (rowData == null || !rowData.isEmpty()) {
				rowData = new ArrayList<String>();//新行要先清除上一行的数据
			}
		}
	}
}
