package com.blueocean.tpf.dynamicdb.dao;

import org.apache.ibatis.annotations.Mapper;

import com.blueocean.tpf.entity.RedisDemo;
import com.blueocean.tpf.entity.RedisTestDemo;
@Mapper
public interface DynamicDemoDao{

	RedisDemo getById(long id);
	RedisTestDemo get(long id);
	void save(RedisDemo demo);
	void update(RedisDemo demo);
	
}
