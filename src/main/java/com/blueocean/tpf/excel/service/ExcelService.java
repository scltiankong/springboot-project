package com.blueocean.tpf.excel.service;

import java.io.File;
import java.io.OutputStream;
import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.blueocean.tpf.excel.model.ExcelResult;
import com.blueocean.tpf.excel.valid.ExcelValidRule;
@SuppressWarnings("rawtypes")
public interface ExcelService {
	/**
	 * 校验excel单元格内容合法性
	 * @param file excel格式的文件
	 * @param rule 校验规则
	 */
	ExcelResult validExcelContent(MultipartFile file,ExcelValidRule rule);
	/**
	 * 根据属性列序号的映射关系读取excel内容
	 * @param file
	 * @param columnPropertyMapping
	 * @param titleRow 表头
	 * @return
	 */
	ExcelResult readExcel(File file,Map<Integer, String> columnPropertyMapping,Integer titleRow);
	/**
	 * 根据属性列序号的映射关系读取excel内容
	 * @param filePath
	 * @param columnPropertyMapping
	 * @param titleRow 表头
	 * @return
	 */
	ExcelResult readExcel(String filePath,Map<Integer, String> columnPropertyMapping,Integer titleRow);
	/**
	 * 根据属性列序号的映射关系读取excel内容
	 * @param filePath
	 * @param columnPropertyMapping
	 * @param rule
	 * @param titleRow
	 * @return
	 */
	ExcelResult readExcel(String filePath,Map<Integer, String> columnPropertyMapping,ExcelValidRule rule,Integer titleRow);
	/**
     * 导出对象到Excel，不是基于模板的，直接新建一个Excel完成导出，基于路径的导出
     * @param outPath 导出路径
     * @param objs 对象列表
     * @param clz 对象类型
     */
	void exportObj2Excel(String outPath, List objs,Class clz);
	/**
     * 导出对象到Excel，不是基于模板的，直接新建一个Excel完成导出，基于流
     * @param os 输出流
     * @param objs 对象列表
     * @param clz 对象类型
     */
	void exportObj2Excel(OutputStream os,List objs,Class clz);
	/**
     * 从类路径读取相应的Excel文件到对象列表
     * @param path 文件路径
     * @param clz 对象类型
     * @param readLine 开始行，注意是标题所在行
     * @param tailLine 底部有多少行，在读入对象时，会减去这些行
     * @return
     */
	List<Object> readExcel2Objs(String path,Class clz,int readLine,int tailLine);
	/**
     * 从文件路径读取相应的Excel文件到对象列表，标题行为0，没有尾行
     * @param path 路径
     * @param clz 类型
     * @return 对象列表
     */
	List<Object> readExcel2Objs(String path,Class clz);
}
