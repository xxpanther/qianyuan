package org.gxz.znrl.util;

import com.alibaba.druid.pool.DruidDataSource;
import com.mchange.v2.c3p0.ComboPooledDataSource;
import net.sf.json.JSONObject;
import org.apache.axis2.addressing.EndpointReference;
import org.apache.axis2.client.Options;
import org.apache.axis2.transport.http.HTTPConstants;
import org.apache.axis2.transport.http.HttpTransportProperties;
import org.apache.log4j.Logger;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * 应用启动时候初始化执行的监听
 * Created by xieyt on 14-12-11.
 */
public class ZNRLServletListener implements ServletContextListener {
    private static Logger logger = Logger.getLogger(ZNRLServletListener.class);

    public void contextInitialized(ServletContextEvent arg0) {
        boolean loadRes = false;
        try {


        } catch (Exception e) {
            logger.error("调用接口发生异常："+e.getMessage());
            e.printStackTrace();
        }
    }



    public void contextDestroyed(ServletContextEvent arg0) {
    }
}
