package com.blueocean.tpf.common.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class FilesUtil {
	private static final String CLASS_PATH = "classpath:";

	/**
	 * 验证一个文件或文件夹是否存在
	 * 
	 * @param filePath
	 *            绝对路径
	 * @return true:存在 false:不存在
	 */
	public static boolean checkFileExists(String filePath) {
		File file = new File(filePath);
		return file.exists();
	}

	/**
	 * 验证一个文件或文件夹是否存在
	 * 
	 * @param file
	 *            文件
	 * @return true:存在 false:不存在
	 */
	public static boolean checkFileExists(File file) {
		return file.exists();
	}

	public static boolean mkdirs(String filePath) {
		File file = new File(filePath);
		return checkFileExists(file) ? true : file.mkdirs();
	}

	/**
	 * 加载配置信息
	 * 
	 * @return
	 */
	public static Properties loadProperty(String path) {
		InputStream in = null;
		Properties prop = new Properties();
		try {
			in = readFileInput(path);
			prop.load(in);
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				if (in != null) {
					in.close();
				}
			} catch (IOException e) {
			}
		}
		return prop;
	}
	/**
	 * 获取输入流
	 * @param path
	 * @return
	 */
	public static InputStream readFileInput(String path) {
		InputStream in = null;
		try {
			if (path.startsWith(CLASS_PATH)) {
				path = path.substring(CLASS_PATH.length());
				in = FilesUtil.class.getClassLoader().getResourceAsStream(path);
			} else {
				in = new FileInputStream(path);
			}
		} catch (FileNotFoundException e) {}
		return in;
	}
}
