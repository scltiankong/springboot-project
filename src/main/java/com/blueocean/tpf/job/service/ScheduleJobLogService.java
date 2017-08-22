package com.blueocean.tpf.job.service;

import java.util.List;

import com.blueocean.tpf.common.base.Query;
import com.blueocean.tpf.job.entity.ScheduleJobLog;

/**
 * 定时任务日志
 */
public interface ScheduleJobLogService {

	/**
	 * 根据ID，查询定时任务日志
	 */
	ScheduleJobLog queryObject(Long jobId);
	
	/**
	 * 查询定时任务日志列表
	 */
	List<ScheduleJobLog> queryList(Query query);
	
	/**
	 * 查询总数
	 */
	int queryTotal(Query query);
	
	/**
	 * 保存定时任务日志
	 */
	void save(ScheduleJobLog log);
	
}
