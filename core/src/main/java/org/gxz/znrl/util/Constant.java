package org.gxz.znrl.util;

import org.gxz.znrl.entity.ConstantEntity;
import org.gxz.znrl.business.DataManager;
import org.gxz.znrl.schedule.EngineCfgBean;

import java.util.HashMap;
import java.util.List;

/**
 * Created by xieyt on 14-12-10.
 */
public class Constant {
    //websocket空闲会话保持时长（毫秒）
    public final static long KEEP_IDLE_WS_SESSION_TIMEOUT = 3600*1000*5;

    //socket 监听端口
    public final static int SOCKET_LISTEN_PORT = 2012;

    //终端信息统一接入socket 监听端口
    public final static int TERMINAL_SOCKET_LISTENER_PORT = 2017;

    //执行线程池的个数
    public final static int TERMINAL_THREAD_CNT = 20;

    //循环标识，如果置为false，则结束监听
    public static boolean LOOP_TAG = true;

    //监控页面汇总数据刷新间隔时间（毫秒）
    public final static long QRY_QUEUE_INTERVAL = 30*1000;

    //存放引擎配置参数的集合
    public static HashMap<String, EngineCfgBean> cfgMap = new HashMap<String, EngineCfgBean>();

    //cronTrigger名称的后缀
    public static final String TRIGGERNAME_TAIL = "-triggerName";

    //JOBDETAIL名称的后缀
    public static final String JOBNAME_TAIL = "-jobName";

    //放在jobdatamap里的实现真实业务逻辑job的名称
    public static final String JOB_DATAMAP_KEY = "myjob";

    //任务类型，1主动往websocket发送测点
    public static final String TASK_TYPE_SEND_WS = "1";

    //任务类型，从外系统同步数据
    public static final String TASK_TYPE_SYNC_DATA = "2";

    //其它任务类型
    public static final String TASK_TYPE_OTHERS = "5";

    //日志文件配置，测点日志
    public static final String LOG_INFOPOINT = "InfoPoint";

    //同步设备数据日志
    public static final String LOG_SYNCDATA = "SyncData";

    //设备读写数据日志
    public static final String LOG_DEVICE_RW = "deviceRW";

    //同步设备数据日志
    public static final String LOG_SENDCMD = "SendCmd";

    //报表日志
    public static final String LOG_REPORT = "Report";

    //统一终端业务处理接口
    public static final String TERMINAL_BIZ_PROC = "TerminalBizProc";


    //任务是否在运行标识
    public static HashMap<String, String> taskRunningMap = new HashMap<>();
    public static final String TASK_RUNNING_TAG = "threadRunningTag";
    public static final String TASK_RUNNING = "RUNNING";
    public static final String TASK_WAITING = "WAITING";


    //系统静态参数内存存放
    public static HashMap<String, String> constantMap = new HashMap<String, String>();

    //OPC服务器初始化准备标识，开始默认没准备好
    public static boolean OPC_PREPARED_TAG = false;

    //开始获取多次，以防数据库连接开始建立的时候超时
    public boolean loadConst(){
        boolean res = false;
        for (int i = 1; i<= 12; i++) {
            System.out.println("************* the "+i+" times to get JDBC connections....");
            qryConst();
            if (constantMap.size() > 0) {
                res = true;
                break;
            }
        }
        return res;
    }

    //从constant_data_config表加载静态配置数据
    public void qryConst(){
        constantMap.clear();
        try {
            List<ConstantEntity> list = DataManager.getInstance().qryConstantCfgData();
            for (ConstantEntity c : list) {
                constantMap.put(c.getKey(),c.getValue());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    //从静态表里获取
    public static String get(String key) {
        return constantMap.get(key);
    }

}

