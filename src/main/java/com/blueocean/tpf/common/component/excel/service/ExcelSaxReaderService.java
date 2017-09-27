package com.blueocean.tpf.common.component.excel.service;

import java.io.File;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.blueocean.tpf.common.component.excel.model.CellMapper;
import com.blueocean.tpf.common.component.excel.model.ExcelResult;
import com.blueocean.tpf.common.component.excel.valid.ExcelValidRule;
public interface ExcelSaxReaderService {
	/**
	 * 校验excel单元格内容合法性
	 * @param file excel格式的文件
	 * @param rule 校验规则
	 */
	ExcelResult validExcelContent(MultipartFile file,ExcelValidRule rule);
	/**
	 * 根据属性列序号的映射关系读取excel内容
	 * @param file
	 * @param cellMapping
	 * @param titleRow 表头
	 * @return
	 */
	ExcelResult readExcel(File file,Map<Integer, String> cellMapping,Integer titleRow);
	/**
	 * 根据属性列序号的映射关系读取excel内容
	 * @param filePath
	 * @param cellMapping
	 * @param titleRow 表头
	 * @return
	 */
	ExcelResult readExcel(String filePath,Map<Integer, String> cellMapping,Integer titleRow);
	/**
	 * 根据属性列序号的映射关系读取excel内容
	 * @param filePath
	 * @param cellMapping
	 * @param titleRow 表头
	 * @return
	 */
	ExcelResult readExcel(String filePath,CellMapper mapper,Integer titleRow);
	/**
	 * 读取指定行区间的数据
	 * @param filePath
	 * @param mapper
	 * @param startRow
	 * @param endRow
	 * @return
	 */
	ExcelResult readExcel(String filePath,CellMapper mapper,Integer startRow,Integer endRow);
	/**
	 * 根据属性列序号的映射关系读取excel内容
	 * @param filePath
	 * @param cellMapping
	 * @param rule
	 * @param titleRow
	 * @return
	 */
	ExcelResult readExcel(String filePath,Map<Integer, String> cellMapping,ExcelValidRule rule,Integer titleRow);
}
