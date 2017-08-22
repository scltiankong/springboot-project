package com.blueocean.tpf.job.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.blueocean.tpf.common.base.Query;
import com.blueocean.tpf.common.data.Page;
import com.blueocean.tpf.common.data.Result;
import com.blueocean.tpf.job.entity.ScheduleJobLog;
import com.blueocean.tpf.job.service.ScheduleJobLogService;

/**
 * 定时任务日志
 */
@RestController
@RequestMapping("/scheduleLog")
public class ScheduleJobLogController {
	@Autowired
	private ScheduleJobLogService scheduleJobLogService;
	
	/**
	 * 定时任务日志列表
	 */
	@RequestMapping("/list")
	public Result list(@RequestParam Query query){
		//查询列表数据
		List<ScheduleJobLog> jobList = scheduleJobLogService.queryList(query);
		int total = scheduleJobLogService.queryTotal(query);
		
		Page pageUtil = new Page(jobList, total, query.getPageSize(), query.getPage());
		
		return Result.ok(pageUtil);
	}
	
	/**
	 * 定时任务日志信息
	 */
	@RequestMapping("/info/{logId}")
	public Result info(@PathVariable("logId") Long logId){
		ScheduleJobLog log = scheduleJobLogService.queryObject(logId);
		return Result.ok(log);
	}
}
