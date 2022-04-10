package org.gxz.znrl.business;

import org.apache.log4j.Logger;
import org.gxz.znrl.schedule.EngineCfgBean;
import org.gxz.znrl.util.CommonUtil;
import org.gxz.znrl.util.Constant;

import java.sql.Connection;
import java.sql.SQLException;

/**
 * Created by xieyt on 15-11-24.
 */
public class BusinessDataSync {
    private static Logger syncDataLogger = Logger.getLogger(Constant.LOG_SYNCDATA);
    private static CommonUtil commonUtil = new CommonUtil();
    private EngineCfgBean ecb;

    public BusinessDataSync(EngineCfgBean bean){
        this.ecb = bean;
        loadSql();
    }

    public void executeSync() throws Exception {
        boolean  wbRes = true;//true表示执行成功
        boolean  syncRes = false;//true表示执行成功
        Connection connOther = null;
        Connection connZNRL = null;

        try {
            //获取需要同步的数据
            String dataString = DataManager.getInstance().getSyncData(ecb);
//            System.out.println("taksconf="+ecb.getTaskConfId()+",dataString="+dataString);
            syncDataLogger.info("获取同步数据(任务："+ ecb.getName()+"):"+dataString!=null&&dataString.length()>200?dataString.substring(0,200)+"...":dataString);
//            System.out.println(dataString!=null&&dataString.length()>200?dataString.substring(0,200)+"...":dataString);
            //数据入库znrl数据库
            connZNRL = getConn(ecb.getOurDBSource());
            if (connZNRL == null) {
                syncDataLogger.error("未获取到管控系统数据库连接，任务：" + ecb.getName());
            }
            syncRes = DataManager.getInstance().syncData2TargetDB(ecb, dataString, connZNRL);

            if (!syncRes) {
                syncDataLogger.error("同步数据入库失败，任务："+ ecb.getName());
            } else {
                syncDataLogger.info("同步数据入库成功，任务："+ ecb.getName());

                //回写状态
                connOther = null;
                if (ecb.getWriteBackTag().equalsIgnoreCase("Y")) {
                    connOther = getConn(ecb.getDbSource());
                    if (connOther == null) {
                        syncDataLogger.error("未获取外系统数据库连接，任务终止，任务：" + ecb.getName());
                        return;
                    }

                    wbRes = DataManager.getInstance().writeBackSyncData(ecb, dataString, connOther);
                    if (!wbRes) {
                        syncDataLogger.error("同步数据回写状态失败，任务："+ ecb.getName());
                    } else {
                        syncDataLogger.info("同步数据回写状态成功，任务："+ ecb.getName());
                    }
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
            syncDataLogger.error("同步数据入库发生异常["+e.getMessage()+"]，任务："+ ecb.getName());
        } finally {
            //同步事务控制，同时提交或同时回滚
            if(wbRes && syncRes){
                if (connOther != null){
                    connOther.commit();
                    connOther.close();
                    syncDataLogger.info("外系统回写事务提交成功，任务："+ ecb.getName());
                }
                if (connZNRL != null){
                    connZNRL.commit();
                    connZNRL.close();
                    syncDataLogger.info("管控系统入库事务提交成功，任务："+ ecb.getName());
                }
            } else {
                if (connOther != null){
                    connOther.rollback();
                    connOther.close();
                    syncDataLogger.info("外系统回写事务被回滚，任务："+ ecb.getName());
                }
                if (connZNRL != null){
                    connZNRL.rollback();
                    connZNRL.close();
                    syncDataLogger.info("管控系统入库事务被回滚，任务："+ ecb.getName());
                }
            }
        }


    }

    /**
     * 为了在这层控制事务而获取conn
     * @param dsName
     * @return
     */
    private Connection getConn(String dsName){
        if (dsName == null) {
            syncDataLogger.error("请检查数据源配置，任务：" + ecb.getName());
            return null;
        }

        Connection conn = null;
        try {
            conn = commonUtil.getConnection(dsName);
            if (conn == null) {
                syncDataLogger.error("未获取到数据库连接，任务：" + ecb.getName());
            }
        } catch (Exception e) {
            syncDataLogger.error("获取数据库连接失败，任务：" + ecb.getName());
        }
        return conn;
    }

    /**
     * 加载sql文件
     */
    private void loadSql() {
        if (CommonUtil.sqlMap.isEmpty()) {
            try {
                syncDataLogger.info("开始从文件加载同步数据的sql..");
                CommonUtil.loadSqlXmlFile();
                syncDataLogger.info("同步数据的sql语句加载成功!");
            } catch (Exception e) {
                syncDataLogger.error("同步数据的sql语句加载异常:" + e.getMessage());
            }
        }
    }
}
