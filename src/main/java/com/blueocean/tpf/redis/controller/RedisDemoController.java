package com.blueocean.tpf.redis.controller;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blueocean.tpf.entity.RedisDemo;
import com.blueocean.tpf.entity.RedisTestDemo;
import com.blueocean.tpf.redis.service.RedisDemoService;

import redis.clients.jedis.Jedis;

@RestController
@RequestMapping("/redis")
public class RedisDemoController {

	@Autowired
	RedisDemoService demoInfoService;

	@RequestMapping("redis")
	public String hello(long id) {
		RedisDemo loaded = demoInfoService.findById(id);

		System.out.println("loaded=" + loaded);

		RedisDemo cached = demoInfoService.findById(id);

		System.out.println("cached=" + cached);
		return "ok";
	}
	@RequestMapping("test")
	public String test(long id) {
		RedisTestDemo loaded = demoInfoService.findId(id);
		
		System.out.println("loaded=" + loaded);
		
		RedisDemo cached = demoInfoService.findById(id);
		
		System.out.println("cached=" + cached);
		return "ok";
	}

	@RequestMapping("/delete")

	public String delete(long id) {
		demoInfoService.deleteFromCache(id);

		return "ok";

	}
	@RequestMapping("/save")
	
	public String save(@RequestBody RedisDemo demo) {
		demoInfoService.save(demo);
		return "ok";
		
	}
	@RequestMapping("/update")
	
	public String update(RedisDemo demo) {
		demoInfoService.update(demo);
		return "ok";
		
	}
	public static void main(String[] args) {
		Jedis jedis = new Jedis("192.168.237.128", 6379);
		Set<String> keys = jedis.keys("*");
		System.out.println(keys);
	}
}
