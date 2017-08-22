package com.blueocean.tpf.dynamicdb.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.blueocean.tpf.common.annotation.TargetDataSource;
import com.blueocean.tpf.dynamicdb.config.DynamicDataSourceContextHolder;
import com.blueocean.tpf.dynamicdb.dao.DynamicDemoDao;
import com.blueocean.tpf.dynamicdb.service.DynamicDemoService;
import com.blueocean.tpf.entity.RedisDemo;
import com.blueocean.tpf.entity.RedisTestDemo;
@Service
public class DynamicDbDemoServiceImpl implements DynamicDemoService{
	@Autowired
	private DynamicDemoDao dynamicDemoDao;
	@Override
	@TargetDataSource(name="slave")
	public RedisDemo findById(long id) {
		DynamicDataSourceContextHolder.setDataSourceType("master");
		RedisDemo demo = dynamicDemoDao.getById(id);
		System.err.println(demo);
		DynamicDataSourceContextHolder.setDataSourceType("slave");
		RedisDemo demo1 = dynamicDemoDao.getById(id);
		System.err.println(demo1);
		return demo1;
	}
	@Override
	public void deleteFromCache(long id) {
    	System.out.println("DemoInfoServiceImpl.delete().从缓存中删除.");
	}
	@Override
	public RedisTestDemo findId(long id) {
		return dynamicDemoDao.get(id);
	}
	@Override
	public RedisDemo save(RedisDemo demo) {
		dynamicDemoDao.save(demo);
		return demo;
	}
	@Override
	public RedisDemo update(RedisDemo demo) {
		dynamicDemoDao.update(demo);
		return demo;
	}
}
