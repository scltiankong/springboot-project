package com.blueocean.tpf.common.component.excel.service.impl;

import java.io.IOException;
import java.io.OutputStream;
import java.lang.reflect.InvocationTargetException;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.apache.commons.beanutils.BeanUtils;

import com.blueocean.tpf.common.component.excel.model.ExcelHeader;
import com.blueocean.tpf.common.component.excel.model.ExcelTemplate;
import com.blueocean.tpf.common.component.excel.service.TemplateExcelService;
import com.blueocean.tpf.common.component.excel.util.ExcelUtil;
@SuppressWarnings("rawtypes")
public class TemplateExcelServiceImpl implements TemplateExcelService{
	@Override
	public void exportObj2ExcelByTemplate(Map<String, String> datas, String template, OutputStream os, List objs,
			Class clz) {
		try {
			ExcelTemplate et = handlerObj2Excel(template, objs, clz);
			et.replaceFinalData(datas);
			et.wirteToStream(os);
			os.flush();
			os.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	/**
     * 处理对象转换为Excel
     * @param templatePath 模板文件路径
     * @param objs 数据列表
     * @param clz 数据类型
     * @return
     */
    private ExcelTemplate handlerObj2Excel (String templatePath, List objs, Class clz)  {
        ExcelTemplate et = ExcelTemplate.getInstance();
        try {
        	et.readTemplate(templatePath);
            List<ExcelHeader> headers = ExcelUtil.getInstance().getHeaderList(clz);
            Collections.sort(headers);
            //输出标题
            et.createNewRow();
            for(ExcelHeader eh:headers) {
                et.createCell(eh.getTitle());
            }
            //输出值
            for(Object obj:objs) {
                et.createNewRow();
                for(ExcelHeader eh:headers) {
                    et.createCell(BeanUtils.getProperty(obj,ExcelUtil.getInstance().getMethodName(eh)));
                }
            }
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        }
        return et;
    }
	@Override
	public void exportObj2ExcelByTemplate(Properties prop, String template, OutputStream os, List objs, Class clz) {
		ExcelTemplate et = handlerObj2Excel(template, objs, clz);
        et.replaceFinalData(prop);
        et.wirteToStream(os);
	}
	@Override
	public void exportObj2ExcelByTemplate(Map<String, String> datas, String template, String outPath, List objs,
			Class clz) {
		ExcelTemplate et = handlerObj2Excel(template, objs, clz);
		et.replaceFinalData(datas);
		et.writeToFile(outPath);
	}
	@Override
	public void exportObj2ExcelByTemplate(Properties prop, String template, String outPath, List objs, Class clz) {
		ExcelTemplate et = handlerObj2Excel(template, objs, clz);
		et.replaceFinalData(prop);
		et.writeToFile(outPath);
	}
}
