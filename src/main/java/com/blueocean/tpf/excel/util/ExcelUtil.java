package com.blueocean.tpf.excel.util;

import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.blueocean.tpf.excel.annotation.ExcelResources;
import com.blueocean.tpf.excel.model.ExcelHeader;

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
	 * 获取单元格的值
	 * @param cell
	 * @return
	 */
	public  Object getCellValue(Cell cell) {
		String cellValue = "";
		if (cell != null) {
			switch (cell.getCellTypeEnum()) {
			case NUMERIC:
				cellValue = String.valueOf(cell.getNumericCellValue());
                break;
            case BOOLEAN:
            	cellValue = String.valueOf(cell.getBooleanCellValue());
                break;
            case FORMULA:
            	cellValue = String.valueOf(cell.getCellFormula());
                break;
            case BLANK: break;
            case STRING:
            	cellValue = cell.getStringCellValue();
            	break;
            case ERROR:
            	cellValue = "非法字符";
            	break;
            default:
            	cellValue = "未知类型";
			}
		}
		return cellValue;
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
}
