package com.blueocean.tpf.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.blueocean.tpf.common.component.interf.FileService;

@RestController
public class TestController {
	@Autowired
	private FileService fileService;
	@RequestMapping("upload")
	public String upload(MultipartFile file){
		String upload = fileService.upload(file, true);
		return upload;
	}
}
