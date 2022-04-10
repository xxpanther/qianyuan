package org.gxz.znrl.util;

import java.io.File;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.alibaba.druid.pool.DruidDataSource;
import com.alibaba.druid.pool.DruidDataSourceFactory;
import com.mchange.v2.c3p0.ComboPooledDataSource;
import oracle.sql.CLOB;
import org.apache.log4j.Logger;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

public class CommonUtil {
    //下面6个变量，判断初始数据源类型和存放数据源的集合等
    public static int dataSourceType = -1; //0表示 c3p0; 1表示druid ，其他异常
    public static final String druidType = "znrljdbcDruid";
    public static final String c3p0Type = "znrljdbc";
    public static HashMap<String, ComboPooledDataSource> c3p0dsContainer = new HashMap<String, ComboPooledDataSource>();
    public static HashMap<String, DruidDataSource> druiddsContainer = new HashMap<String, DruidDataSource>();
    private static HashMap<String, Object> propContainer = new HashMap<String, Object>();

    private static Logger logger = Logger.getLogger(CommonUtil.class);
    private static Logger infoPointLogger = Logger.getLogger(Constant.LOG_INFOPOINT);
    private static Logger syncDataLogger = Logger.getLogger(Constant.LOG_SYNCDATA);

    //存放同步数据需要使用的SQL集合
    public static HashMap<String, String> sqlMap = new HashMap<String, String>();

    //sql语句所在文件的相对路径
    private static String SQLFILE_SRC_PATH = "/resource/sqlConfig/";

    //缓存不同测点编码的最新测点，DEVICE=KEY  VALUE=VALUE
    public static HashMap<String, String> messageBufferMap = new HashMap<String, String>();
	
	public Connection getConnection(String dsName) throws Exception {
        return C3P0DBConnectionManager.getConnection(dsName);
	}

    //默认是管控的oracle数据库
    public Connection getConnection() throws Exception {
        if(CommonUtil.dataSourceType == 0){
            return C3P0DBConnectionManager.getConnection(CommonUtil.c3p0Type);
        }else if(CommonUtil.dataSourceType == 1){
            return C3P0DBConnectionManager.getConnection(CommonUtil.druidType);
        }else{
            throw new Exception("error dataSourceType(0=c3p0,1=druid) ："+CommonUtil.dataSourceType);
        }
    }


	public void closeResource(PreparedStatement ps, Connection conn) {
		try {
			if (null != ps) {
				ps.close();
			}
		} catch (Exception e) {
            logger.error("关闭数据库Statement发生了异常："+e.getMessage());
		}

        try {
            if (conn != null) {
                conn.close();
            }
        } catch (Exception e) {
            logger.error("关闭数据库连接发生了异常："+e.getMessage());
        }
	}

    /**
     * 去除不可见字符
     * @param str
     * @return
     */
    public static String replaceBlank(String str) {
        String dest = "";
        if (str!=null) {
            Pattern p = Pattern.compile("\\s*|\t|\r|\n");
            Matcher m = p.matcher(str);
            dest = m.replaceAll("");
        }
        return dest;
    }


	public static String getTimeStr(){
		Date date = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
		return sdf.format(date);
	}

    /**
     * 解析sql文件并加载
     */
    public static void loadSqlXmlFile(){
        String absolutePath = null;
        try {
            //获取文件目录路径
            absolutePath = CommonUtil.class.getResource(SQLFILE_SRC_PATH).getPath();
            if (absolutePath == null){
                syncDataLogger.info("未发现有存放sql文件的目录："+SQLFILE_SRC_PATH);
                return;
            }
        } catch (Exception e) {
            syncDataLogger.error("解析存放sql文件的目录："+SQLFILE_SRC_PATH);
            return;
        }

        try {
            File dir = new File(absolutePath);
            String[] fileList = dir.list();
            //对文件目录下的所有xml文件进行遍历加载
            for (String filePath : fileList) {
                File readFile = new File(filePath);
                if (!readFile.isDirectory() && readFile.getName().toUpperCase().endsWith(".XML")) {
                    parseSqlXml(readFile.getName());
                }
            }
        } catch (Exception e) {
            syncDataLogger.error("遍历解析存放的sql文件异常："+e.getMessage());
            e.printStackTrace();
        }

    }

    /**
     * 解析sql文件并加载
     */
    public static void parseSqlXml(String fileName) {
        SAXReader saxReader = new SAXReader();
        Document document = null;
        try {
            InputStream is = CommonUtil.class.getResourceAsStream(SQLFILE_SRC_PATH + fileName);
            document = saxReader.read(is);
        } catch (DocumentException e) {
            syncDataLogger.error("加载sql文件异常："+e.getMessage());
            e.printStackTrace();
        }

        try {
            List<Element> elements = document.selectNodes("/sqlConfig/sql");
            for (Element ele : elements) {
                CommonUtil.sqlMap.put(ele.attributeValue("id"), ele.getText().trim());
                syncDataLogger.info("加载sql文件完成："+fileName);
            }
        } catch (Exception e) {
            syncDataLogger.error("解析sql文件异常："+e.getMessage());
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
//        CommonUtil dt = new CommonUtil();
//        dt.loadSqlXmlFile();
//        logger.info("xieyt,i am rootLogger.........");
//        infoPointLogger.info("xieyt,i am infoPointLogger.........");
//        infoPointLogger.info("我了个去1111141.........");
//        logger.info("我了个去222222222222.........");
//        syncDataLogger.info("我了个去44444444444.........");

    }

    /**
     * 判断所指定数据类型是否存在
     * @param dataSourceType
     * @return
     */
    public static boolean dataSourceTypeIsExist(String dataSourceType) {
        boolean ret = false;
        try {
            InputStream is = null;
            try{
                is = C3P0DBConnectionManager.class.getResourceAsStream("/resource/dbConfig/"+dataSourceType+".properties");
                if(is != null){
                    ret = true;
                }
            }catch(Exception e){
                e.printStackTrace();
            }finally{
                if(is != null){
                    is.close();
                }
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return ret;
    }

    /**
     * 初始化,建立数据库连接池
     */
    public static ComboPooledDataSource init(String dsName) throws Exception {
        logger.info("加载数据源配置："+dsName);
        ComboPooledDataSource cpds = new ComboPooledDataSource();
        String DRIVER_NAME; // 驱动器
        String DATABASE_URL; // 数据库连接url
        String DATABASE_USER; // 数据库用户名
        String DATABASE_PASSWORD; // 数据库密码
        int MIN_POOL_SIZE;
        int ACQUIRE_INCREMENT;
        int MAX_POOL_SIZE;
        int INITIAL_POOLSIZE;
        int IDLE_TEST_PERIOD;
        int CHECK_TIME_OUT;
        String VALIDATE;

        try {
            DRIVER_NAME = getConfigInformation(dsName, "jdbc.driverClassName"); // 驱动器
            DATABASE_URL = getConfigInformation(dsName, "jdbc.url"); // 数据库连接url
            DATABASE_USER = getConfigInformation(dsName, "jdbc.username"); // 数据库用户名
            DATABASE_PASSWORD = getConfigInformation(dsName, "jdbc.password"); // 数据库密码
            MIN_POOL_SIZE = Integer.parseInt(getConfigInformation(dsName, "c3p0.minPoolSize"));
            ACQUIRE_INCREMENT = Integer.parseInt(getConfigInformation(dsName, "c3p0.acquireIncrement"));
            MAX_POOL_SIZE = Integer.parseInt(getConfigInformation(dsName, "c3p0.maxPoolSize"));
            INITIAL_POOLSIZE = Integer.parseInt(getConfigInformation(dsName, "c3p0.initialPoolSize"));
//            CHECK_TIME_OUT = Integer.parseInt(getConfigInformation(dsName, "c3p0.idleConnectionTestPeriod"));
            IDLE_TEST_PERIOD = Integer.parseInt(getConfigInformation(dsName, "c3p0.checkoutTimeout"));

            VALIDATE = getConfigInformation(dsName, "c3p0.validate");
        } catch (Exception ex) {
            logger.error("加载数据源["+dsName+"]配置数据异常：" + ex.getMessage());
            ex.printStackTrace();
            throw ex;
        }

        try {
            cpds.setDriverClass(DRIVER_NAME); // 驱动器
            cpds.setJdbcUrl(DATABASE_URL); // 数据库url
            cpds.setUser(DATABASE_USER); // 用户名
            cpds.setPassword(DATABASE_PASSWORD); // 密码
            cpds.setInitialPoolSize(INITIAL_POOLSIZE); // 初始化连接池大小
            cpds.setMinPoolSize(MIN_POOL_SIZE); // 最少连接数
            cpds.setMaxPoolSize(MAX_POOL_SIZE); // 最大连接数
            cpds.setAcquireIncrement(ACQUIRE_INCREMENT); // 连接数的增量
            cpds.setIdleConnectionTestPeriod(IDLE_TEST_PERIOD); // 测连接有效的时间间隔
            //add
            cpds.setBreakAfterAcquireFailure(true);
            cpds.setAcquireRetryAttempts(0);
            cpds.setAcquireRetryDelay(0);
            cpds.setCheckoutTimeout(1000);
            //add
            cpds.setTestConnectionOnCheckout(Boolean.getBoolean(VALIDATE)); // 每次连接验证连接是否可用

            CommonUtil.c3p0dsContainer.put(dsName, cpds);
            logger.info("加载数据源配置完成："+dsName);
        } catch (Exception ex) {
            logger.error("建立数据库["+dsName+"]连接池异常：" + ex.getMessage());
            ex.printStackTrace();
            throw ex;
        }
        return cpds;
    }

    /**
     * 初始化,建立数据库连接池
     */
    public static DruidDataSource initDruid(String dsName) throws Exception {
        logger.info("加载数据源配置："+dsName);
        DruidDataSource druidDataSource = null;
        Properties prop = getDataSourceProp(dsName);
        if(prop != null){
            druidDataSource = (DruidDataSource) DruidDataSourceFactory.createDataSource(prop);
            CommonUtil.druiddsContainer.put(dsName, druidDataSource);
        }else{
            throw new Exception(dsName+" prop is null!");
        }
        return druidDataSource;
    }

    private static Properties getDataSourceProp(String dsName) {
        try {
                Properties dbProps = new Properties();
                InputStream is = null;
                try{
                    is = CommonUtil.class.getResourceAsStream("/resource/dbConfig/"+dsName+".properties");
                    dbProps.load(is);
                }catch(Exception e){
                    e.printStackTrace();
                }finally{
                    if(is != null){
                        is.close();
                    }
                }
            return dbProps;
        } catch (Exception ex) {
            logger.error("加载数据源["+dsName+"]配置异常：" + ex.getMessage());
            ex.printStackTrace();
            return null;
        }
    }

    /**
     * 获取配置数据源信息
     * @param dsName
     * @param itemIndex
     * @return
     */
    private static String getConfigInformation(String dsName,String itemIndex) {
        try {
            Properties dbProps = (Properties)propContainer.get(dsName);

            if (dbProps == null) {
                dbProps = new Properties();
                InputStream is = null;
                try{
                    is = CommonUtil.class.getResourceAsStream("/resource/dbConfig/"+dsName+".properties");
                    dbProps.load(is);
                    propContainer.put(dsName, dbProps);
                }catch(Exception e){
                    e.printStackTrace();
                }finally{
                    if(is != null){
                        is.close();
                    }
                }
            }
            return dbProps.getProperty(itemIndex);
        } catch (Exception ex) {
            logger.error("加载数据源["+dsName+"]配置异常：" + ex.getMessage());
            ex.printStackTrace();
            return "";
        }
    }

    /**
     * druid数据源时，对oracle的clob的处理
     * @param clob
     * @return
     */
    public static oracle.sql.CLOB getOracleClob(java.sql.Clob clob){
        oracle.sql.CLOB clobOracle = null;
        if(clob instanceof com.alibaba.druid.proxy.jdbc.ClobProxyImpl){
            com.alibaba.druid.proxy.jdbc.ClobProxyImpl impl = (com.alibaba.druid.proxy.jdbc.ClobProxyImpl)clob;
            clobOracle = (oracle.sql.CLOB)impl.getRawClob(); // 获取原生的这个 Clob
        }else{
            clobOracle = (oracle.sql.CLOB) clob;
        }
        return clobOracle;
    }
}
