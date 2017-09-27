package com.blueocean.tpf.common.component.excel.model;

import com.blueocean.tpf.common.component.excel.reader.IExcelReader;
import com.blueocean.tpf.common.component.excel.reader.impl.ExcelXlsReader;
import com.blueocean.tpf.common.component.excel.reader.impl.ExcelXlsxReader;

/**
 * excel引擎
 * @author scl
 *
 */
public class ExcelEngine {
	//excel2003扩展名  
    private static final String EXCEL03_EXTENSION = ".xls";  
    //excel2007扩展名  
    private static final String EXCEL07_EXTENSION = ".xlsx";
	private static ExcelEngine excelEngine = new ExcelEngine();
	private ExcelEngine(){}
	public static ExcelEngine getEngine(){
		return excelEngine;
	}
	public IExcelReader getReader(String fileName){
		// 处理excel2003文件  
		if (fileName.toLowerCase().endsWith(EXCEL03_EXTENSION)){  
			return new ExcelXlsReader();  
			// 处理excel2007文件  
		} else if (fileName.toLowerCase().endsWith(EXCEL07_EXTENSION)){  
			return new ExcelXlsxReader();
		} else {  
			throw new  RuntimeException("文件格式错误，fileName的扩展名只能是xls或xlsx。");  
		}  
	}
}
