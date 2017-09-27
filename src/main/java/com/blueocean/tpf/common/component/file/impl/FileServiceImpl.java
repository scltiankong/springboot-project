package com.blueocean.tpf.common.component.file.impl;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.blueocean.tpf.common.component.file.FileService;
import com.blueocean.tpf.common.consts.ResultCode;
import com.blueocean.tpf.common.exception.CustomException;
import com.blueocean.tpf.common.util.ImageUtil;
@Component
public class FileServiceImpl implements FileService{
	@Value("${file.uploadPath}")
	private String rootPath;
	private static final String FILE_EXT = ".lh";
	private static final String FILE_PATH = "file/";
	private static final String IMAGE_PATH = "img/";
	private static final String EXE_FILE = ".exe";
	public void setRootPath(String rootPath) {
		this.rootPath = rootPath;
	}
	@Override
	public String upload(MultipartFile file) {
		return upload(file,null);
	}
	/**
	 * 上传文件到目标路径
	 * @param file
	 * @param filePath
	 * @throws IOException 
	 */
	private void doUpload(MultipartFile file, String filePath) throws IOException {
		File desFile = new File(filePath);
		if (!desFile.exists()) {
			FileUtils.forceMkdirParent(desFile);
		}
		file.transferTo(desFile);
	}
	/**
	 * 获取文件上传路径
	 * @param fileName
	 * @return
	 */
	private String getFilePath(String fileName,boolean isImage) {
		String upload = validRootFilePath();
		if (!isImage) {
			upload += FILE_PATH;
		}else {
			upload += IMAGE_PATH;
		}
		return upload+fileName;
	}
	/**
	 * 校验文件上传根路径配置
	 * @return
	 */
	private String validRootFilePath() {
		String filePath = rootPath;
		if (filePath == null) {
			throw new RuntimeException("文件上传路径格式错误");
		}
		if (!filePath.endsWith("/")) {
			filePath += "/";
		}
		return filePath;
	}
	/**
	 * 校验文件格式并重命名上传文件为时间戳格式
	 * @param file
	 * @param format
	 * @return
	 */
	private String renameFileName(MultipartFile file,String format) {
		long time = System.currentTimeMillis();
		String filename = file.getOriginalFilename();
		if (file == null || file.isEmpty()) {
			throw new CustomException("参数有误,请重新上传",ResultCode.ERROR_MSG);
		}
		if (format != null) {
			if (!filename.endsWith(format)) {
				throw new CustomException("文件格式不正确,请重新上传",ResultCode.ERROR_MSG);
			}
		}
		if (filename.endsWith(EXE_FILE)) {
			filename += FILE_EXT;
		}
		return time+filename;
	}
	@Override
	public String upload(MultipartFile file, String format) {
		//校验文件
		String fileName = renameFileName(file,format);
		InputStream inputStream = null;
		try {
			inputStream = file.getInputStream();
			boolean image = ImageUtil.isImage(inputStream);
			//获取文件上传路径
			String filePath = getFilePath(fileName,image);
			//文件上传
			doUpload(file,filePath);
			return filePath;
		} catch (IOException e) {
			throw new CustomException("上传文件失败");
		}
	}
	@Override
	public String upload(MultipartFile file, boolean compress) {
		InputStream inputStream = null;
		try {
			inputStream = file.getInputStream();
			String fileName = renameFileName(file,null);
			boolean image = ImageUtil.isImage(inputStream);
			if (!image) {
				throw new CustomException("图片内容非法");
			}
			//获取文件上传路径
			String filePath = getFilePath(fileName,image);
			inputStream = file.getInputStream();
			compressImage(compress, inputStream, fileName, filePath);
			//文件上传
			doUpload(file,filePath);
			return filePath;
		} catch (IOException e) {
			throw new CustomException("上传文件失败");
		}
	}
	private void compressImage(boolean compress, InputStream inputStream, 
			String fileName, String filePath) {
		if (compress) {
			String cmpFile = filePath.replace(fileName, "cmp/"+fileName);
			try {
				ImageUtil.resize(inputStream, cmpFile, 320,240);
			} catch (Exception e) {
				throw new CustomException("图片压缩失败");
			}
		}
	}
}
