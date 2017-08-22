package com.blueocean.tpf.dynamicdb.service;

import com.blueocean.tpf.entity.RedisDemo;
import com.blueocean.tpf.entity.RedisTestDemo;
public interface DynamicDemoService {
	
	RedisDemo findById(long id);
	
	RedisDemo save(RedisDemo demo);
	
	RedisDemo update(RedisDemo demo);

	RedisTestDemo findId(long id);
    

    void deleteFromCache(long id);
}
