package com.blueocean.tpf.common.component.excel.service;

import java.io.OutputStream;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.blueocean.tpf.common.component.excel.model.ExcelResult;
import com.blueocean.tpf.common.component.excel.valid.ExcelValidRule;
@SuppressWarnings("rawtypes")
public interface ExcelWriterService extends ExcelService{

	/**
	 * 校验excel单元格内容合法性
	 * @param file excel格式的文件
	 * @param rule 校验规则
	 */
	ExcelResult validExcelContent(MultipartFile file,ExcelValidRule rule);
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
}
