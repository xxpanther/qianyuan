package org.gxz.znrl.schedule;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.apache.log4j.Logger;
import org.gxz.znrl.business.DataManager;
import org.gxz.znrl.util.CommonUtil;
import org.gxz.znrl.util.Constant;
import org.quartz.CronTrigger;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.impl.StdSchedulerFactory;

/**
 * @author xieyt
 * 定时任务调度
 */
public class ScheduleJob extends Thread {
	Scheduler quartzScheduler = null;
    private static Logger logger = Logger.getLogger(ScheduleJob.class);
    private static Logger syncDataLogger = Logger.getLogger(Constant.LOG_SYNCDATA);

    /**
     * 启动定时任务调度线程
     */
    public void run() {
        boot();
    }

	/**
	 * 任务调度启动开始
	 */	
	private void boot() {
        //检查配置
		checkConfig();

		Iterator<String> keyIt = Constant.cfgMap.keySet().iterator();
		EngineCfgBean bean;
		CronTrigger cronTrigger;
		JobDetail jobDetail;
		try {
			quartzScheduler = new StdSchedulerFactory().getScheduler();
			while (keyIt.hasNext()){
				bean = Constant.cfgMap.get(keyIt.next());

                //设置任务运行标识,初始化为等待状态
                Constant.taskRunningMap.put(Constant.TASK_RUNNING_TAG + bean.getTaskConfId(), Constant.TASK_WAITING);

				cronTrigger = new CronTrigger(bean.getTaskConfId()+Constant.TRIGGERNAME_TAIL, bean.getTaskConfId());
		        cronTrigger.setCronExpression(bean.getCronTrigExpr());
		        
		        jobDetail = new JobDetail(bean.getTaskConfId()+Constant.JOBNAME_TAIL, bean.getTaskConfId(), JobProxy.class);
		        jobDetail.getJobDataMap().put(Constant.JOB_DATAMAP_KEY,new JobProcess(bean));
		        
		        quartzScheduler.scheduleJob(jobDetail, cronTrigger);
			}
			
			quartzScheduler.start();
		} catch (Exception e) {
			logger.error("任务调度异常，请检查参数配置:"+e.getMessage());
		}
	}
	

	/**
	  * 检查和初始化配置
	  */
	private void checkConfig() {
		if (Constant.cfgMap.isEmpty()) {
			try {
				logger.info("开始从数据库加载引擎配置参数..");
                DataManager dataManager = DataManager.getInstance();
                dataManager.getEngineConfig();
                logger.info("从数据库加载配置成功!");
			} catch (Exception e) {
				logger.error("从数据库加载配置异常:" + e.getMessage());
			}
		}
	}
}
