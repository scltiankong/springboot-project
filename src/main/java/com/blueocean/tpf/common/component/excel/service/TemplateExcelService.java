package com.blueocean.tpf.common.component.excel.service;

import java.io.OutputStream;
import java.util.List;
import java.util.Map;
import java.util.Properties;
@SuppressWarnings("rawtypes")
public interface TemplateExcelService {
	/**
     * 将对象转换为Excel并且导出，该方法是基于模板的导出，导出到流
     * @param datas 模板中的替换的常量数据
     * @param template 模板路径
     * @param os 输出流
     * @param objs 对象列表
     * @param clz 对象的类型
     */
	void exportObj2ExcelByTemplate(Map<String,String> datas, String template, OutputStream os, List objs, Class clz);
	/**
     * 将对象转换为Excel并且导出，该方法是基于模板的导出，导出到流,基于Properties作为常量数据
     * @param prop 基于Properties的常量数据模型
     * @param template 模板路径
     * @param os 输出流
     * @param objs 对象列表
     * @param clz 对象的类型
     */
	void exportObj2ExcelByTemplate(Properties prop, String template, OutputStream os, List objs, Class clz);
	 /**
     * 将对象转换为Excel并且导出，该方法是基于模板的导出，导出到一个具体的路径中
     * @param datas 模板中的替换的常量数据
     * @param template 模板路径
     * @param outPath 输出路径
     * @param objs 对象列表
     * @param clz 对象的类型
     */
	void exportObj2ExcelByTemplate(Map<String,String> datas,String template,String outPath,List objs,Class clz);
	 /**
     * 将对象转换为Excel并且导出，该方法是基于模板的导出，导出到一个具体的路径中,基于Properties作为常量数据
     * @param prop 基于Properties的常量数据模型
     * @param template 模板路径
     * @param outPath 输出路径
     * @param objs 对象列表
     * @param clz 对象的类型
     */
	void exportObj2ExcelByTemplate(Properties prop,String template,String outPath,List objs,Class clz);
}
