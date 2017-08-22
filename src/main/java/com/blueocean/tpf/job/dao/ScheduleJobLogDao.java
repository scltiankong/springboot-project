package com.blueocean.tpf.job.dao;

import org.apache.ibatis.annotations.Mapper;

import com.blueocean.tpf.common.base.BaseDao;
import com.blueocean.tpf.job.entity.ScheduleJobLog;

/**
 * 定时任务日志
 */
@Mapper
public interface ScheduleJobLogDao extends BaseDao<ScheduleJobLog> {

	ScheduleJobLog queryObject(Long jobId);
	
}
