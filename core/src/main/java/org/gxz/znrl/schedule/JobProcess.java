package org.gxz.znrl.schedule;

import java.lang.reflect.Constructor;
import java.lang.reflect.Method;

import org.apache.log4j.Logger;
import org.gxz.znrl.business.BusinessDataSync;
import org.gxz.znrl.util.Constant;


/**
 * 处理任务的具体操作类
 * @author xieyt
 */
public class JobProcess {
    private static Logger logger = Logger.getLogger(JobProcess.class);
    private EngineCfgBean engineCfgBean;

    /**
     * 构造方法
     */
    public JobProcess(){}

    public JobProcess(EngineCfgBean engineCfgBean){
        this.engineCfgBean = engineCfgBean;
    }


    /**
     * 任务入口
     */
    public void execute() throws Exception {

        //任务是等待状态才执行，否则直接跳过
        if (Constant.TASK_WAITING.equals(Constant.taskRunningMap.get(Constant.TASK_RUNNING_TAG + this.engineCfgBean.getTaskConfId()))) {
            //进来了，就置成等运行态
            Constant.taskRunningMap.put(Constant.TASK_RUNNING_TAG + this.engineCfgBean.getTaskConfId(), Constant.TASK_RUNNING);

            try {
                //1调用存储过程方式 2调用java类方式
                if("1".equals(this.engineCfgBean.getInvokeObjType())) {
                    //发送测点
                    if (this.engineCfgBean.getTaskType().equals(Constant.TASK_TYPE_SEND_WS)){
                        //BusinessDataSender bd = new BusinessDataSender(this.engineCfgBean);
                        //bd.executeSend();
                    } else if (this.engineCfgBean.getTaskType().equals(Constant.TASK_TYPE_SYNC_DATA)) {//同步数据
                        BusinessDataSync bds = new BusinessDataSync(this.engineCfgBean);
                        bds.executeSync();
                    }
                } else if("2".equals(this.engineCfgBean.getInvokeObjType())) {
                    if (this.engineCfgBean.getTaskType().equals(Constant.TASK_TYPE_OTHERS)){
                        Class c = Class.forName(this.engineCfgBean.getInvokeObj());
                        Constructor constructor = c.getConstructor(EngineCfgBean.class);
                        Object o = constructor.newInstance(this.engineCfgBean);
                        Method method = c.getMethod("execute", new Class[]{});
                        Object[] arguments = new Object[] {};
                        method.invoke(o, arguments);
                    }
                }

            } catch (Exception e) {
                e.printStackTrace();
                logger.error("定时调度处理业务数据发生异常：" + e.getMessage());
            } finally {
                //执行完了置成等待状态
                Constant.taskRunningMap.put(Constant.TASK_RUNNING_TAG + this.engineCfgBean.getTaskConfId(), Constant.TASK_WAITING);
            }

        }
    }

}
