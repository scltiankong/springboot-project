package com.blueocean.tpf.common.util;

import java.text.SimpleDateFormat;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

/**
 * json 序列化工具类
 * @author Administrator
 *
 */
public class JsonSerializUtil {
	private static ObjectMapper mapper = new ObjectMapper();
	static {
		mapper.configure(SerializationFeature.INDENT_OUTPUT, true);
	}
	/**
	 * java对象转为json字符串
	 * @param obj
	 * @return
	 */
	public static String javaToJson(Object obj) {
		try {
			mapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));
			return mapper.writeValueAsString(obj);
		} catch (Exception e) {}
		return null;
	}
	/**
	 * java对象转为json字符串
	 * @param obj
	 * @return
	 */
	public static <T> T jsonToJava(Object json,Class<T> clazz) {
		try {
			return mapper.readValue(json.toString(), clazz);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
}
