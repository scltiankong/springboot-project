package com.blueocean.tpf.common.component.excel.out;

import java.io.Serializable;

/**
 * excel输出接口
 * @author scl
 *
 */
public interface ExcelOutputSystem<T> extends Serializable{
	void output(T t);
}
