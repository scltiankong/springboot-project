package com.blueocean.tpf.dynamicdb.controller;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blueocean.tpf.dynamicdb.service.DynamicDemoService;
import com.blueocean.tpf.entity.RedisDemo;
import com.blueocean.tpf.entity.RedisTestDemo;
import com.blueocean.tpf.redis.service.RedisDemoService;

import redis.clients.jedis.Jedis;

@RestController
public class DynamicDemoController {

	@Autowired
	DynamicDemoService demoInfoService;

	@RequestMapping("dynamic")
	public String hello(long id) {
		RedisDemo loaded = demoInfoService.findById(id);
		System.out.println("loaded=" + loaded);
		return "ok";
	}
}
