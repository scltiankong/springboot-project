package com.blueocean.tpf.common.component.excel.service.impl;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.blueocean.tpf.common.component.excel.model.CellMapper;
import com.blueocean.tpf.common.component.excel.model.ExcelHeader;
import com.blueocean.tpf.common.component.excel.model.ExcelResult;
import com.blueocean.tpf.common.component.excel.util.ExcelUtil;
import com.blueocean.tpf.common.component.excel.valid.ExcelValidRule;
import com.blueocean.tpf.common.exception.CustomException;
import com.blueocean.tpf.common.util.FilesUtil;
@SuppressWarnings("rawtypes")
@Service
public class ExcelServiceImpl extends AbstractExcelServiceImpl{
	private ExcelUtil excelUtil = ExcelUtil.getInstance();
	@Override
	public ExcelResult validExcelContent(MultipartFile file,ExcelValidRule rule) {
		if (rule == null) {
			return null;
		}
		//获取工作簿
		Workbook workBook = null;
		try {
			workBook = excelUtil.getWorkbook(file.getInputStream(),file.getOriginalFilename());
		} catch (IOException e) {
			throw new CustomException("读取excel文件失败");
		}
		if (workBook != null) {
			return validWorkbook(workBook,rule,null);
		}
		return null;
	}
	/**
	 * 校验工作簿
	 * @param workBook
	 * @param rule
	 * @return
	 */
	private ExcelResult validWorkbook(Workbook workBook,ExcelValidRule rule,
			Map<Integer, String> columnPropertyMapping) {
		ExcelResult result = new ExcelResult();
		//不需要校验的行和列（对于所有sheet工作表）
		List<Integer> noCheckRows = rule.noCheckRows();
		int sheetNum = workBook.getNumberOfSheets();
		for (int i = 0; i < sheetNum; i++) {
			// 获得当前sheet工作表
			Sheet sheet = workBook.getSheetAt(i);
			if (sheet == null) {
				continue;
			}
			validRow(rule, noCheckRows, sheet,result,i,columnPropertyMapping);
		}
		return result;
	}
	/**
	 * 校验行
	 * @param rule
	 * @param noCheckRows
	 * @param noCheckRows2sheet
	 * @param sheet
	 */
	private void validRow(ExcelValidRule rule, List<Integer> noCheckRows,
			Sheet sheet,ExcelResult result,int sheetIndex,
			Map<Integer, String> columnPropertyMapping) {
		List<String> validMsg = new ArrayList<>();
		//不需要校验的行和列（对于指定sheet工作表）
		List<Integer> noCheckRows2sheet = rule.noCheckRows(sheetIndex);
		if (columnPropertyMapping != null) {
			List<Object> dataList = new ArrayList<>();
			for (Row row : sheet) {
				// 获得当前行
				if(skip(row,noCheckRows,noCheckRows2sheet)){
					dataList.add(getObject(columnPropertyMapping, row));
					continue;
				}
				boolean isValidRow = validCell(rule, row,validMsg);
				if (isValidRow) {
					dataList.add(getObject(columnPropertyMapping, row));
				}
			}
			result.setDatas(dataList);
		}else {
			for (Row row : sheet) {
				// 获得当前行
				if(skip(row,noCheckRows,noCheckRows2sheet)){
					continue;
				}
				validCell(rule, row, validMsg);
			}
		}
		result.setTipMsg(validMsg);
	}
	/**
	 * 校验单元格
	 * @param rule
	 * @param validMsg
	 * @param row
	 * @param validMsg 
	 * @param cell
	 */
	private boolean validCell(ExcelValidRule rule, Row row, List<String> validMsg) {
		boolean isValid = true;
		for (Cell cell : row) {
			String msg = rule.valid(cell.getColumnIndex(), excelUtil.getCellValue(cell));
			if (msg != null) {
				isValid = false;
				msg = "第"+row.getRowNum()+"行"+msg;
				validMsg.add(msg);
			}
		}
		return isValid;
	}
	/**
	 * 跳过验证条件
	 * @param row
	 * @param noCheckRows
	 * @param noCheckRows2sheet
	 * @return
	 */
	private boolean skip(Row row, List<Integer> noCheckRows, List<Integer> noCheckRows2sheet) {
		if (row == null) {
			return true;
		}
		int rowNum = row.getRowNum();
		if (noCheckRows != null && noCheckRows.contains(rowNum)) {
			return true;
		}
		if (noCheckRows2sheet != null && noCheckRows2sheet.contains(rowNum)) {
			return true;
		}
		return false;
	}
	@Override
	public ExcelResult readExcel(String filePath, CellMapper mapper, Integer startRow, Integer endRow) {
		ExcelResult result = null;
		Map<Integer, String> cellMapping = mapper.getMap();
		validMapping(cellMapping);
		//获取工作簿
		Workbook workBook = null;
		try {
			workBook = excelUtil.getWorkbook(filePath);
			result = readWorkbook(cellMapping, startRow, endRow,workBook);
		} catch (Exception e) {
			throw new CustomException("读取excel文件失败");
		}finally {
			excelUtil.releaseWorkbook(workBook);
		}
		return result;
	}
	@Override
	public ExcelResult readExcel(File file, CellMapper mapper,Integer titleRow) {
		ExcelResult result = null;
		validMapping(mapper.getMap());
		//获取工作簿
		Workbook workBook = null;
		try {
			workBook = excelUtil.getWorkbook(file);
			int startRow = 1;
			if (titleRow != null) {
				startRow = titleRow + 1;
			}
			result = readWorkbook(mapper.getMap(), startRow, null,workBook);
		} catch (Exception e) {
			throw new CustomException("读取excel文件失败");
		}finally {
			excelUtil.releaseWorkbook(workBook);
		}
		return result;
	}
	/**
	 * 读取工作簿
	 * @param columnPropertyMapping
	 * @param titleRow
	 * @param result
	 * @param workBook
	 */
	private ExcelResult readWorkbook(Map<Integer, String> cellMapping, 
			Integer startRow,Integer endRow,Workbook workBook) {
		ExcelResult result = new ExcelResult();
		if (workBook != null) {
			List<Object> dataList = new ArrayList<>();
			int totalSheet = workBook.getNumberOfSheets();
			for (int sheetNum = 0; sheetNum < totalSheet; sheetNum++) {
				List<Map<String, Object>> datas = readSheet(workBook,sheetNum,startRow,endRow,cellMapping);
				if (datas == null) {
					continue;
				}
				dataList.addAll(datas);
			}
			result.setDatas(dataList);
		}
		return result;
	}
	private List<Map<String, Object>> readSheet(Workbook workBook, int sheetNum, 
			Integer startRow, Integer endRow, Map<Integer, String> cellMapping) {
		// 获得当前sheet工作表
		Sheet sheet = workBook.getSheetAt(sheetNum);
		if (sheet == null) {
			return null;
		}
		// 获得当前sheet的开始行，默认第一行为表头
		if (startRow == null) {
			startRow = sheet.getFirstRowNum()+1;
		}
		if (endRow == null || endRow > sheet.getLastRowNum()) {
			// 获得当前sheet的结束行
			endRow = sheet.getLastRowNum();
		}
		List<Map<String, Object>> dataList = new ArrayList<>(endRow - startRow);
		readSheet(cellMapping, dataList, sheet, startRow, endRow);
		return dataList;
	}
	/**
	 * 都去sheet数据
	 * @param cellMapping
	 * @param dataList
	 * @param sheet
	 * @param firstRowNum
	 * @param lastRowNum
	 */
	private void readSheet(Map<Integer, String> cellMapping, List<Map<String, Object>> dataList, 
			Sheet sheet, int firstRowNum, int lastRowNum) {
		// 循环除了第一行的所有行
		for (int rowNum = firstRowNum; rowNum <= lastRowNum; rowNum++) {
			// 获得当前行
			Row row = sheet.getRow(rowNum);
			if (row == null) {
				continue;
			}
			dataList.add(getObject(cellMapping, row));
		}
	}
	/**
	 * 校验属性映射关系
	 * @param cellMapping
	 */
	private void validMapping(Map<Integer, String> cellMapping) {
		if (cellMapping == null) {
			throw new CustomException("请指定属性映射关系");
		}
	}
	/**
	 * 获取一条记录
	 * @param columnPropertyMapping
	 * @param row
	 * @return
	 */
	private Map<String, Object> getObject(Map<Integer, String> columnPropertyMapping, Row row) {
		Map<String, Object> obj = new HashMap<>();
		for (Cell cell : row) {
			try {
				String prop = columnPropertyMapping.get(cell.getColumnIndex());
				if (prop != null) {
					obj.put(prop, excelUtil.getCellValue(cell));
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return obj;
	}
	@Override
	public ExcelResult readExcel(String filePath, CellMapper mapper,
			Integer titleRow) {
		return readExcel(new File(filePath), mapper, titleRow);
	}
	@Override
	public ExcelResult readExcel(String filePath, CellMapper mapper, 
			ExcelValidRule rule, Integer titleRow) {
		if (rule == null) {
			return readExcel(filePath, mapper, titleRow);
		}
		validMapping(mapper.getMap());
		Workbook workBook;
		try {
			workBook = excelUtil.getWorkbook(filePath);
			return validWorkbook(workBook, rule, mapper.getMap());
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}
	@Override
	public void exportObj2Excel(String outPath, List objs, Class clz) {
		Workbook wb = handleObj2Excel(objs, clz);
		FileOutputStream fos = null;
		try {
			fos = new FileOutputStream(outPath);
			wb.write(fos);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				if (fos != null)
					fos.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
	private Workbook handleObj2Excel(List objs, Class clz) {
        Workbook wb = new HSSFWorkbook();
        try {
            Sheet sheet = wb.createSheet();
            Row r = sheet.createRow(0);
            List<ExcelHeader> headers = excelUtil.getHeaderList(clz);
            Collections.sort(headers);
            //写标题
            for(int i=0;i<headers.size();i++) {
                r.createCell(i).setCellValue(headers.get(i).getTitle());
            }
            //写数据
            Object obj = null;
            for(int i=0;i<objs.size();i++) {
                r = sheet.createRow(i+1);
                obj = objs.get(i);
                for(int j=0;j<headers.size();j++) {
                    r.createCell(j).setCellValue(BeanUtils.getProperty(obj, excelUtil.getMethodName(headers.get(j))));
                }
            }
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        }
        return wb;
    }
	@Override
	public void exportObj2Excel(OutputStream os, List objs, Class clz) {
		try {
            Workbook wb = handleObj2Excel(objs, clz);
            wb.write(os);
        } catch (IOException e) {
            e.printStackTrace();
        }finally {
			try {
				os.flush();
				os.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
	@Override
	public List<Object> readExcel2Objs(String path, Class clz, int readLine, int tailLine) {
		Workbook wb = null;
		try {
			wb = new HSSFWorkbook(FilesUtil.readFileInput(path));
			return handlerExcel2Objs(wb, clz, readLine, tailLine);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}
	private List<Object> handlerExcel2Objs(Workbook wb,Class clz,int readLine,int tailLine) {
        Sheet sheet = wb.getSheetAt(0);
        List<Object> objs = null;
        try {
            Row row = sheet.getRow(readLine);
            objs = new ArrayList<Object>();
            Map<Integer,String> maps = getHeaderMap(row, clz);
            if(maps==null||maps.size()<=0) throw new RuntimeException("要读取的Excel的格式不正确，检查是否设定了合适的行");
            for(int i=readLine+1;i<=sheet.getLastRowNum()-tailLine;i++) {
                row = sheet.getRow(i);
                Object obj = clz.newInstance();
                for(Cell c:row) {
                    int ci = c.getColumnIndex();
                    String mn = maps.get(ci).substring(3);
                    mn = mn.substring(0,1).toLowerCase()+mn.substring(1);
                    BeanUtils.copyProperty(obj,mn, excelUtil.getCellValue(c));
                }
                objs.add(obj);
            }
        } catch (InstantiationException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        }
        return objs;
    }
	private Map<Integer,String> getHeaderMap(Row titleRow,Class clz) {
        List<ExcelHeader> headers = excelUtil.getHeaderList(clz);
        Map<Integer,String> maps = new HashMap<Integer, String>();
        for(Cell c:titleRow) {
            String title = c.getStringCellValue();
            for(ExcelHeader eh:headers) {
                if(eh.getTitle().equals(title.trim())) {
                    maps.put(c.getColumnIndex(), eh.getMethodName().replace("get","set"));
                    break;
                }
            }
        }
        return maps;
    }
	@Override
	public List<Object> readExcel2Objs(String path, Class clz) {
		return this.readExcel2Objs(path, clz,0,0);
	}
}
