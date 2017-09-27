package com.blueocean.tpf.common.component.excel.util;

import java.util.function.Function;

import com.blueocean.tpf.common.component.excel.model.CellMapper;
import com.blueocean.tpf.common.component.excel.reader.IRowReader;
import com.blueocean.tpf.common.component.excel.reader.impl.ExcelXlsReader;
import com.blueocean.tpf.common.component.excel.reader.impl.ExcelXlsxReader;

public class ExcelReaderUtil {
	//excel2003扩展名  
    private static final String EXCEL03_EXTENSION = ".xls";  
    //excel2007扩展名  
    private static final String EXCEL07_EXTENSION = ".xlsx";  
      
    /** 
     * 读取Excel文件，可能是03也可能是07版本 
     * @param excel03 
     * @param excel07 
     * @param fileName 
     * @throws Exception  
     */  
    public static void readExcel(IRowReader reader,String fileName) throws Exception{  
        // 处理excel2003文件  
        if (fileName.toLowerCase().endsWith(EXCEL03_EXTENSION)){  
            ExcelXlsReader excel03 = new ExcelXlsReader();  
            excel03.setRowReader(reader);  
            excel03.read(fileName);  
        // 处理excel2007文件  
        } else if (fileName.toLowerCase().endsWith(EXCEL07_EXTENSION)){  
        	ExcelXlsxReader excel07 = new ExcelXlsxReader();
        	excel07.setRowReader(reader);
        	excel07.read(fileName);
        } else {  
            throw new  Exception("文件格式错误，fileName的扩展名只能是xls或xlsx。");  
        }  
    }
    /**
	 * 根据映射条件对值进行处理
	 * @param value
	 * @return
	 */
	public static Object mapperValue(Object value,CellMapper mapper,int curCol) {
		if (value != null) {
			value = value.toString().trim();
		}
		if ("".equals(value)) {
			value = null;
		}
		if (mapper != null && value != null) {
			Function<Object, Object> handle = null;
			try {
				handle = mapper.getCellValueHandle().get(curCol);
				try {
					if (handle != null) {
						value = handle.apply(value);
					}
				} catch (Exception e) {}
			} catch (Exception e) {}
		}
		return value;
	}
}
