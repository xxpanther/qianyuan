package org.gxz.znrl.schedule;

import org.apache.log4j.Logger;
import org.gxz.znrl.util.Constant;
import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

/**
 * job代理类，jobdetail为了能接受外界参数而建立的，通过jobdatamap传递参数
 * @author xieyt
 */
public class JobProxy implements Job{
    private static Logger logger = Logger.getLogger(JobProcess.class);
    private JobProcess job = null;

    public void execute(JobExecutionContext context) throws JobExecutionException {
        JobDataMap jobDataMap = context.getJobDetail().getJobDataMap();

        this.job = (JobProcess) jobDataMap.get(Constant.JOB_DATAMAP_KEY);

        try {
            this.job.execute();
        } catch (Exception e) {
            logger.error("JOB的代理类执行具体任务异常："+e.getMessage());
            throw new JobExecutionException(e);
        }
    }

}
