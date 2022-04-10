package org.gxz.znrl.util;

/**
 * Created by xieyt on 15-5-22.
 */


import com.alibaba.druid.pool.DruidDataSource;
import com.alibaba.druid.pool.DruidDataSourceFactory;
import com.mchange.v2.c3p0.ComboPooledDataSource;
import org.apache.log4j.Logger;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Properties;


public class C3P0DBConnectionManager {

    private static Logger logger = Logger.getLogger(ComboPooledDataSource.class);

    /**
     * 取得链接
     * @return
     */
    public static Connection getConnection(String dsName) throws Exception {
        Connection connection = null;
        if(CommonUtil.dataSourceType == 0){
            ComboPooledDataSource cpds = CommonUtil.c3p0dsContainer.get(dsName);
            try {// 保证只进行一次初始化
                if (cpds == null) {
                    cpds = CommonUtil.init(dsName);
                }
                // 取得connection
                connection = cpds.getConnection();
            } catch (Exception ex) {
                ex.printStackTrace();
                logger.error("获取数据库连接["+dsName+"]异常：" + ex.getMessage());
                throw ex;
            }
        }else if(CommonUtil.dataSourceType == 1){
            DruidDataSource drds = CommonUtil.druiddsContainer.get(dsName);
            try {// 保证只进行一次初始化
                if (drds == null) {
                    drds = CommonUtil.initDruid(dsName);
                }
                // 取得connection
                connection = drds.getConnection();
            } catch (Exception ex) {
                logger.error("获取数据库连接["+dsName+"]异常：" + ex.getMessage());
                //ex.printStackTrace();
                throw ex;
            }
        }
        return connection;
    }

    /**
     * 释放连接
     */
    private static void release(String dsName) {
        try {
            ComboPooledDataSource cpds = CommonUtil.c3p0dsContainer.get(dsName);
            if (cpds != null) {
                cpds.close();
            }
            CommonUtil.c3p0dsContainer.remove(dsName);
        } catch (Exception ex) {
            logger.error("释放数据库连接["+dsName+"]异常：" + ex.getMessage());
            ex.printStackTrace();
        }
    }
}
