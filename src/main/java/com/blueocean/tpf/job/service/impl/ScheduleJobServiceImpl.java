package com.blueocean.tpf.job.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.quartz.CronTrigger;
import org.quartz.Scheduler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.blueocean.tpf.common.base.Query;
import com.blueocean.tpf.common.consts.Constant.ScheduleStatus;
import com.blueocean.tpf.common.data.Page;
import com.blueocean.tpf.common.util.DateUtils;
import com.blueocean.tpf.job.dao.ScheduleJobDao;
import com.blueocean.tpf.job.entity.ScheduleTimer;
import com.blueocean.tpf.job.service.ScheduleJobService;
import com.blueocean.tpf.job.util.ScheduleUtils;

@Service("scheduleJobService")
public class ScheduleJobServiceImpl implements ScheduleJobService {
	@Autowired
    private Scheduler scheduler;
	@Autowired
	private ScheduleJobDao schedulerJobDao;
	
	/**
	 * 项目启动时，初始化定时器
	 */
	@PostConstruct
	public void init(){
		List<ScheduleTimer> scheduleJobList = schedulerJobDao.queryList(Query.createQuery().setPage(false));
		for(ScheduleTimer scheduleJob : scheduleJobList){
			CronTrigger cronTrigger = ScheduleUtils.getCronTrigger(scheduler, scheduleJob.getJobId());
            //如果不存在，则创建
            if(cronTrigger == null) {
                ScheduleUtils.createScheduleJob(scheduler, scheduleJob);
            }else {
                ScheduleUtils.updateScheduleJob(scheduler, scheduleJob);
            }
		}
	}
	
	@Override
	public ScheduleTimer queryObject(Long jobId) {
		return schedulerJobDao.queryObject(jobId);
	}

	@Override
	public List<ScheduleTimer> queryList(Query query) {
		return schedulerJobDao.queryList(query);
	}

	@Override
	public Page queryList4Page(Query query) {
		int total = schedulerJobDao.count(query);
		List<ScheduleTimer> list = new ArrayList<>();
		if (total > 0) {
			list = queryList(query);
		}
		return new Page(list, total, query.getPageSize(), query.getPage());
	}

	@Override
	public void save(ScheduleTimer scheduleJob) {
		scheduleJob.setCreateTime(DateUtils.now());
		scheduleJob.setStatus(ScheduleStatus.NORMAL.getValue());
        schedulerJobDao.save(scheduleJob);
        ScheduleUtils.createScheduleJob(scheduler, scheduleJob);
    }
	
	@Override
	public void update(ScheduleTimer scheduleJob) {
        ScheduleUtils.updateScheduleJob(scheduler, scheduleJob);
        schedulerJobDao.update(scheduleJob);
    }

	@Override
    public void deleteBatch(Long[] jobIds) {
		//删除数据
		schedulerJobDao.deleteBatch(jobIds);
    	for(Long jobId : jobIds){
    		ScheduleUtils.deleteScheduleJob(scheduler, jobId);
    	}
	}

	@Override
    public int updateBatch(Long[] jobIds, int status){
    	Map<String, Object> map = new HashMap<>();
    	map.put("list", jobIds);
    	map.put("status", status);
    	return schedulerJobDao.updateBatch(map);
    }
    
	@Override
    public void run(Long[] jobIds) {
		List<ScheduleTimer> jobs = schedulerJobDao.queryListByIds(jobIds);
    	for(ScheduleTimer job : jobs){
    		ScheduleUtils.run(scheduler, job);
    	}
    }

	@Override
    public void pause(Long[] jobIds) {
        for(Long jobId : jobIds){
    		ScheduleUtils.pauseJob(scheduler, jobId);
    	}
    	updateBatch(jobIds, ScheduleStatus.PAUSE.getValue());
    }

	@Override
    public void resume(Long[] jobIds) {
    	for(Long jobId : jobIds){
    		ScheduleUtils.resumeJob(scheduler, jobId);
    	}
    	updateBatch(jobIds, ScheduleStatus.NORMAL.getValue());
    }
    
}
