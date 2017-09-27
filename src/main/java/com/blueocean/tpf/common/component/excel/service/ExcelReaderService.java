package com.blueocean.tpf.common.component.excel.service;

import java.io.File;
import java.util.List;

import com.blueocean.tpf.common.component.excel.model.CellMapper;
import com.blueocean.tpf.common.component.excel.model.ExcelResult;
@SuppressWarnings("rawtypes")
public interface ExcelReaderService extends ExcelService{
	/**
	 * 根据属性列序号的映射关系读取excel内容
	 * @param file
	 * @param mapper
	 * @param titleRow 表头
	 * @return
	 */
	ExcelResult readExcel(File file,CellMapper mapper,Integer titleRow);
	/**
	 * 根据属性列序号的映射关系读取excel内容
	 * @param fileName
	 * @param mapper
	 * @param titleRow 表头
	 * @return
	 */
	ExcelResult readExcel(String fileName,CellMapper mapper,Integer titleRow);
	/**
	 * 读取指定行区间的数据
	 * @param fileName
	 * @param mapper
	 * @param startRow
	 * @param endRow
	 * @return
	 */
	ExcelResult readExcel(String fileName,CellMapper mapper,Integer startRow,Integer endRow);
	
	List<Object> readExcel2Objs(String path,Class clz,int readLine,int tailLine);
	/**
     * 从文件路径读取相应的Excel文件到对象列表，标题行为0，没有尾行
     * @param path 路径
     * @param clz 类型
     * @return 对象列表
     */
	List<Object> readExcel2Objs(String fileName,Class clz);
}
