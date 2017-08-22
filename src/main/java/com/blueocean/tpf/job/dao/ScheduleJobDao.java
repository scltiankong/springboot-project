package com.blueocean.tpf.job.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.blueocean.tpf.common.base.BaseDao;
import com.blueocean.tpf.job.entity.ScheduleTimer;

/**
 * 定时任务
 */
@Mapper
public interface ScheduleJobDao extends BaseDao<ScheduleTimer> {
	
	/**
	 * 批量更新状态
	 */
	int updateBatch(Map<String, Object> map);

	ScheduleTimer queryObject(Long jobId);

	List<ScheduleTimer> queryListByIds(Long[] jobIds);
}
