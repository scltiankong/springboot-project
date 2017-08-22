package com.blueocean.tpf.job.service.impl;

import org.springframework.stereotype.Service;

import com.blueocean.tpf.job.service.TestTaskService;
@Service
public class TestTaskServiceImpl implements TestTaskService{

	@Override
	public void testTask() {
		System.out.println("这是个测试的定时任务");
	}

	@Override
	public void testTask2() {
		System.err.println("这是个测试的定时任务");
	}
}
