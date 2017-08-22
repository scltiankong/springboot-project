package com.blueocean.tpf.job.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.blueocean.tpf.common.base.Query;
import com.blueocean.tpf.job.dao.ScheduleJobLogDao;
import com.blueocean.tpf.job.entity.ScheduleJobLog;
import com.blueocean.tpf.job.service.ScheduleJobLogService;

@Service("scheduleJobLogService")
public class ScheduleJobLogServiceImpl implements ScheduleJobLogService {
	@Autowired
	private ScheduleJobLogDao scheduleJobLogDao;
	
	@Override
	public ScheduleJobLog queryObject(Long jobId) {
		return scheduleJobLogDao.queryObject(jobId);
	}

	@Override
	public List<ScheduleJobLog> queryList(Query query) {
		return scheduleJobLogDao.queryList(query);
	}

	@Override
	public int queryTotal(Query query) {
		return scheduleJobLogDao.count(query);
	}

	@Override
	public void save(ScheduleJobLog log) {
		scheduleJobLogDao.save(log);
	}

}
