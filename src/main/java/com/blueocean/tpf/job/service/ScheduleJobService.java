package com.blueocean.tpf.job.service;

import java.util.List;

import com.blueocean.tpf.common.base.Query;
import com.blueocean.tpf.common.data.Page;
import com.blueocean.tpf.job.entity.ScheduleTimer;

/**
 * 定时任务
 */
public interface ScheduleJobService {

	/**
	 * 根据ID，查询定时任务
	 */
	ScheduleTimer queryObject(Long jobId);
	
	/**
	 * 查询定时任务列表
	 */
	List<ScheduleTimer> queryList(Query query);
	
	/**
	 * 分页查询
	 */
	Page  queryList4Page(Query query);
	
	/**
	 * 保存定时任务
	 */
	void save(ScheduleTimer scheduleJob);
	
	/**
	 * 更新定时任务
	 */
	void update(ScheduleTimer scheduleJob);
	
	/**
	 * 批量删除定时任务
	 */
	void deleteBatch(Long[] jobIds);
	
	/**
	 * 批量更新定时任务状态
	 */
	int updateBatch(Long[] jobIds, int status);
	
	/**
	 * 立即执行
	 */
	void run(Long[] jobIds);
	
	/**
	 * 暂停运行
	 */
	void pause(Long[] jobIds);
	
	/**
	 * 恢复运行
	 */
	void resume(Long[] jobIds);
}
