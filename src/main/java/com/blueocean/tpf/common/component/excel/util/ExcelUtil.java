package com.blueocean.tpf.common.component.excel.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Method;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.RichTextString;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.blueocean.tpf.common.component.excel.annotation.ExcelResources;
import com.blueocean.tpf.common.component.excel.model.ExcelHeader;

/**
 * 该类实现了将一组对象转换为Excel表格，并且可以从Excel表格中读取到一组List对象中
 * 该类利用了BeanUtils框架中的反射完成
 * 使用该类的前提，在相应的实体对象上通过ExcelReources来完成相应的注解
 */
@SuppressWarnings("rawtypes")
public class ExcelUtil {
	private final static String xls = "xls";
	private final static String xlsx = "xlsx";
	private final static String ext = ".lh";
	private DecimalFormat df = new DecimalFormat("0");
	private static ExcelUtil eu = new ExcelUtil();
    private ExcelUtil(){}

    public static ExcelUtil getInstance() {
        return eu;
    }
    /**
	 * 获取工作簿
	 * @param is 文件流
	 * @param fileName 文件名
	 * @return
     * @throws IOException 
	 */
    public Workbook getWorkbook(InputStream is,String fileName) throws IOException{
		// 创建Workbook工作薄对象，表示整个excel
		if (fileName.endsWith(ext)) {
			fileName = fileName.substring(0, fileName.indexOf(ext));
		}
		// 根据文件后缀名不同(xls和xlsx)获得不同的Workbook实现类对象
		if (fileName.endsWith(xls)) {
			return new HSSFWorkbook(is);
		}
		if (fileName.endsWith(xlsx)) {
			return new XSSFWorkbook(is);
		}
		throw new IOException("文件格式不正确");
    }
    /**
     * 获取工作簿
     * @param file
     * @return
     * @throws IOException
     */
    public Workbook getWorkbook(File file) throws IOException{
    	return getWorkbook(new FileInputStream(file), file.getName());
    }
    /**
     * 获取工作簿
     * @param file
     * @return
     * @throws IOException
     */
    public Workbook getWorkbook(String filePath) throws IOException{
    	return getWorkbook(new File(filePath));
    }
    /**
	 * 获取单元格的值
	 * @param cell
	 * @return
	 */
	public  Object getCellValue(Cell cell) {
		Object value = null;
		if (cell != null) {
			switch (cell.getCellTypeEnum()) {
			case NUMERIC:
				value = cell.getNumericCellValue();
				if (HSSFDateUtil.isCellDateFormatted(cell)) {
					value = DateUtil.getJavaDate((double) value);
				}else {
					value = df.format(value);  
				}
                break;
            case BOOLEAN:
            	value = cell.getBooleanCellValue();
                break;
            case FORMULA://读取公式的值
            	try {
            		RichTextString cellValue = cell.getRichStringCellValue();
            		if (cellValue != null) {
            			value = cellValue.getString();
					}
				} catch (Exception e) {
					value = cell.getCellFormula();
				}
                break;
            case BLANK: break;
            case STRING:
            	value = cell.getStringCellValue();
            	break;
            case ERROR:
            	value = "非法字符";
            	break;
            default:
            	value = "未知类型";
			}
		}
		return value;
	}
	/**
     * 根据标题获取相应的方法名称
     * @param eh
     * @return
     */
    public String getMethodName(ExcelHeader eh) {
        String mn = eh.getMethodName().substring(3);
        mn = mn.substring(0,1).toLowerCase()+mn.substring(1);
        return mn;
    }
    public List<ExcelHeader> getHeaderList(Class clz) {
        List<ExcelHeader> headers = new ArrayList<ExcelHeader>();
        Method[] ms = clz.getDeclaredMethods();
        for(Method m:ms) {
            String mn = m.getName();
            if(mn.startsWith("get")) {
                if(m.isAnnotationPresent(ExcelResources.class)) {
                    ExcelResources er = m.getAnnotation(ExcelResources.class);
                    headers.add(new ExcelHeader(er.title(),er.order(),mn));
                }
            }
        }
        return headers;
    }
    public void releaseWorkbook(Workbook workBook) {
    	try {
			if (workBook != null) {
				workBook.close();
			}
		} catch (Exception e) {}
    }
    
    /**
     * 用于将Excel表格中列号字母转成列索引，从1对应A开始
     * 
     * @param column 列号
     * @return 列索引
     */
	public int columnToIndex(String column) {
		column = column.toUpperCase();
		if (!column.matches("[A-Z]+")) {
			try {
				throw new Exception("Invalid parameter");
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		int index = 0;
		char[] chars = column.toCharArray();
		for (int i = 0; i < chars.length; i++) {
			index += ((int) chars[i] - (int) 'A' + 1) * (int) Math.pow(26, chars.length - i - 1);
		}
		return index;
	}

    /**
     * 用于将excel表格中列索引转成列号字母，从A对应1开始
     * 
     * @param index
     *            列索引
     * @return 列号
     */
    public  String indexToColumn(int index) {
		if (index <= 0) {
			try {
				throw new Exception("Invalid parameter");
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		index--;
		String column = "";
		do {
			if (column.length() > 0) {
				index--;
			}
			column = ((char) (index % 26 + (int) 'A')) + column;
			index = (int) ((index - index % 26) / 26);
		} while (index > 0);
		return column;
	}
}
