package com.blueocean.tpf.common.util;

import java.lang.reflect.Array;
import java.util.Collection;
import java.util.Map;

/**
 * 数据校验工具类
 * @author scl
 *
 */
public class DataValidUtil {
	/**
	 * 检测多个值是否为null, 任何一个不符合条件返回false, 如果是String, 检测是否为""
	 * @param arr
	 * @return	""或者null 返回true
	 */
	public static boolean isEmpty(Object... arr){
		if(arr == null || arr.length == 0) return true;
		for (Object obj : arr) {
			if(isEmpty(obj)) return true;
		}
		return false;
	}
	/**
	 * 判断对象是否Empty(null或元素为0)<br>
	 * 实用于对如下对象做判断:String Collection及其子类 Map及其子类
	 * 
	 * @param pObj 待检查对象
	 * @return boolean 返回的布尔值
	 */
	@SuppressWarnings("rawtypes")
	public static boolean isEmpty(Object pObj) {
		if (pObj == null)
			return true;
		if (pObj instanceof String) {
			return "".equals(((String)pObj).replaceAll("\\s", ""));
		}
		if (pObj instanceof Collection) {
			return ((Collection) pObj).isEmpty();
		}
		if (pObj.getClass().isArray()) {
			return Array.getLength(pObj)==0;
		}
		if (pObj instanceof Map) {
			return ((Map) pObj).isEmpty();
		}
		return false;
	}
}
