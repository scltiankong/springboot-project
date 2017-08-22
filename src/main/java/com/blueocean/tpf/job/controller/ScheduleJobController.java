package com.blueocean.tpf.job.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blueocean.tpf.common.annotation.SysLog;
import com.blueocean.tpf.common.base.Query;
import com.blueocean.tpf.common.data.Page;
import com.blueocean.tpf.common.data.Result;
import com.blueocean.tpf.job.entity.ScheduleTimer;
import com.blueocean.tpf.job.service.ScheduleJobService;

/**
 * 定时任务
 */
@RestController
@RequestMapping("schedule")
public class ScheduleJobController {
	@Autowired
	private ScheduleJobService scheduleJobService;
	
	/**
	 * 定时任务列表
	 */
	@RequestMapping("/list")
	public Result list(@RequestBody Query query){
		//查询列表数据
		Page page = scheduleJobService.queryList4Page(query);
		return Result.ok(page);
	}
	
	/**
	 * 定时任务信息
	 */
	@RequestMapping("/info/{jobId}")
	public Result info(@PathVariable("jobId") Long jobId){
		ScheduleTimer schedule = scheduleJobService.queryObject(jobId);
		return Result.ok(schedule);
	}
	
	/**
	 * 保存定时任务
	 */
	@SysLog("保存定时任务")
	@RequestMapping("/save")
	public Result save(@RequestBody @Valid ScheduleTimer scheduleJob){
		scheduleJobService.save(scheduleJob);
		return Result.ok();
	}
	
	/**
	 * 修改定时任务
	 */
	@SysLog("修改定时任务")
	@RequestMapping("/update")
	public Result update(@RequestBody @Valid ScheduleTimer scheduleJob){
		scheduleJobService.update(scheduleJob);
		return Result.ok();
	}
	
	/**
	 * 删除定时任务
	 */
	@SysLog("删除定时任务")
	@RequestMapping(value = "/delete")
	public Result delete(@RequestBody Long[] jobIds){
		scheduleJobService.deleteBatch(jobIds);
		return Result.ok();
	}
	
	/**
	 * 立即执行任务
	 */
	@SysLog("立即执行任务")
	@RequestMapping("/run")
	public Result run(@RequestBody Long[] jobIds){
		scheduleJobService.run(jobIds);
		return Result.ok();
	}
	
	/**
	 * 暂停定时任务
	 */
	@SysLog("暂停定时任务")
	@RequestMapping("/pause")
	public Result pause(@RequestBody Long[] jobIds){
		scheduleJobService.pause(jobIds);
		return Result.ok();
	}
	
	/**
	 * 恢复定时任务
	 */
	@SysLog("恢复定时任务")
	@RequestMapping("/resume")
	public Result resume(@RequestBody Long[] jobIds){
		scheduleJobService.resume(jobIds);
		return Result.ok();
	}
}
