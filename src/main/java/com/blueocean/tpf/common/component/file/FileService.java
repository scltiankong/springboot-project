package com.blueocean.tpf.common.component.file;

import org.springframework.web.multipart.MultipartFile;

/**
 * 文件服务
 * @author scl
 *
 */
public interface FileService {
	/**
	 * 上传文件
	 * @param file
	 */
	String upload(MultipartFile file);
	/**
	 * 上传文件
	 * @param file
	 * @param format
	 */
	String upload(MultipartFile file,String format);
	/**
	 * 上传文件，只支持图片文件上传
	 * @param file
	 * @param compress 是否生成缩略图
	 */
	String upload(MultipartFile file,boolean compress);

}
