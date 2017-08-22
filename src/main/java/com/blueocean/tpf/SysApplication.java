package com.blueocean.tpf;

import java.util.Properties;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ImportResource;

import com.blueocean.tpf.common.util.FilesUtil;
@SpringBootApplication
@ImportResource(locations={"classpath:config/spring-tx.xml"})
public class SysApplication extends SpringBootServletInitializer {
	// 开发环境配置文件地址
	private static String DEV_CONF_FILE = "classpath:config/application.properties";
	// 生产环境配置文件地址
	private static String PRD_CONF_FILE = "/data1/xinsrv/java_properties/core.properties";

	/** 本地测试使用的程序入口 */
	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(SysApplication.class);
		init(false, app);
		app.run(args);
	}

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
		init(true, builder.application());
		return builder.sources(SysApplication.class);
	}

	/**
	 * 程序加载前的相关初始化
	 * 
	 * @param server 是否在服务端进行启动, 默认本地以main方法形式启动服务, 生产环境则使用war包上传的形式进行启动--相关启动在
	 * @see com.xin.base.web.InitWebServlet
	 */
	public static void init(boolean server, SpringApplication app) {
		try {
			Properties property = getProperties(server);
			app.setDefaultProperties(property);
		} catch (Exception e) {
		}
	}

	private static Properties getProperties(boolean server) {
		Properties property = null;
		if (server) {// 如果是服务器Linux下需要加载的配置
			property = FilesUtil.loadProperty(DEV_CONF_FILE);
		} else {
			property = FilesUtil.loadProperty(DEV_CONF_FILE);
		}
		return property;
	}
}
