package com.blueocean.tpf.redis.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.blueocean.tpf.entity.RedisDemo;
import com.blueocean.tpf.entity.RedisTestDemo;
import com.blueocean.tpf.redis.dao.RedisDemoDao;
import com.blueocean.tpf.redis.service.RedisDemoService;
@Service
/**
 * 编写RedisDemoService，这里有两个技术方面，
 * 第一就是使用Spring @Cacheable注解方式和RedisTemplate对象进行操作，具体代码如下
 * @author scl
 *
 */
public class RedisDemoServiceImpl implements RedisDemoService{
	@Autowired
	private RedisDemoDao redisDemoDao;
	@Autowired
	private RedisTemplate<String,String> redisTemplate;
	
	//keyGenerator="myKeyGenerator"
    @Cacheable(value="redisDemo",key="'redisDemo'+#p0")//缓存,这里没有指定key.
	@Override
	public RedisDemo findById(long id) {
    	
    	System.err.println("DemoInfoServiceImpl.findById()=========从数据库中进行获取的....id="+id);

		return redisDemoDao.getById(id);
	}
    @CacheEvict(value="redisDemo",cacheNames="redisDemo")
	@Override
	public void deleteFromCache(long id) {
    	System.out.println("DemoInfoServiceImpl.delete().从缓存中删除.");
	}
	@Override
	@Cacheable(value="testRedis",key="'testRedis'+#p0")//缓存,这里没有指定key.
	public RedisTestDemo findId(long id) {
		return redisDemoDao.get(id);
	}
	@CachePut(value="redisDemo",key="'redisDemo'+#p0.id")
	@Override
	public RedisDemo save(RedisDemo demo) {
		redisDemoDao.save(demo);
		return demo;
	}
	@CachePut(value="redisDemo",key="'redisDemo'+#p0.id")
	@Override
	public RedisDemo update(RedisDemo demo) {
		redisDemoDao.update(demo);
		return demo;
	}
}
