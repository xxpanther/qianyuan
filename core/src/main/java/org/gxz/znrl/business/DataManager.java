package org.gxz.znrl.business;

import java.io.Reader;
import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import oracle.jdbc.OracleTypes;
import oracle.sql.CLOB;
import org.apache.log4j.Logger;
import org.gxz.znrl.entity.CacheDataEntity;
import org.gxz.znrl.entity.ConstantEntity;
import org.gxz.znrl.entity.TrainDataEntity;
import org.gxz.znrl.schedule.EngineCfgBean;
import org.gxz.znrl.util.CommonUtil;
import org.gxz.znrl.util.Constant;

public class DataManager {
    protected static Logger logger = Logger.getLogger(DataManager.class);
    protected static Logger infoPointLogger = Logger.getLogger(Constant.LOG_INFOPOINT);
    protected static Logger syncDataLogger = Logger.getLogger(Constant.LOG_SYNCDATA);
    protected static Logger reportLogger = Logger.getLogger(Constant.LOG_REPORT);
    protected static Logger terminalBizLogger = Logger.getLogger(Constant.TERMINAL_BIZ_PROC);

    protected static CommonUtil commonUtil = new CommonUtil();

    protected static DataManager dataManagerSingleton;

    public static DataManager getInstance(){
        if(dataManagerSingleton == null){
            dataManagerSingleton = new DataManager();
        }
        return dataManagerSingleton;
    }

    //查询汽车排队数据
	public String qryCarsQueue() throws Exception {
		Connection conn = null;
		PreparedStatement ps = null;

        JSONObject jsonObject = new JSONObject();
        jsonObject.put("DEVICE","CAR_QUEUE");//标识
        jsonObject.put("VALUE","");
		try {
			conn = commonUtil.getConnection();

			ResultSet rs;
            String sql = " select flow_id, car_id" +
                    "      from (select decode(b.sample_device_no,'1','CZ1','2','CZ2') flow_id," +
                    "                a.car_id," +
                    "                a.record_no," +
                    "                a.rc_dtm" +
                    "           from RLCARSTAMST a, rlrecordmstqy b" +
                    "          where a.record_no = b.record_no" +
                    "            and a.cy = '9'" +
                    "            and (nvl(length(a.cz), 0) = 0 or a.cz = '0')" +
                    "         union all" +
                    "         select 'XM' flow_id, car_id, record_no, a.rc_dtm" +
                    "             from RLCARSTAMST a" +
                    "       where a.cz = '9'" +
                    "         and (nvl(length(a.hp), 0) = 0 or a.hp = '0')" +
                    "      union all" +
                    "      select 'CQ' flow_id, car_id, record_no, a.rc_dtm" +
                    "        from RLCARSTAMST a" +
                    "       where a.cz = '9'" +
                    "         and (nvl(length(a.hp), 0) = 0 or a.hp = '0')) m" +
                    "   where m.rc_dtm between trunc(sysdate) and" +
                    "     trunc(sysdate) + 1 - 0.00001" +
                    "  order by m.record_no" ;

			ps = conn.prepareStatement(sql);
			rs = ps.executeQuery();

            JSONArray czJA1 = new JSONArray();
            JSONArray cqJA1 = new JSONArray();
            JSONArray xmJA = new JSONArray();
            JSONArray czJA2 = new JSONArray();
            JSONArray cqJA2 = new JSONArray();


            while (rs != null && rs.next()) {
                if ((rs.getString("flow_id")!=null)&&(rs.getString("flow_id").equals("CZ1"))){
                    czJA1.add(rs.getString("car_id"));
                } else if ((rs.getString("flow_id")!=null)&&(rs.getString("flow_id").equals("CZ2"))){
                    czJA2.add(rs.getString("car_id"));
                } else if ((rs.getString("flow_id")!=null)&&(rs.getString("flow_id").equals("XM"))){
                    xmJA.add(rs.getString("car_id"));
                } else if ((rs.getString("flow_id")!=null)&&(rs.getString("flow_id").equals("CQ"))){
                    cqJA1.add(rs.getString("car_id"));
                    cqJA2.add(rs.getString("car_id"));
                }
            }

            jsonObject.put("czJA1",czJA1);
            jsonObject.put("czJA2",czJA2);
            jsonObject.put("xmJA",xmJA);
            jsonObject.put("cqJA1",cqJA1);
            jsonObject.put("cqJA2",cqJA2);
            logger.info("完成汽车排队数据查询");
		} catch (Exception e) {
            logger.error("查询汽车排队数据发生异常："+e.getMessage());
			e.printStackTrace();
			throw new Exception(e.getMessage());
		} finally {
			commonUtil.closeResource(ps, conn);
		}
		return jsonObject.toString();
	}


    //查询当天汽车来煤汇总数据
    public String qryCarsSummaryInfo() throws Exception {
        Connection conn = null;
        PreparedStatement ps = null;

        //初始化，万一数据库里没有查到，就用这个
        String resStr = "{\"DEVICE\":\"SUMMARY_INFO\",\"VALUE\":\"\",\"CARS_CNT\":\"\",\"SUM_NET_QTY\":\"\",\"CARS_BAT_CNT\":\"\",\"HY_BAT_CNT\":\"\",\"CY_CARS_CNT\":\"\",\"ZY_BAT_CNT\":\"\",\"STORE_QTY\":\"\",\"SC_QTY\":\"\"}";

        try {
            conn = commonUtil.getConnection();

            ResultSet rs;

            String sql = "select qry_summary_info() summary_info_str from dual";

            ps = conn.prepareStatement(sql);
            rs = ps.executeQuery();


            while (rs != null && rs.next()) {
                resStr = rs.getString("summary_info_str");
            }
            logger.info("完成查询汽车来煤汇总数据：");
        } catch (Exception e) {
            logger.error("查询汽车来煤汇总数据发生异常："+e.getMessage());
            e.printStackTrace();
            throw new Exception(e.getMessage());
        } finally {
            commonUtil.closeResource(ps, conn);
        }
        return resStr;
    }


    //查询最近两趟火车汇总数据 车次、节数、票重、净重
    public String qryLastTrainInfo() throws Exception {
        Connection conn = null;
        PreparedStatement ps = null;

        JSONObject jsonObject = new JSONObject();
        jsonObject.put("DEVICE","CAR_QUEUE");//标识
        jsonObject.put("VALUE","");
        try {
            conn = commonUtil.getConnection();

            ResultSet rs;

            String sql ="select a.flow_id, b.car_id" +
                    "  from RLCARSTAMST a, RLRECORDMSTQY b" +
                    " where a.record_no = b.record_no" +
                    "   and a.flow_id in ('CZ', 'XM', 'CQ')" +
                    "   and a.flow_sta = '0'" +
                    " order by a.record_id";

            ps = conn.prepareStatement(sql);
            rs = ps.executeQuery();

            JSONArray czJA1 = new JSONArray();
            JSONArray cqJA1 = new JSONArray();
            JSONArray xmJA = new JSONArray();
            JSONArray czJA2 = new JSONArray();
            JSONArray cqJA2 = new JSONArray();

            while (rs != null && rs.next()) {
                if (rs.getString("flow_id").equals("CZ")){
                    czJA1.add(rs.getString("car_id"));
                    czJA2.add(rs.getString("car_id"));
                } else if (rs.getString("flow_id").equals("XM")){
                    xmJA.add(rs.getString("car_id"));
                } else if (rs.getString("flow_id").equals("CQ")){
                    cqJA1.add(rs.getString("car_id"));
                    cqJA2.add(rs.getString("car_id"));
                }
            }

            jsonObject.put("czJA1",czJA1);
            jsonObject.put("czJA2",czJA2);
            jsonObject.put("xmJA",xmJA);
            jsonObject.put("cqJA1",cqJA1);
            jsonObject.put("cqJA2",cqJA2);
            logger.info("完成查询最近火车来煤汇总数据");
        } catch (Exception e) {
            logger.error("查询最近火车来煤汇总数据发生异常："+e.getMessage());
            e.printStackTrace();
            throw new Exception(e.getMessage());
        } finally {
            commonUtil.closeResource(ps, conn);
        }
        return jsonObject.toString();
    }



    //查询当天火车来煤汇总数据
    public String qryTrainSummaryInfo() throws Exception {
        Connection conn = null;
        PreparedStatement ps = null;

        //初始化，万一数据库里没有查到，就用这个
        String resStr = "{\"DEVICE\":\"TRAIN_SUMMARY_INFO\",\"VALUE\":\"\",\"TRAINS_CNT\":\"\",\"SUM_NET_QTY\":\"\",\"TRAIN_BAT_CNT\":\"\",\"HY_BAT_CNT\":\"\",\"CY_TRAINS_CNT\":\"\",\"ZY_BAT_CNT\":\"\",\"STORE_QTY\":\"\",\"SC_QTY\":\"\"}";

        try {
            conn = commonUtil.getConnection();

            ResultSet rs;

            String sql = "select qry_train_summary_info() summary_info_str from dual";

            ps = conn.prepareStatement(sql);
            rs = ps.executeQuery();


            while (rs != null && rs.next()) {
                resStr = rs.getString("summary_info_str");
            }
            logger.info("完成查询火车来煤汇总数据");
        } catch (Exception e) {
            logger.error("查询火车来煤汇总数据发生异常："+e.getMessage());
            e.printStackTrace();
            throw new Exception(e.getMessage());
        } finally {
            commonUtil.closeResource(ps, conn);
        }
        return resStr;
    }




    //查询筒仓信息
    public String qrySiloInfo() throws Exception {
        Connection conn = null;
        PreparedStatement ps = null;

        //初始化，万一数据库里没有查到，就用这个
        String resStr = "{\"DEVICE\":\"SUMMARY_INFO\",\"VALUE\":\"\",\"CARS_CNT\":\"\",\"SUM_NET_QTY\":\"\",\"CARS_BAT_CNT\":\"\",\"HY_BAT_CNT\":\"\",\"CY_CARS_CNT\":\"\",\"ZY_BAT_CNT\":\"\",\"STORE_QTY\":\"\",\"SC_QTY\":\"\"}";

        try {
            conn = commonUtil.getConnection();

            ResultSet rs;

            String sql = "select qry_summary_info() summary_info_str from dual";

            ps = conn.prepareStatement(sql);
            rs = ps.executeQuery();

            while (rs != null && rs.next()) {
                resStr = rs.getString("summary_info_str");
            }
            logger.info("查询筒仓数据发生异常");
        } catch (Exception e) {
            logger.error("查询筒仓数据发生异常："+e.getMessage());
            e.printStackTrace();
            throw new Exception(e.getMessage());
        } finally {
            commonUtil.closeResource(ps, conn);
        }
        return resStr;
    }


    //查询煤厂关键指标信息
    public String qryCriKpiInfo() throws Exception {
        Connection conn = null;
        PreparedStatement ps = null;
        String resStr = "{\"DEVICE\":\"CRI_KPI_INFO\",\"VALUE\":\"\"}";
        try {
            conn = commonUtil.getConnection();

            ResultSet rs;

            String sql = "select getCoalTotalInfo() info_str from dual";

            ps = conn.prepareStatement(sql);
            rs = ps.executeQuery();

            if (rs != null && rs.next()) {
                resStr =  rs.getString("info_str");
            }

            logger.info("查询煤厂关键指标信息");
        } catch (Exception e) {
            logger.error("查询煤厂关键指标信息发生异常："+e.getMessage());
            e.printStackTrace();
            throw new Exception(e.getMessage());
        } finally {
            commonUtil.closeResource(ps, conn);
        }
        return resStr;
    }


    /**
     * 获取引擎的配置参数
     *
     */
    public void getEngineConfig() throws Exception {
        StringBuffer sqlStrBuffer = new StringBuffer();
        Connection conn = null;
        EngineCfgBean cfgBean = null;
        ResultSet rs;
        PreparedStatement ps = null;
        try {
            conn = commonUtil.getConnection();

            sqlStrBuffer.append("select b.TASK_CONF_ID,");
            sqlStrBuffer.append("       b.TASK_TYPE,");
            sqlStrBuffer.append("       b.NAME,");
            sqlStrBuffer.append("       b.INVOKE_OBJ_TYPE,");
            sqlStrBuffer.append("       b.INVOKE_OBJ,");
            sqlStrBuffer.append("       b.SCHEDULE_EXPRESSION,");
            sqlStrBuffer.append("       b.STATUS,");
            sqlStrBuffer.append("       b.REMARK,");
            sqlStrBuffer.append("       c.ATTACH_CFG_ID,");
            sqlStrBuffer.append("       c.DB_SOURCE,");
            sqlStrBuffer.append("       c.SQL_ID,");
            sqlStrBuffer.append("       c.WRITE_BACK_TAG,");
            sqlStrBuffer.append("       c.WRITE_BACK_SQL_ID,");
            sqlStrBuffer.append("       c.WB_PARAM1_TYPE,");
            sqlStrBuffer.append("       c.WB_PARAM2_TYPE,");
            sqlStrBuffer.append("       c.WB_PARAM1_FIELD,");
            sqlStrBuffer.append("       c.WB_PARAM2_FIELD,");
            sqlStrBuffer.append("       nvl(c.OUR_DB_SOURCE, 'znrljdbc') as OUR_DB_SOURCE,");//
            sqlStrBuffer.append("       c.SUPPORT_MACHINE");
            sqlStrBuffer.append("  from TASK_SCHEDULE_CFG b, task_schedule_attach_cfg c");
            sqlStrBuffer.append(" where b.status = '0'");
            sqlStrBuffer.append("   and b.task_conf_id = c.task_conf_id(+)");

            ps = conn.prepareStatement(sqlStrBuffer.toString());

            rs = ps.executeQuery();

            while (rs.next()) {
                cfgBean = new EngineCfgBean();
                cfgBean.setTaskConfId(rs.getString("TASK_CONF_ID"));
                cfgBean.setTaskType(rs.getString("TASK_TYPE"));
                cfgBean.setName(rs.getString("NAME"));
                cfgBean.setInvokeObjType(rs.getString("INVOKE_OBJ_TYPE"));
                cfgBean.setInvokeObj(rs.getString("INVOKE_OBJ"));
                cfgBean.setCronTrigExpr(rs.getString("SCHEDULE_EXPRESSION"));
                cfgBean.setRemark(rs.getString("REMARK"));

                //附加配置
                if (rs.getString("ATTACH_CFG_ID") != null && !rs.getString("ATTACH_CFG_ID").equals("")) {
                    cfgBean.setAttachCfgId(rs.getString("ATTACH_CFG_ID"));
                    cfgBean.setDbSource(rs.getString("DB_SOURCE"));
                    cfgBean.setSqlId(rs.getString("SQL_ID"));
                    cfgBean.setWriteBackTag(rs.getString("WRITE_BACK_TAG"));
                    cfgBean.setWriteBackSqlId(rs.getString("WRITE_BACK_SQL_ID"));
                    cfgBean.setWbParam1Type(rs.getString("WB_PARAM1_TYPE"));
                    cfgBean.setWbParam2Type(rs.getString("WB_PARAM2_TYPE"));
                    cfgBean.setWbParam1Field(rs.getString("WB_PARAM1_FIELD"));
                    cfgBean.setWbParam2Field(rs.getString("WB_PARAM2_FIELD"));
                    cfgBean.setOurDBSource(rs.getString("OUR_DB_SOURCE"));
                    cfgBean.setSupportMachine(rs.getString("SUPPORT_MACHINE"));
                }

                Constant.cfgMap.put(rs.getString("TASK_CONF_ID"),cfgBean);
            }
        } catch (Exception e) {
            logger.error("获取调度任务配置参数异常：" + e.getMessage());
            System.out.println("获取调度任务配置参数异常：" + e.getMessage());
            e.printStackTrace();
            throw e;
        } finally {
            commonUtil.closeResource(ps, conn);
        }
    }


    /**
     * 获取需要发测点的数据
     * @param procName
     * @return
     * @throws Exception
     */
    public String qryDataStrForSend(String procName) throws Exception {
        StringBuffer sqlStrBuffer = new StringBuffer();
        Connection conn = null;
        String returnStr = "";
        ResultSet rs;
        PreparedStatement ps = null;
        try {
            conn = commonUtil.getConnection();
            //获取日志ID主键
            sqlStrBuffer.append("SELECT "+procName+"() RESSTRING FROM DUAL");
            ps = conn.prepareStatement(sqlStrBuffer.toString());
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                returnStr = rs.getString("RESSTRING");
                rs.close();
            }
        } catch (Exception e) {
            infoPointLogger.error("通用查询管控自发测点数据异常："+e.getMessage());
            throw e;
        } finally {
            commonUtil.closeResource(ps, conn);
        }
        return returnStr;
    }

    /**
     * 同步数据通用查询语句
     * @param ecb
     * @return
     * @throws Exception
     */
    public String getSyncData(EngineCfgBean ecb) throws Exception {
        JSONArray returnJA = new JSONArray();
        String dsName = ecb.getDbSource();
        String sql = CommonUtil.sqlMap.get(ecb.getSqlId());

        if (dsName == null || sql == null) {
            syncDataLogger.error("数据源或sql语句未配置，请检查任务："+ecb.getName());
            return returnJA.toString();
        }

        Connection conn = null;
        ResultSet rs;
        PreparedStatement ps = null;
        try {
            conn = commonUtil.getConnection(dsName);
            if (conn == null) {
                syncDataLogger.error("获取数据库连接失败，请检查数据库，任务："+ecb.getName());
                return returnJA.toString();
            }

            ps = conn.prepareStatement(sql);
            rs = ps.executeQuery();

            if (rs != null) {
                ResultSetMetaData metaData = rs.getMetaData();
                JSONObject rowJO;
                while (rs.next()) {
                    rowJO = new JSONObject();
                    for (int i = 1; i <= metaData.getColumnCount(); i++) {
                        //字段名称统一使用大写
                        rowJO.put(metaData.getColumnName(i).toUpperCase(), rs.getString(metaData.getColumnName(i)));
                    }
                    returnJA.add(rowJO);
                }
                rs.close();
            }
        } catch (Exception e) {
            syncDataLogger.error("通用获取待同步数据异常："+e.getMessage()+"，任务："+ecb.getName());
            throw e;
        } finally {
            commonUtil.closeResource(ps, conn);
        }
        return returnJA.toString();
    }

    /**
     * 回写同步数据
     * @param ecb
     * @return
     * @throws Exception
     */
    public boolean writeBackSyncData(EngineCfgBean ecb, String data, Connection conn) throws Exception {
        JSONArray dataJA = JSONArray.fromObject(data);
        String sql = CommonUtil.sqlMap.get(ecb.getWriteBackSqlId());
        if (sql == null) {
            syncDataLogger.error("sql语句未正确配置，请检查任务：" + ecb.getName());
            return false;
        }

        if (conn == null) {
            syncDataLogger.error("回写状态时获取数据库连接失败，请检查数据库，任务："+ecb.getName());
            return false;
        }

        PreparedStatement ps = null;
        try {
            conn.setAutoCommit(false);//关闭自动提交
            ps = conn.prepareStatement(sql);

            for (int j=0; j<dataJA.size(); j++) {
                if (ecb.getWbParam1Type() != null ) {
                    if (ecb.getWbParam1Type().equalsIgnoreCase("INT")){
                        ps.setInt(1, Integer.parseInt((String)((JSONObject) (dataJA.get(j))).get(ecb.getWbParam1Field())));
                    } else if (ecb.getWbParam1Type().equalsIgnoreCase("LON")) {
                        ps.setLong(1, Long.parseLong((String)((JSONObject) (dataJA.get(j))).get(ecb.getWbParam1Field())));
                    } else if (ecb.getWbParam1Type().equalsIgnoreCase("STR")) {
                        ps.setString(1, (String)((JSONObject) (dataJA.get(j))).get(ecb.getWbParam1Field()));
                    }
                }

                if (ecb.getWbParam2Type() != null ) {
                    if (ecb.getWbParam2Type().equalsIgnoreCase("INT")){
                        ps.setInt(2, Integer.parseInt((String)((JSONObject) (dataJA.get(j))).get(ecb.getWbParam2Field())));
                    } else if (ecb.getWbParam2Type().equalsIgnoreCase("LON")) {
                        ps.setLong(2, Long.parseLong((String)((JSONObject) (dataJA.get(j))).get(ecb.getWbParam2Field())));
                    } else if (ecb.getWbParam2Type().equalsIgnoreCase("STR")) {
                        ps.setString(2, (String)((JSONObject) (dataJA.get(j))).get(ecb.getWbParam2Field()));
                    }
                }

                //执行update
                int i = ps.executeUpdate();

                //为解决傻逼微软的连接释放问题，他妈的睡一会
                Thread.sleep(100);
            }
            return true;
        } catch (Exception e) {
            syncDataLogger.error("回写状态时失败："+e.getMessage()+"，任务："+ecb.getName());
            return false;
        } finally {
            if (ps != null) {
                ps.close();
            }
        }
    }

    /**
     * 同步数据到管控系统
     * @param ecb
     * @param data
     * @return
     * @throws Exception
     */
    public boolean syncData2TargetDB(EngineCfgBean ecb, String data, Connection conn) throws Exception {
        CallableStatement cs = null;
        if (conn == null) {
            syncDataLogger.error("同步数据入库连接为空，请检查数据库，任务："+ecb.getName());
            return false;
        }

        try {
            conn.setAutoCommit(false);//关闭自动提交
            cs = conn.prepareCall("{call "+ecb.getInvokeObj()+"(?,?,?,?)}");
            cs.setString(1, data);//查出来的结果集的json对象

            cs.setString(2, ecb.getTaskConfId());//任务编号
            cs.registerOutParameter(3, Types.VARCHAR);//输出
            cs.registerOutParameter(4, Types.VARCHAR);
            cs.execute();

            String resCode = cs.getString(3);
            String resMsg = cs.getString(4);
            if(resCode.equals("0")){
                return true;
            } else {
                syncDataLogger.error("同步数据入库失败，异常信息："+resMsg+"，任务："+ecb.getName());
                return false;
            }
        } catch (Exception e) {
            syncDataLogger.error("执行同步数据入库异常："+e.getMessage());
            return false;
        } finally {
            if (cs != null){
                cs.close();
            }
        }
    }


    /**
     * 获取命令数据到外系统上位机数据库
     * @return
     * @throws Exception
     */
    public String getCmdDataOld(String taskConfId,String ourDBSource) throws Exception {
        CallableStatement cs = null;
        String returnStr = "";
        java.sql.Clob clob = null;
        //oracle.sql.CLOB clob = null;
        Connection conn = commonUtil.getConnection(ourDBSource);
        if (conn == null) {
            syncDataLogger.error("获取待发送命令时数据库连接失败");
            return "";
        }

        try {
            conn.setAutoCommit(false);//关闭自动提交
            cs = conn.prepareCall("{call PK_SYNC_2_ZNRL.get_cmd(?,?)}");
            cs.setString(1, taskConfId);
            cs.registerOutParameter(2, oracle.jdbc.OracleTypes.CLOB);
            cs.execute();

            clob = CommonUtil.getOracleClob(cs.getClob(2));
            String strClob = clob.getSubString(1, (int) clob.length());
            System.out.println("getClob="+strClob);

            StringBuffer sb = new StringBuffer();
            if (clob != null) {
                Reader clobStream = clob.getCharacterStream();
                char[] cBuff = new char[Integer.parseInt(String.valueOf(clob.length()))];
                int i = 0;
                while ((i = clobStream.read(cBuff)) != -1) {
                    sb.append(cBuff, 0, i);
                }
                clobStream.close();
            } else {
                return "[]";
            }
            returnStr = sb.toString();
        } catch (Exception e) {
            syncDataLogger.error("同步命令数据异常："+e.getMessage());
            throw e;
        } finally {
            try {
                if (clob != null) {
                    clob.free();
                    //clob.freeTemporary();
                }
            } catch (SQLException e2) {}
            commonUtil.closeResource(cs, conn);
        }
        return CommonUtil.replaceBlank(returnStr);
    }

    /**
     * 获取命令数据到外系统上位机数据库
     * @return
     * @throws Exception
     */
    public String getCmdData(String taskConfId,String ourDBSource) throws Exception {
        CallableStatement cs = null;
        String returnStr = "";
        java.sql.Clob clob = null;
        //oracle.sql.CLOB clob = null;
        Connection conn = commonUtil.getConnection(ourDBSource);
        if (conn == null) {
            syncDataLogger.error("获取待发送命令时数据库连接失败");
            return "";
        }

        try {
            conn.setAutoCommit(false);//关闭自动提交
            cs = conn.prepareCall("{call PK_SYNC_2_ZNRL.get_cmd(?,?)}");
            cs.setString(1, taskConfId);
            cs.registerOutParameter(2, OracleTypes.VARCHAR);
            cs.execute();
            returnStr = cs.getString(2);
            if(returnStr == null || returnStr.trim().length() <=0){
                return "[]";
            }
            /*
            clob = CommonUtil.getOracleClob(cs.getClob(2));
            String strClob = clob.getSubString(1, (int) clob.length());
            System.out.println("getClob="+strClob);

            StringBuffer sb = new StringBuffer();
            if (clob != null) {
                Reader clobStream = clob.getCharacterStream();
                char[] cBuff = new char[Integer.parseInt(String.valueOf(clob.length()))];
                int i = 0;
                while ((i = clobStream.read(cBuff)) != -1) {
                    sb.append(cBuff, 0, i);
                }
                clobStream.close();
            } else {
                return "[]";
            }
            returnStr = sb.toString();
            */
        } catch (Exception e) {
            syncDataLogger.error("同步命令数据异常："+e.getMessage());
            throw e;
        } finally {
            try {
                if (clob != null) {
                    clob.free();
                    //clob.freeTemporary();
                }
            } catch (SQLException e2) {}
            commonUtil.closeResource(cs, conn);
        }
        return CommonUtil.replaceBlank(returnStr);
    }

    /**
     * 获取命令数据到OPC服务器
     * @return
     * @throws Exception
     */
    public String getCmdData4OPC(String taskConfId,String ourDBSource) throws Exception {
        CallableStatement cs = null;
        String returnStr = "";
        CLOB clob = null;
        Connection conn = commonUtil.getConnection(ourDBSource);
        if (conn == null) {
            syncDataLogger.error("获取待发送命令时数据库连接失败");
            return "";
        }

        try {
            conn.setAutoCommit(false);//关闭自动提交
            cs = conn.prepareCall("{call PK_SYNC_2_ZNRL.get_cmd4opcnew(?,?)}");
            cs.setString(1, taskConfId);
            cs.registerOutParameter(2, oracle.jdbc.OracleTypes.CLOB);
            cs.execute();

            clob = CommonUtil.getOracleClob(cs.getClob(2));

            StringBuffer sb = new StringBuffer();
            if (clob != null) {
                Reader clobStream = clob.getCharacterStream();
                char[] cBuff = new char[Integer.parseInt(String.valueOf(clob.length()))];
                int i = 0;
                while ((i = clobStream.read(cBuff)) != -1) {
                    sb.append(cBuff, 0, i);
                }
                clobStream.close();
            } else {
                return "{}";
            }
            returnStr = sb.toString();
        } catch (Exception e) {
            e.printStackTrace();
            syncDataLogger.error("获取命令数据异常："+e.getMessage());
            throw e;
        } finally {
            try {
                if (clob != null) {
                    clob.freeTemporary();
                }
            } catch (SQLException e2) {
                e2.printStackTrace();;
            }
            commonUtil.closeResource(cs, conn);
        }
        return returnStr;
    }

    /**
     * 插入命令到采样机数据库
     * @param
     * @return
     * @throws Exception
     */
    public boolean insertCommand2CYJ(Connection conn, JSONObject jo) throws Exception {
        String sql = "insert into cy_cmd_tb(machineCode, commandCode,sampleId,sendCommandTime,dataStatus) " +
                "values(?,?,?,GETDATE(),0)";

        PreparedStatement ps = null;
        try {
            conn.setAutoCommit(false);//关闭自动提交
            ps = conn.prepareStatement(sql);
            ps.setString(1, jo.getString("MACHINE_CODE"));
            ps.setInt(2, Integer.parseInt(jo.getString("COMMAND_CODE")));
            ps.setString(3, jo.getString("SAMPLE_CODE")==null?"":jo.getString("SAMPLE_CODE"));

            //执行insert
            int i = ps.executeUpdate();

            //启动需要填写参数
            String cmdCode = jo.getString("COMMAND_CODE");
            if (cmdCode != null && cmdCode.equals("1")) {
                sql = "insert into cy_interface_tb(sampleId,batchNo,trainNumber,weight,type,water,sampleType,barrelNumber,dataStatus) " +
                        "values(?,?,?,?,?,?,?,?,0)";

                ps = conn.prepareStatement(sql);
                ps.setString(1, jo.getString("SAMPLE_CODE"));
                ps.setString(2, jo.getString("BATCH_NO"));
                ps.setInt(3, Integer.parseInt(jo.getString("TRAIN_NUMBER")));
                ps.setInt(4, Integer.parseInt(jo.getString("BATCH_WEIGHT")));
                ps.setInt(5, Integer.parseInt(jo.getString("COAL_TYPE")));
                ps.setInt(6, Integer.parseInt(jo.getString("WATER_CYJ")));
                ps.setInt(7, Integer.parseInt(jo.getString("SAMPLE_TYPE")));
                ps.setInt(8, Integer.parseInt(jo.getString("BARREL_NUMBER")));

                int k = ps.executeUpdate();
            }
            syncDataLogger.info("同步命令到采样机数据库成功");
            return true;
        } catch (Exception e) {
            syncDataLogger.error("同步命令到采样机数据库失败："+e.getMessage());
            return false;
        } finally {
            if (ps != null) {
                ps.close();
            }
        }
    }


    /**
     * 插入命令到制样机数据库
     * @param
     * @return
     * @throws Exception
     */
    public boolean insertCommand2ZYJ(Connection conn, JSONObject jo) throws Exception {
        String sql = "insert into zy_cmd_tb(machineCode, commandCode,sampleId,sendCommandTime,commandName, dataStatus) " +
                "values(?,?,?,GETDATE(),202,0)";

        PreparedStatement ps = null;
        try {
            conn.setAutoCommit(false);//关闭自动提交
            ps = conn.prepareStatement(sql);
            ps.setString(1, jo.getString("MACHINE_CODE"));
            ps.setInt(2, Integer.parseInt(jo.getString("COMMAND_CODE")));
            ps.setString(3, jo.getString("SAMPLE_CODE"));
            //执行insert
            int i = ps.executeUpdate();
            //启动需要填写参数
            String cmdCode = jo.getString("COMMAND_CODE");
            if (cmdCode != null && (cmdCode.equals("1") || cmdCode.equals("4"))) {//启动和开启投料罩，都发送参数
                sql = "insert into zy_interface_tb(sampleId,type,size,water,barrelNumber,dataStatus) " +
                        "values(?,?,?,?,?,0)";

                ps = conn.prepareStatement(sql);
                ps.setString(1, jo.getString("SAMPLE_CODE"));
                ps.setInt(2, Integer.parseInt(jo.getString("COAL_TYPE")));
                ps.setInt(3, Integer.parseInt(jo.getString("SIZE")));
                ps.setInt(4, Integer.parseInt(jo.getString("WATER_ZYJ")));
                ps.setInt(5, Integer.parseInt(jo.getString("BARREL_NUMBER")));

                int k = ps.executeUpdate();
            }

            syncDataLogger.info("同步命令到制样机数据库成功");
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            syncDataLogger.error("同步命令到制样机数据库失败："+e.getMessage());
            return false;
        } finally {
            if (ps != null) {
                ps.close();
            }
        }
    }



    /**
     * 插入命令到开元制样机数据库(谏壁)
     * @param
     * @return
     * @throws Exception
     */
    public boolean insertCommand2KYZYJ(Connection conn, JSONObject jo) throws Exception {
        String sql = "insert into zy_cmd_tb(machineCode, commandCode,sampleCode,sendCommandTime, dataStatus) " +
                "values(?,?,?,GETDATE(),0)";

        PreparedStatement ps = null;
        try {
            conn.setAutoCommit(false);//关闭自动提交
            ps = conn.prepareStatement(sql);
            ps.setString(1, jo.getString("MACHINE_CODE"));
            ps.setInt(2, Integer.parseInt(jo.getString("COMMAND_CODE")));
            ps.setString(3, jo.getString("SAMPLE_CODE"));
            //执行insert
            int i = ps.executeUpdate();
            //启动需要填写参数
            String cmdCode = jo.getString("COMMAND_CODE");
            if (cmdCode != null && (cmdCode.equals("1") || cmdCode.equals("4"))) {//启动和开启投料罩，都发送参数
                sql = "insert into zy_interface_tb(SampleId,Type,Size,Water,DataStatus) " +
                        "values(?,?,?,?,0)";

                ps = conn.prepareStatement(sql);
                ps.setString(1, jo.getString("SAMPLE_CODE"));
                ps.setInt(2, Integer.parseInt(jo.getString("COAL_TYPE")));
                ps.setInt(3, Integer.parseInt(jo.getString("SIZE")));
                ps.setInt(4, Integer.parseInt(jo.getString("WATER_ZYJ")));

                int k = ps.executeUpdate();
            }

            syncDataLogger.info("同步命令到制样机数据库成功");
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            syncDataLogger.error("同步命令到制样机数据库失败："+e.getMessage());
            return false;
        } finally {
            if (ps != null) {
                ps.close();
            }
        }
    }



    /**
     * 插入命令到制样机数据库,大开特殊，数据版本差异，很多地方要改
     * @param
     * @return
     * @throws Exception
     */
    public boolean insertCommand2ZYJRL(Connection conn, JSONObject jo) throws Exception {
        String sql = "insert into zy_cmd_tb(machineCode, CommandCode,SampleId,SendCommandTime, dataStatus) " +
                "values(?,?,?,GETDATE(),0)";

        PreparedStatement ps = null;
        try {
            conn.setAutoCommit(false);//关闭自动提交
            ps = conn.prepareStatement(sql);
            ps.setString(1, jo.getString("MACHINE_CODE"));
            ps.setInt(2, Integer.parseInt(jo.getString("COMMAND_CODE")));
            ps.setString(3, jo.getString("SAMPLE_CODE"));
            //执行insert
            int i = ps.executeUpdate();
            //启动需要填写参数
            String cmdCode = jo.getString("COMMAND_CODE");
            if (cmdCode != null && (cmdCode.equals("1") || cmdCode.equals("4"))) {//启动和开启投料罩，都发送参数
                sql = "insert into zy_interface_tb(SampleId,Type,Size,Water/*,barrelNumber*/,DataStatus) " +
                        "values(?,?,?,?,0)";

                ps = conn.prepareStatement(sql);
                ps.setString(1, jo.getString("SAMPLE_CODE"));
                ps.setInt(2, Integer.parseInt(jo.getString("COAL_TYPE")));
                ps.setInt(3, Integer.parseInt(jo.getString("SIZE")));
                ps.setInt(4, Integer.parseInt(jo.getString("WATER_ZYJ")));
                //ps.setInt(5, Integer.parseInt(jo.getString("BARREL_NUMBER")));

                int k = ps.executeUpdate();
            }

            syncDataLogger.info("同步命令到制样机数据库成功");
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            syncDataLogger.error("同步命令到制样机数据库失败："+e.getMessage());
            return false;
        } finally {
            if (ps != null) {
                ps.close();
            }
        }
    }

    /**
     * 发送命令回写是否成功失败
     * @return
     * @throws Exception
     */
    public void sendCmdWriteBack(String cmdRecId, String resCode, String ourDBSource) throws Exception {
        CallableStatement cs = null;
        Connection conn = commonUtil.getConnection(ourDBSource);
        if (conn == null) {
            syncDataLogger.error("同步命令时回写命令状态获取数据库连接为空");
            return;
        }

        try {
            conn.setAutoCommit(false);//关闭自动提交
            cs = conn.prepareCall("{call PK_SYNC_2_ZNRL.writeBack_cmd(?,?)}");
            cs.setString(1, cmdRecId);
            cs.setString(2, resCode);
            cs.execute();
        } catch (Exception e) {
            syncDataLogger.error("同步设备命令回写发送状态异常："+e.getMessage());
        } finally {
            commonUtil.closeResource(cs, conn);
        }
    }


    /**
     * 获取煤流信号瞬时值数据
     * @return
     * @throws Exception
     */
    public String getCoalFlow(String dsName) throws Exception {
        StringBuffer sqlStrBuffer = new StringBuffer();
        Connection conn = null;
        String returnStr = "[]";
        ResultSet rs;
        PreparedStatement ps = null;
        try {
            conn = commonUtil.getConnection(dsName);
            //获取日志ID主键
            sqlStrBuffer.append("select PK_SYNC_2_ZNRL.get_coalFlow_switch() as COALFLOW from dual");
            ps = conn.prepareStatement(sqlStrBuffer.toString());
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                returnStr = rs.getString("COALFLOW");
                rs.close();
            }
        } catch (Exception e) {
            infoPointLogger.error("通用查询管控自发测点数据异常："+e.getMessage());
            throw e;
        } finally {
            commonUtil.closeResource(ps, conn);
        }
        return returnStr;
    }


    /**
     * 同步煤流开关信号到采样机数据库
     * @param
     * @return
     * @throws Exception
     */
    public boolean updateCoalFlow2CYJ(Connection conn, String coalFlowArray) throws Exception {
        String sql = "update cy_coalFlow_tb set CoalFlowSwitch=?, UpdateTime=GETDATE() where pdNo=?";

        PreparedStatement ps = null;
        try {
            conn.setAutoCommit(false);//关闭自动提交
            ps = conn.prepareStatement(sql);
            JSONArray coalFlowJSONArray = JSONArray.fromObject(coalFlowArray);

            for (int j=0; j<coalFlowJSONArray.size(); j++) {
                JSONObject jo = coalFlowJSONArray.getJSONObject(j);
                ps.setInt(1, Integer.parseInt(jo.getString("SWITCH")));
                ps.setString(2, jo.getString("PD"));
                int i = ps.executeUpdate();
            }

            syncDataLogger.info("同步煤流开关信号到采样机数据库成功");
            return true;
        } catch (Exception e) {
            syncDataLogger.error("同步煤流开关信号到采样机数据库失败："+e.getMessage());
            return false;
        } finally {
            if (ps != null) {
                ps.close();
            }
        }
    }


    /**
     * 插入命令到制样机数据库(开元制样机,该协议主要用于乐东,大开)
     * @param
     * @return
     * @throws Exception
     */
    public boolean insertCommand2ZYJForKY(Connection conn, JSONObject jo) throws Exception {
        String sql = "update MACHIN_CMD_INFO set DATA_STATUS = '0',MACHIN_CODE = ?,COMMAND_CODE = ?,SAMPLE_CODE = ?,SEND_CMD_TIME = GETDATE()";

        PreparedStatement ps = null;
        try {
            conn.setAutoCommit(false);//关闭自动提交
            ps = conn.prepareStatement(sql);
            ps.setString(1, jo.getString("MACHINE_CODE"));
            ps.setInt(2, Integer.parseInt(jo.getString("COMMAND_CODE")));
            ps.setString(3, jo.getString("SAMPLE_CODE"));

            //执行
            int i = ps.executeUpdate();

            syncDataLogger.info("同步命令到制样机数据库成功");
            return true;
        } catch (Exception e) {
            syncDataLogger.error("同步命令到制样机数据库失败："+e.getMessage());
            return false;
        } finally {
            if (ps != null) {
                ps.close();
            }
        }
    }


    /**
     * 修改积硕存查样柜的工作参数
     * @param
     * @return
     * @throws Exception
     */
    public boolean updateWorkParam2Jesoo(Connection conn, JSONObject jo) throws Exception {
        String sql = "update WORKPARA set [01MODE] = ?,[02MODE] = ?,[03MODE] = ?,[04MODE] = ?,[05MODE] = ?,[06MODE] = ?," +
                     "[01Cycle] = ?,[02Cycle] = ?,[03Cycle] = ?,[04Cycle] = ?,[05Cycle] = ?,[06Cycle] = ?,"+
                     "CABNUM = ?,CELLNUM = ?" ;
        int i = 1;
        PreparedStatement ps = null;
        try {
            conn.setAutoCommit(false);//关闭自动提交
            ps = conn.prepareStatement(sql);
            ps.setInt(i++, jo.getInt("MODE_21"));
            ps.setInt(i++, jo.getInt("MODE_22"));
            ps.setInt(i++, jo.getInt("MODE_32"));
            ps.setInt(i++, jo.getInt("MODE_61"));
            ps.setInt(i++, jo.getInt("MODE_31"));
            ps.setInt(i++, jo.getInt("MODE_13"));
            //
            ps.setInt(i++, jo.getInt("CYCLE_21"));
            ps.setInt(i++, jo.getInt("CYCLE_22"));
            ps.setInt(i++, jo.getInt("CYCLE_32"));
            ps.setInt(i++, jo.getInt("CYCLE_61"));
            ps.setInt(i++, jo.getInt("CYCLE_31"));
            ps.setInt(i++, jo.getInt("CYCLE_13"));
            //
            ps.setInt(i++, jo.getInt("CABNUM"));
            ps.setInt(i++, jo.getInt("CELLNUM"));

            //执行
            int k = ps.executeUpdate();

            syncDataLogger.info("同步存样柜工作参数成功");
            return true;
        } catch (Exception e) {
            syncDataLogger.error("同步存样柜工作参数失败："+e.getMessage());
            return false;
        } finally {
            if (ps != null) {
                ps.close();
            }
        }
    }


    /**
     * 修改积硕存查样柜的工作参数,泉州，因有第三方抽检样，有点差别20200623
     * @param
     * @return
     * @throws Exception
     */
    public boolean updateWorkParam2Jesoo4QZ(Connection conn, JSONObject jo) throws Exception {
        String sql = "update WORKPARA set [01MODE] = ?,[02MODE] = ?,[03MODE] = ?,[04MODE] = ?,[05MODE] = ?,[06MODE] = ?," +
                "[01Cycle] = ?,[02Cycle] = ?,[03Cycle] = ?,[04Cycle] = ?,[05Cycle] = ?,[06Cycle] = ?,"+
                "CABNUM = ?,CELLNUM = ?" ;
        int i = 1;
        PreparedStatement ps = null;
        try {
            conn.setAutoCommit(false);//关闭自动提交
            ps = conn.prepareStatement(sql);
            ps.setInt(i++, jo.getInt("MODE_61"));
            ps.setInt(i++, jo.getInt("MODE_62"));
            ps.setInt(i++, jo.getInt("MODE_31"));
            ps.setInt(i++, jo.getInt("MODE_32"));
            ps.setInt(i++, jo.getInt("MODE_21"));
            ps.setInt(i++, jo.getInt("MODE_22"));
            //
            ps.setInt(i++, jo.getInt("CYCLE_61"));
            ps.setInt(i++, jo.getInt("CYCLE_62"));
            ps.setInt(i++, jo.getInt("CYCLE_31"));
            ps.setInt(i++, jo.getInt("CYCLE_32"));
            ps.setInt(i++, jo.getInt("CYCLE_21"));
            ps.setInt(i++, jo.getInt("CYCLE_22"));
            //
            ps.setInt(i++, jo.getInt("CABNUM"));
            ps.setInt(i++, jo.getInt("CELLNUM"));

            //执行
            int k = ps.executeUpdate();

            syncDataLogger.info("同步存样柜工作参数成功");
            return true;
        } catch (Exception e) {
            syncDataLogger.error("同步存样柜工作参数失败："+e.getMessage());
            return false;
        } finally {
            if (ps != null) {
                ps.close();
            }
        }
    }


    /**
     * 插入积硕存查样柜的操作命令
     * @param
     * @return
     * @throws Exception
     */
    public boolean insertCMD2Jesoo(Connection conn, JSONObject jo) throws Exception {
//      String sql = "insert into OPDOC(SampleId,OpType,OpDest,WWName,GGName,CCName,Operator,OpAUDIT,CreateTime) VALUES " +
        String sql = "insert into OPDOC(SampleId,OpType,OpDest,Operator,OpAUDIT,CreateTime) VALUES " +
                "(?,?,?,?,'1',GETDATE())" ;

        int i = 1;
        PreparedStatement ps = null;
        try {
            conn.setAutoCommit(false);//关闭自动提交
            ps = conn.prepareStatement(sql);
            ps.setString(i++, jo.getString("PACK_CODE"));
            ps.setInt(i++, jo.getInt("OP_TYPE"));
            ps.setInt(i++, jo.getInt("OP_DEST"));
//            ps.setString(i++, jo.getString("WW"));
//            ps.setString(i++, jo.getString("GG"));
//            ps.setString(i++, jo.getString("CC"));
            ps.setString(i++, jo.getString("OPERATOR"));

            //执行
            int k = ps.executeUpdate();

            syncDataLogger.info("同步存样柜操作命令成功");
            return true;
        } catch (Exception e) {
            syncDataLogger.error("同步存样柜操作命令失败："+e.getMessage());
            return false;
        } finally {
            if (ps != null) {
                ps.close();
            }
        }
    }


    /**
     * 插入开元存查样柜的操作命令
     * @param
     * @return
     * @throws Exception
     */
    public boolean insertCMD2JBky(Connection conn, JSONObject jo) throws Exception {
//        String sql = "insert into tb_preAction(SSName,Sample_ID,Priority,DoneState,OP_DEST,person_ID,Operator,I_Time) VALUES " +
//                "(?,?,?,?,?,?,?,'1',GETDATE())" ;
        String sql = "insert into tb_preAction(SSName,Sample_ID,Operate_code,person_ID,Priority,DoneState,bolt_id,PersonName,OP_DEST,OP_STATUS,I_Time) VALUES " +
                "(1,?,?,?,?,0,?,?,?,?,GETDATE())" ;//由于开元两个柜子号里边都填的是1，所以柜子号填死 SSName OP_DEST,OP_STATUS

        int i = 1;
        PreparedStatement ps = null;
        try {
            conn.setAutoCommit(false);//关闭自动提交
            ps = conn.prepareStatement(sql);
            ps.setString(i++, jo.getString("PACK_CODE"));
            ps.setInt(i++, jo.getInt("OPERATE_CODE"));
            ps.setString(i++, jo.getString("OPERATOR"));
            ps.setInt(i++, jo.getInt("PRIORITY"));
            ps.setInt(i++, jo.getInt("CABINET_REC_ID"));
            ps.setString(i++, jo.getString("OPERATOR"));
            ps.setInt(i++, jo.getInt("OP_DEST"));
            ps.setInt(i++, jo.getInt("OP_STATUS"));

            //执行
            int k = ps.executeUpdate();

            syncDataLogger.info("同步存样柜操作命令成功");
            return true;
        } catch (Exception e) {
            syncDataLogger.error("同步存样柜操作命令失败："+e.getMessage());
            return false;
        } finally {
            if (ps != null) {
                ps.close();
            }
        }
    }


    /**
     * 插入开元启动传输柜的操作命令
     * @param
     * @return
     * @throws Exception
     */
    public boolean insertCMD2JBkyqd (Connection conn, JSONObject jo) throws Exception {
//        String sql = "insert into tb_preAction(SSName,Sample_ID,Priority,DoneState,OP_DEST,person_ID,Operator,I_Time) VALUES " +
//                "(?,?,?,?,?,?,?,'1',GETDATE())" ;
        String sql = "insert into Trans_Cmd_Tb(TransPriority,Cmdtype) VALUES " +
                "(?,1)" ;

        int i = 1;
        PreparedStatement ps = null;
        try {
            conn.setAutoCommit(false);//关闭自动提交
            ps = conn.prepareStatement(sql);


            ps.setInt(i++, jo.getInt("TRANSPRIORITY"));
//            ps.setInt(i++, jo.getInt("CMDTYPE"));


            //执行
            int k = ps.executeUpdate();

            syncDataLogger.info("同步气动传输操作命令成功");
            return true;
        } catch (Exception e) {
            syncDataLogger.error("同步气动传输操作命令成功："+e.getMessage());
            return false;
        } finally {
            if (ps != null) {
                ps.close();
            }
        }
    }



    /**
     * 取朗坤报表数据
     * @return
     * @throws Exception
     */
    public String getMessageData(String reportId, String ourDBSource) throws Exception {
        CallableStatement cs = null;
        String returnStr = "";
        CLOB clob = null;
        Connection conn = commonUtil.getConnection(ourDBSource);
        if (conn == null) {
            reportLogger.error("获取报表时数据库连接失败");
            return "";
        }

        try {
            conn.setAutoCommit(false);//关闭自动提交
            cs = conn.prepareCall("{call pk_yg_report.get_report_msg(?,?)}");
            cs.setString(1, reportId);
            cs.registerOutParameter(2, oracle.jdbc.OracleTypes.CLOB);
            cs.execute();

            clob = CommonUtil.getOracleClob(cs.getClob(2));

            StringBuffer sb = new StringBuffer();
            if (clob != null) {
                Reader clobStream = clob.getCharacterStream();
                char[] cBuff = new char[Integer.parseInt(String.valueOf(clob.length()))];
                int i = 0;
                while ((i = clobStream.read(cBuff)) != -1) {
                    sb.append(cBuff, 0, i);
                }
                clobStream.close();
            } else {
                return "";
            }
            returnStr = sb.toString();
        } catch (Exception e) {
            reportLogger.error("同步报表数据异常："+e.getMessage());
            throw e;
        } finally {
            try {
                if (clob != null) {
                    clob.freeTemporary();
                }
            } catch (SQLException e2) {}
            commonUtil.closeResource(cs, conn);
        }
        //return CommonUtil.replaceBlank(returnStr);
        return returnStr;
    }

    /**
     * 报表数据上传后回写
     * @return
     * @throws Exception
     */
    public void reportWriteBack(String returnXml, String ourDBSource) throws Exception {
        CallableStatement cs = null;
        Connection conn = commonUtil.getConnection(ourDBSource);
        if (conn == null) {
            reportLogger.error("回写报表处理状态时获取数据库连接为空");
            return;
        }

        try {
            conn.setAutoCommit(false);//关闭自动提交
            cs = conn.prepareCall("{call pk_yg_report.writeBackReport_msg(?,?,?)}");
            cs.setString(1, returnXml);
            cs.registerOutParameter(2, Types.VARCHAR);
            cs.registerOutParameter(3, Types.VARCHAR);
            cs.execute();
            reportLogger.info("回写报表处理状态完成["+cs.getString(3)+"]："+returnXml);
        } catch (Exception e) {
            reportLogger.error("回写报表处理状态时发生异常："+e.getMessage());
        } finally {
            commonUtil.closeResource(cs, conn);
        }
    }


    /**
     * 终端设备统一接口业务处理存储过程
     */
    public boolean TerminalBizProc(String receivedString) {
        CallableStatement cs = null;
        Connection conn = null;
        boolean result = false;
        try {
            conn = commonUtil.getConnection();
            if (conn == null) {
                terminalBizLogger.error("统一终端接口业务处理数据库连接为空，请检查数据库");
                return false;
            }

            conn.setAutoCommit(false);//关闭自动提交
            cs = conn.prepareCall("{call PK_TERMINAL_PROCESSOR.main(?,?,?)}");

            cs.setString(1, receivedString);
            cs.registerOutParameter(2, Types.VARCHAR);//输出
            cs.registerOutParameter(3, Types.VARCHAR);
            cs.execute();

            String resCode = cs.getString(2);
            String resMsg = cs.getString(3);
            if(resCode.equals("0")){//正常处理成功
                result = true;
            } else {//需要缓存
                terminalBizLogger.error("统一终端接口业务处理失败，异常信息："+resMsg);
                result = false;
            }
        } catch (Exception e) {
            terminalBizLogger.error("统一终端接口业务处理异常："+e.getMessage());
            return false;
        } finally {
            commonUtil.closeResource(cs, conn);
        }
        return result;
    }

    /**
     * 终端设备上位机程序启停命令获取
     */
    public String qryTerminalProCMD(String qryInfo) throws Exception {
        CallableStatement cs = null;
        Connection conn = commonUtil.getConnection();

        if (conn == null) {
            terminalBizLogger.error("统一终端接口业务处理数据库连接为空，请检查数据库");
            return "";
        }

        try {
            conn.setAutoCommit(false);//关闭自动提交
            cs = conn.prepareCall("{call PK_TERMINAL_PROCESSOR.qry_terminal_cmd(?,?,?,?)}");

            cs.setString(1, qryInfo);
            cs.registerOutParameter(2, Types.VARCHAR);//输出
            cs.registerOutParameter(3, Types.VARCHAR);
            cs.registerOutParameter(4, Types.VARCHAR);
            cs.execute();

            String returnInfo = cs.getString(2);
            String resCode = cs.getString(3);
            String resMsg = cs.getString(4);
            if(resCode.equals("0")){
                conn.commit();
                return returnInfo;
            } else {
                terminalBizLogger.error("获取操作设备程序命令失败："+resMsg);
                return "[]";
            }
        } catch (Exception e) {
            conn.rollback();
            terminalBizLogger.error("获取操作设备程序命令发生异常："+e.getMessage());
            return "[]";
        } finally {
            commonUtil.closeResource(cs, conn);
        }
    }

    /**
     * 获取系统静态配置变量
     * @return
     */
    public List<ConstantEntity> qryConstantCfgData() {
        Connection conn = null;
        ConstantEntity bean = null;
        ResultSet rs;
        PreparedStatement ps = null;
        List<ConstantEntity> list = new ArrayList<ConstantEntity>();

        try {
            conn = commonUtil.getConnection();
            if (conn == null) {
                logger.error("获取静态数据配置时数据库连接为空");
                return list;
            }

            String sqlStr = "select a.CONST_KEY, a.CONST_VALUE from constant_data_config a where a.is_effective = 'Y'";
            ps = conn.prepareStatement(sqlStr);
            rs = ps.executeQuery();

            while (rs.next()) {
                bean = new ConstantEntity();
                bean.setKey(rs.getString("CONST_KEY"));
                bean.setValue(rs.getString("CONST_VALUE"));

                list.add(bean);
            }
        } catch (Exception e) {
            logger.error("获取系统静态配置参数异常：" + e.getMessage());
            System.out.println("获取系统静态配置参数异常：" + e.getMessage());
            e.printStackTrace();
        } finally {
            commonUtil.closeResource(ps, conn);
        }
        return list;
    }


    public boolean insertIntfCacheData(String txt) throws Exception {
        PreparedStatement ps = null;
        Connection conn = null;
        try {
            conn = commonUtil.getConnection("cache_sqlite");
            if (conn == null) {
                terminalBizLogger.error("连接接口缓存数据库失败");
                return false;
            }

            conn.setAutoCommit(false);//关闭自动提交
            ps = conn.prepareStatement("insert into INTF_CACHE(CACHE_TEXT, CACHE_TIME, DEAL_TAG) values(?,datetime('now'),'0')");
            ps.setString(1, txt);

            //执行insert
            int i = ps.executeUpdate();
            conn.commit();
            terminalBizLogger.info("缓存数据插入成功");
            return true;
        } catch (Exception e) {
            terminalBizLogger.error("缓存数据插入失败："+e.getMessage());
            if (conn != null) {
                conn.rollback();
            }
            return false;
        } finally {
            commonUtil.closeResource(ps, conn);
        }
    }


    /**
     * 获取缓存的数据
     * @param
     * @return
     * @throws Exception
     */
    public List<CacheDataEntity> getIntfCacheData() throws Exception {
        StringBuffer sqlStrBuffer = new StringBuffer();
        Connection conn = null;
        String returnStr = "[]";
        ResultSet rs;
        PreparedStatement ps = null;
        List<CacheDataEntity> list = new ArrayList<>();
        try {
            conn = commonUtil.getConnection("cache_sqlite");
            if (conn == null) {
                terminalBizLogger.error("获取缓存数据时连接数据库失败");
                return list;
            }

            //获取日志ID主键
            sqlStrBuffer.append("select ID, CACHE_TEXT from INTF_CACHE where DEAL_TAG = '0' order by ID limit 0,10");
            ps = conn.prepareStatement(sqlStrBuffer.toString());
            rs = ps.executeQuery();
            CacheDataEntity cd;

            while (rs != null && rs.next()) {
                cd = new CacheDataEntity();
                cd.setId(rs.getString("ID"));
                cd.setCacheText(rs.getString("CACHE_TEXT"));
                list.add(cd);
            }

            if (rs != null) {
                rs.close();
            }
        } catch (Exception e) {
            terminalBizLogger.error("获取终端接口缓存数据失败："+e.getMessage());
            throw e;
        } finally {
            commonUtil.closeResource(ps, conn);
        }
        return list;
    }


    /**
     * 修改缓存数据已经处理过的标识
     * @return
     * @throws Exception
     */
    public boolean updateIntfCacheData(String id, String dealTag) throws Exception {
        String sql = "update INTF_CACHE set DEAL_TAG=?, DEAL_TIME=datetime('now') where ID=?";
        Connection conn = null;
        PreparedStatement ps = null;

        try {
            conn = commonUtil.getConnection("cache_sqlite");

            if (conn == null) {
                terminalBizLogger.error("处理缓存数据时连接数据库失败！");
                return false;
            }

            conn.setAutoCommit(false);//关闭自动提交
            ps = conn.prepareStatement(sql);

            ps.setString(1, dealTag);
            ps.setInt(2, Integer.parseInt(id));

            int i = ps.executeUpdate();

            terminalBizLogger.info("修改终端缓存数据处理标识成功，id："+id);
            conn.commit();
            return true;
        } catch (Exception e) {
            terminalBizLogger.error("修改终端缓存数据处理标识失败："+e.getMessage());
            if (conn != null) {
                conn.rollback();
            }
            return false;
        } finally {
            commonUtil.closeResource(ps, conn);
        }
    }


    public static void main(String[] args) {
        DataManager dm = DataManager.getInstance();
        try {
            dm.TerminalBizProc("fuck you, java !");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 从管控系统获取需要同步分选系统批次和料筒信息
     * @return
     */
    public JSONObject getSampleSelectData(String taskConfId,String ourDBSource){
        CallableStatement cs = null;
        String returnStr = "";
        Connection conn = null;

        JSONObject retJsonObj = new JSONObject();
        retJsonObj.put("resCode","1");

        try {
            conn = commonUtil.getConnection(ourDBSource);
            if (conn == null) {
                syncDataLogger.error("同步分选系统批次和料筒信息时数据库连接失败");
                retJsonObj.put("resMsg","同步分选系统批次和料筒信息时数据库连接失败");
                return retJsonObj;
            }

            conn.setAutoCommit(false);//关闭自动提交
            cs = conn.prepareCall("{call PK_TRAIN_SCHEDULE.get_sample_dispatch_row(?,?,?)}");
            cs.registerOutParameter(1, OracleTypes.VARCHAR);
            cs.registerOutParameter(2, OracleTypes.VARCHAR);
            cs.registerOutParameter(3, OracleTypes.VARCHAR);
            cs.execute();

            String getJsonStr = cs.getString(1);
            String resCode = cs.getString(2);
            String resMsg = cs.getString(3);

            if("0".equalsIgnoreCase(resCode) && getJsonStr != null){
                JSONObject getJson = JSONObject.fromObject(getJsonStr); // 节点为list
                retJsonObj.put("resCode","0");
                retJsonObj.put("resMsg","成功");
                retJsonObj.put("value",getJson);
            }
            conn.commit();
        } catch (Exception e) {
            try{
                if(conn != null){
                    conn.rollback();
                }
            }catch (Exception e2) {
                e2.printStackTrace();
            }
            retJsonObj.put("resMsg", "同步分选系统批次和料筒信息异常：" + e.getMessage());
            syncDataLogger.error("同步分选系统批次和料筒信息异常："+e.getMessage());
        } finally {
            commonUtil.closeResource(cs, conn);
        }
        return retJsonObj;
    }


    /**
     * 同步分选系统批次和料筒信息 t1010 t1020
     * @param
     * @return
     */
    public JSONObject addSampleSelectData(Connection conn, JSONObject json){
        String sqlT1010Insert = "insert into t1010(SP_ID,SP_STS,PK_FT,TBC_SL,FSF_SL) values (?,?,?,?,?)" ;
        String sqlT1020Insert = "insert into t1020(IS_VD,SP_ID,BL_ID,LD_ID,PD_GT,ST_DS,ST_FG) values (?,?,?,?,?,?,?)" ;
        String sqlSelect = "select count(1) nums from t1010 where SP_ID = ?";
        PreparedStatement ps = null;
        PreparedStatement psT1010 = null;
        PreparedStatement psT1020 = null;
        ResultSet resultSet = null;
        JSONObject exeReturn = new JSONObject();
        String sampleId = ""; //单独列出，还要回写
        try{
            JSONObject jsonValue = json.getJSONObject("value");
            if(jsonValue != null){
                JSONArray rows = jsonValue.getJSONArray("list");
                psT1020 = conn.prepareStatement(sqlT1020Insert);
                for(int i=0;i<rows.size();i++){
                    JSONObject row = rows.getJSONObject(i);
                    String recordId = row.getString("Record_Id");
                    sampleId = row.getString("Sample_Id");
                    String barrelId = row.getString("Barrel_Id");
                    String lidId = row.getString("Lid_Id");
                    String packageDataGenerateTime = row.getString("Package_Data_Generate_Time");
                    String selectDataStatus = row.getString("Select_Data_Status");//先写死2

                    //判断主表是否已经有记录，如果没有，则插入主表和子表数据，否则返回成功（即已经成功处理过）
                    if(i==0){
                        ps = conn.prepareStatement(sqlSelect);
                        ps.setString(1,sampleId);
                        resultSet = ps.executeQuery();
                        while(resultSet.next()){
                            int nums = resultSet.getInt("nums");
                            if(nums == 0){
                                //t1010(SP_ID,SP_STS,PK_FT,TBC_SL,FSF_SL))
                                psT1010 = conn.prepareStatement(sqlT1010Insert);
                                psT1010.setString(1,sampleId);
                                psT1010.setString(2,"2");
                                psT1010.setString(3,packageDataGenerateTime);
                                psT1010.setString(4,"0");
                                psT1010.setString(5,"0");
                                psT1010.execute();
                            }
                        }
                    }

                    //插入子表记录t1020: IS_VD,SP_ID,BL_ID,LD_ID,PD_GT,ST_DS,ST_FG
                    psT1020.setBoolean(1, new Boolean(true));
                    psT1020.setString(2,sampleId);
                    psT1020.setString(3,barrelId);
                    psT1020.setString(4,lidId);
                    psT1020.setString(5,packageDataGenerateTime);
                    psT1020.setString(6,"0");
                    psT1020.setBoolean(7,new Boolean(false));
                    psT1020.execute();
                    psT1020.clearParameters();
                    psT1020.clearWarnings();
                }
            }

            syncDataLogger.info("同步分选系统批次和料筒信息成功");
            exeReturn.put("resCode","0");
            exeReturn.put("key",sampleId);
            return exeReturn;
        }catch(Exception e){
            e.printStackTrace();
            syncDataLogger.error("同步分选系统批次和料筒信息失败："+e.getMessage());
            exeReturn.put("resCode","1");
            exeReturn.put("key",sampleId);
            exeReturn.put("resMsg",e.getMessage());
            return exeReturn;
        }finally {
            if(resultSet != null){
                try {
                    resultSet.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            if(ps != null){
                try {
                    ps.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            if(psT1010 != null){
                try {
                    psT1010.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            if(psT1020 != null){
                try {
                    psT1020.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    /**
     * 处理结束后，更新BATCH_DEAL_STATE_T1010 表的状态
     * @return
     */
    public void updateBatchDealStateT1010State(String sampleId,String state,String msg,String ourDBSource){
        PreparedStatement ps = null;
        Connection conn = null;
        String sql = "update batch_deal_state_t1010 set state=?, deal_msg=? where sample_id=?";
        try {
            conn = commonUtil.getConnection(ourDBSource);
            if (conn == null) {
                syncDataLogger.error("更新BATCH_DEAL_STATE_T1010 表的状态失败，无法获得连接"+ourDBSource);
            }
            conn.setAutoCommit(false);
            ps = conn.prepareStatement(sql);
            ps.setString(1,state);
            ps.setString(2,msg);
            ps.setString(3,sampleId);
            int updateNums = ps.executeUpdate();
            conn.commit();
        } catch (Exception e) {
            try{
                conn.rollback();
            }catch (Exception e2) {
                e2.printStackTrace();
            }
            syncDataLogger.error("更新BATCH_DEAL_STATE_T1010 表的状态异常："+e.getMessage());
        } finally {
            commonUtil.closeResource(ps, conn);
        }
    }

    /**
     * 下发开始分选命令到分选系统(聊城)
     * @param
     * @return
     * @throws Exception
     */
    public boolean insertCMD2SampleSelectForLC(Connection conn, JSONObject jo){
        String sqlT2010 = "insert into T2010(CM_CD,SC_TM,DT_ST) values(?,now(),1)";
        String sqlT2020 = "insert into T2020(SP_ID,DS_TM,DT_ST,DT_ST2)values(?,now(),1,1)";
        PreparedStatement psT2010 = null;
        PreparedStatement psT2020 = null;
        try {
            conn.setAutoCommit(false);//关闭自动提交

            psT2010 = conn.prepareStatement(sqlT2010);
            psT2010.setString(1, jo.getString("COMMAND_CODE"));
            psT2010.execute();

            psT2020 = conn.prepareStatement(sqlT2020);
            psT2020.setString(1,jo.getString("SAMPLE_CODE"));
            psT2020.execute();

            syncDataLogger.info("下发开始分选命令到分选系统数据库成功！");
            return true;
        } catch (Exception e) {
            syncDataLogger.error("下发开始分选命令到分选系统数据库失败："+e.getMessage());
            return false;
        } finally {
            if (psT2010 != null) {
                try{
                    psT2010.close();
                }catch(Exception e){
                    e.printStackTrace();;
                }
            }
            if (psT2020 != null) {
                try{
                    psT2020.close();
                }catch(Exception e){
                    e.printStackTrace();;
                }
            }
        }
    }

    /**
     * 从管控系统获取需要同步分选系统批次和料筒信息
     * @return
     */
    public JSONObject getSampleSelectDataNH(String taskConfId,String ourDBSource){
        CallableStatement cs = null;
        String returnStr = "";
        Connection conn = null;

        JSONObject retJsonObj = new JSONObject();
        retJsonObj.put("resCode","1");

        try {
            conn = commonUtil.getConnection(ourDBSource);
            if (conn == null) {
                syncDataLogger.error("同步分选系统批次和料筒信息时数据库连接失败");
                retJsonObj.put("resMsg","同步分选系统批次和料筒信息时数据库连接失败");
                return retJsonObj;
            }

            conn.setAutoCommit(false);//关闭自动提交
            cs = conn.prepareCall("{call pk_register.get_sample_dispatch_row(?,?,?)}");
            cs.registerOutParameter(1, OracleTypes.VARCHAR);
            cs.registerOutParameter(2, OracleTypes.VARCHAR);
            cs.registerOutParameter(3, OracleTypes.VARCHAR);
            cs.execute();

            String getJsonStr = cs.getString(1);
            String resCode = cs.getString(2);
            String resMsg = cs.getString(3);

            if("0".equalsIgnoreCase(resCode) && getJsonStr != null){
                JSONObject getJson = JSONObject.fromObject(getJsonStr); // 节点为list
                retJsonObj.put("resCode","0");
                retJsonObj.put("resMsg","成功");
                retJsonObj.put("value",getJson);
            }
            conn.commit();
        } catch (Exception e) {
            try{
                if(conn != null){
                    conn.rollback();
                }
            }catch (Exception e2) {
                e2.printStackTrace();
            }
            retJsonObj.put("resMsg", "同步分选系统批次和料筒信息异常：" + e.getMessage());
            syncDataLogger.error("同步分选系统批次和料筒信息异常："+e.getMessage());
        } finally {
            commonUtil.closeResource(cs, conn);
        }
        return retJsonObj;
    }

    /**
     * 同步南环分选系统批次和料筒信息 batch_deal_state,sample_record
     * @param
     * @return
     */
    public JSONObject addSampleSelectDataNH(Connection conn, JSONObject json){
        //Select cast('2009-01-01' as datetime)
        //String sqlBatchDealStateInsert = "insert into batch_deal_state(sample_id,sample_status,ready_time,user_id,read_flag)values(?,?,to_date(?,'yyyy-mm-dd hh24:mi:ss'),?,?)" ;
        String sqlBatchDealStateInsert = "insert into batch_deal_state(sample_id,sample_status,ready_time,user_id,read_flag)values(?,?,cast(? as datetime),?,?)" ;
        String sqlSampleRecordInsert = " insert into sample_record(id,sample_id,atomic_select_id,atomic_sample_status,read_flag)values(?,?,?,?,?)" ;
        String sqlSelect = "select count(1) nums from batch_deal_state where sample_id = ?";
        PreparedStatement ps = null;
        PreparedStatement psBatchDealState = null;
        PreparedStatement psSampleRecord = null;
        ResultSet resultSet = null;
        JSONObject exeReturn = new JSONObject();
        String sampleId = ""; //单独列出，还要回写
        try{
            JSONObject jsonValue = json.getJSONObject("value");
            if(jsonValue != null){
                JSONArray rows = jsonValue.getJSONArray("list");
                psSampleRecord = conn.prepareStatement(sqlSampleRecordInsert);
                for(int i=0;i<rows.size();i++){
                    JSONObject row = rows.getJSONObject(i);
                    String id = row.getString("id");
                    String userid = row.getString("user_id");
                    sampleId = row.getString("sample_id");
                    String atomicSelectId = row.getString("atomic_select_id");
                    String readyTime = row.getString("ready_time");

                    //判断主表是否已经有记录，如果没有，则插入主表和子表数据，否则返回成功（即已经成功处理过）
                    if(i==0){
                        ps = conn.prepareStatement(sqlSelect);
                        ps.setString(1,sampleId);
                        resultSet = ps.executeQuery();
                        while(resultSet.next()){
                            int nums = resultSet.getInt("nums");
                            if(nums > 0){
                                exeReturn.put("resCode","0");
                                exeReturn.put("key",sampleId);
                                return exeReturn;
                            }
                        }
                        //主表batch_deal_state(sample_id,sample_status,ready_time,user_id,read_flag)
                        psBatchDealState = conn.prepareStatement(sqlBatchDealStateInsert);
                        psBatchDealState.setString(1, sampleId);
                        psBatchDealState.setString(2, "1");
                        psBatchDealState.setString(3, readyTime);
                        psBatchDealState.setString(4, userid);
                        psBatchDealState.setString(5, "1");
                        psBatchDealState.execute();
                    }

                    //插入子表记录sample_record(id,sample_id,atomic_select_id,atomic_sample_status,read_flag)
                    psSampleRecord.setString(1, id);
                    psSampleRecord.setString(2, sampleId);
                    psSampleRecord.setString(3, atomicSelectId);
                    psSampleRecord.setString(4, "0");
                    psSampleRecord.setString(5, "1");
                    psSampleRecord.execute();
                    psSampleRecord.clearParameters();
                    psSampleRecord.clearWarnings();
                }
            }

            syncDataLogger.info("同步分选系统批次和料筒信息成功");
            exeReturn.put("resCode","0");
            exeReturn.put("key",sampleId);
            return exeReturn;
        }catch(Exception e){
            e.printStackTrace();
            syncDataLogger.error("同步分选系统批次和料筒信息失败："+e.getMessage());
            exeReturn.put("resCode","1");
            exeReturn.put("key",sampleId);
            exeReturn.put("resMsg",e.getMessage());
            return exeReturn;
        }finally {
            if(resultSet != null){
                try {
                    resultSet.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            if(ps != null){
                try {
                    ps.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            if(psBatchDealState != null){
                try {
                    psBatchDealState.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            if(psSampleRecord != null){
                try {
                    psSampleRecord.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    /**
     * 处理结束后，更新BATCH_DEAL_STATE_T1010 表的状态
     * @return
     */
    public void updateBatchDealStateNH(String sampleId,String state,String msg,String ourDBSource){
        PreparedStatement ps = null;
        Connection conn = null;
        String sql = "update batch_deal_state set state=?, deal_msg=? where sample_id=?";
        try {
            conn = commonUtil.getConnection(ourDBSource);
            if (conn == null) {
                syncDataLogger.error("更新batch_deal_state表的状态失败，无法获得连接"+ourDBSource);
            }
            conn.setAutoCommit(false);
            ps = conn.prepareStatement(sql);
            ps.setString(1,state);
            ps.setString(2,msg);
            ps.setString(3,sampleId);
            int updateNums = ps.executeUpdate();
            conn.commit();
        } catch (Exception e) {
            e.printStackTrace();
            try{
                conn.rollback();
            }catch (Exception e2) {
                e2.printStackTrace();
            }
            syncDataLogger.error("更新batch_deal_state表的状态异常："+e.getMessage());
        } finally {
            commonUtil.closeResource(ps, conn);
        }
    }

    /**
     * 下发开始分选命令到分选系统(谏壁)
     * @param
     * @return
     * @throws Exception
     */
    public boolean insertCMD2SampleSelectForJB(Connection conn, JSONObject jo){
        //String sql = "insert into command_info(command_code,send_time,sample_id,external_id,read_flag) values (?,sysdate,?,?,?)";
        String sql = "insert into command_info(command_code,send_time,sample_id,external_id,read_flag) values (?,getdate(),?,?,?)";
        PreparedStatement ps = null;

        try {
            conn.setAutoCommit(false);//关闭自动提交
            ps = conn.prepareStatement(sql);
            ps.setString(1, jo.getString("COMMAND_CODE"));
            ps.setString(2, jo.getString("SAMPLE_CODE"));
            ps.setString(3, jo.getString("CMD_REC_ID"));
            ps.setString(4, "1");
            ps.execute();
            syncDataLogger.info("下发开始分选命令到分选系统数据库成功！");
            return true;
        } catch (Exception e) {
            syncDataLogger.error("下发开始分选命令到分选系统数据库失败："+e.getMessage());
            return false;
        } finally {
            if (ps != null) {
                try{
                    ps.close();
                }catch(Exception e){
                    e.printStackTrace();;
                }
            }
        }
    }

    //从json中根据key获取数据
    private String getJsonValue(JSONObject graudInfoJson,String key){
        String value = null;
        try{
            if(graudInfoJson != null) {
                value = graudInfoJson.getString(key);
            }
        }catch(Throwable e){
            e.printStackTrace();
        }
        return value;
    }

    //String[0]开始时间  String[1]结束时间,获取打开门禁数据的读取时间范围
    public String[] getLastDateGuradInfoDK(Connection conGraudInfoDkQry,long betweenTime){
        String[] retTimes= new String[2];
        PreparedStatement query = null;
        ResultSet resultSet = null;
        String lastDate = null; //如果为空，当前时间-10分钟
        String sqlLastQryDate = "select a.const_value lastDate from constant_data_config a where a.const_key = 'CARD_INFO_DK_LAST_TIME' and rownum < 2";
        try {
            query = conGraudInfoDkQry.prepareStatement(sqlLastQryDate);
            resultSet = query.executeQuery();
            while(resultSet.next()){
                lastDate = resultSet.getString("lastDate");
                break;
            }
        } catch (Exception e) {
            e.printStackTrace();
            try{
                if(conGraudInfoDkQry !=null) {
                    conGraudInfoDkQry.rollback();
                }
            }catch (Exception e2) {
                e2.printStackTrace();
            }
            syncDataLogger.error("getLastDateGuradInfoDK异常："+e.getMessage());
        } finally {
            if(resultSet != null){
                try{
                    resultSet.close();
                }catch(Throwable e){
                    e.printStackTrace();
                }
            }
            commonUtil.closeResource(query,conGraudInfoDkQry);
        }

        SimpleDateFormat sdf = new SimpleDateFormat( "yyyy-MM-dd HH:mm:ss" );
        String beginDateStr = null;
        String endDateStr = null;
        java.util.Date nowDate = new java.util.Date();
        try{
            java.util.Date beginDate = new Date(sdf.parse(lastDate).getTime() - 30*1000);
            //betweenTime配置是300秒，5分钟一次。但实际java定时任务>5分钟才执行一次。
            //只要当前时间-beginDate < 20分钟，就直接用当前时间为结束时间，否则，怕数据量一次太大，改用时间beginDate+5为结束时间
            java.util.Date endDate = new Date(beginDate.getTime()+betweenTime*1000);
            beginDateStr = sdf.format(beginDate);//多取30秒，后面判重

            if((nowDate.getTime()-endDate.getTime() ) < 20*60*1000 ){
                endDateStr = sdf.format(nowDate);
            }else{
                endDateStr = sdf.format(endDate);
            }
        }catch(Throwable e){
            //如果没有配置，或配置异常，则默认取 当前5分钟前到现在的时间范围的数据
            long time = nowDate.getTime()-5*60*1000;
            beginDateStr = sdf.format(new Date(time));//当前时间 -5分钟
            endDateStr = sdf.format(nowDate);
            e.printStackTrace();
        }

        retTimes[0] = beginDateStr;
        retTimes[1] = endDateStr;
        syncDataLogger.error("getGuradinfo,beginDateStr="+beginDateStr+" endDateStr="+endDateStr);
        return retTimes ;
    }

    //更新门禁数据上一次读取时间
    public void updateLastDateGuradInfoDK(Connection conGraudInfoDkQry,String nextTime){
        PreparedStatement psUpdate = null;
        String sqlUpdate = "update constant_data_config a set const_value = ? where a.const_key = 'CARD_INFO_DK_LAST_TIME'";
        try {
            conGraudInfoDkQry.setAutoCommit(false);
            psUpdate = conGraudInfoDkQry.prepareStatement(sqlUpdate);
            psUpdate.setString(1,nextTime);
            int nums  = psUpdate.executeUpdate();
            conGraudInfoDkQry.commit();;
        } catch (Exception e) {
            e.printStackTrace();
            try{
                if(conGraudInfoDkQry !=null) {
                    conGraudInfoDkQry.rollback();
                }
            }catch (Exception e2) {
                e2.printStackTrace();
            }
            syncDataLogger.error("updateLastDateGuradInfoDK异常："+e.getMessage());
        } finally {
            if(psUpdate != null){
                try{
                    psUpdate.close();
                }catch(Throwable e){
                    e.printStackTrace();
                }
            }
        }
    }

    /**
     * 将门禁数据写入card_user_record_dk和device_error_info表
     * @return
     */
    public void insertGuradInfoDK(Connection conCardInfoDk, JSONObject guardInfoJson){
        PreparedStatement psCardInfo = null;
        PreparedStatement psDeviceErrInfo = null;
        PreparedStatement query = null;
        ResultSet resultSet = null;
        String sqlSelect = "select count(1) nums from card_user_record_dk where cardNo=? and eventTimeStr=?";
        String sqlCardInfo = "insert into card_user_record_dk(eventTime,eventTimeStr,devAlias,eventPointName,eventName,pin,userName,cardNo,deptName,readerName,verifyModeName,areaName)values(to_date(substr(?,1,19),'yyyy-mm-dd hh24:mi:ss'),?,?,?,?,?,?,?,?,?,?,?)";
        String sqlDeviceBroadInfo = "insert into device_broad_info(machin_code,broad_rec_id,broad_time,broad_dec,data_status,insert_time,op_code,device_broad_pri) values ('GURAD_INFO_DK',seq_device_broad_info.nextval,to_date(substr(?,1,19),'yyyy-mm-dd hh24:mi:ss'),?,0,sysdate,1,1)";//"insert into device_error_info(error_rec_id,machin_code,flow_id,error_code,error_time,error_dec,error_confirm,insert_time,data_status) values (seq_device_error_info.nextval,'CARD_INFO_DK','200','1',to_date(substr(?,1,19),'yyyy-mm-dd hh24:mi:ss'),?,0,sysdate,0)";
        try {
            query = conCardInfoDk.prepareStatement(sqlSelect);
            query.setString(1,getJsonValue(guardInfoJson,"cardNo"));
            query.setString(2,getJsonValue(guardInfoJson,"eventTime"));
            resultSet = query.executeQuery();
            while(resultSet.next()){
                int nums = resultSet.getInt("nums");
                if(nums > 0){
                    return;
                }
            }

            conCardInfoDk.setAutoCommit(false);
            psCardInfo = conCardInfoDk.prepareStatement(sqlCardInfo);
            psCardInfo.setString(1,getJsonValue(guardInfoJson,"eventTime"));//eventTime,
            psCardInfo.setString(2,getJsonValue(guardInfoJson,"eventTime"));//eventTimeStr,
            psCardInfo.setString(3,getJsonValue(guardInfoJson,"devAlias"));//devAlias,
            psCardInfo.setString(4,getJsonValue(guardInfoJson,"eventPointName"));//eventPointName,
            psCardInfo.setString(5,getJsonValue(guardInfoJson,"eventName"));//eventName,
            psCardInfo.setString(6,getJsonValue(guardInfoJson,"pin"));//pin,
            psCardInfo.setString(7,getJsonValue(guardInfoJson,"name"));//userName,
            psCardInfo.setString(8,getJsonValue(guardInfoJson,"cardNo"));//cardNo,
            psCardInfo.setString(9,getJsonValue(guardInfoJson,"deptName"));//deptName,
            psCardInfo.setString(10,getJsonValue(guardInfoJson,"readerName"));//readerName,
            psCardInfo.setString(11,getJsonValue(guardInfoJson,"verifyModeName"));//verifyModeName,
            psCardInfo.setString(12,getJsonValue(guardInfoJson,"areaName"));//areaName
            int updateNums = psCardInfo.executeUpdate();
            psDeviceErrInfo = conCardInfoDk.prepareStatement(sqlDeviceBroadInfo);
            psDeviceErrInfo.setString(1,getJsonValue(guardInfoJson,"eventTime"));
            psDeviceErrInfo.setString(2,"门禁信息[ "+getJsonValue(guardInfoJson,"deptName")+"-"+getJsonValue(guardInfoJson,"name")+":"+getJsonValue(guardInfoJson,"readerName")+" ]");
            updateNums = psDeviceErrInfo.executeUpdate();
            syncDataLogger.error("getGuradinfo,updateNums ="+updateNums);
            conCardInfoDk.commit();
        } catch (Exception e) {
            syncDataLogger.error("getGuradinfo,err");
            e.printStackTrace();
            syncDataLogger.error("getGuradinfo,err ="+e.getMessage());
            try{
                if(conCardInfoDk !=null) {
                    conCardInfoDk.rollback();
                }
            }catch (Exception e2) {
                e2.printStackTrace();
            }
            syncDataLogger.error("插入gard_user_record_dk表的异常："+e.getMessage());
        } finally {
            if(resultSet != null){
                try{
                    resultSet.close();
                }catch(Throwable e){
                    e.printStackTrace();
                }
            }
            if(query != null){
                try{
                    query.close();
                }catch(Throwable e){
                    e.printStackTrace();
                }
            }
            if(psDeviceErrInfo != null){
                try{
                    psDeviceErrInfo.close();
                }catch(Throwable e){
                    e.printStackTrace();
                }
            }
            if(psCardInfo != null){
                try{
                    psCardInfo.close();
                }catch(Throwable e){
                    e.printStackTrace();
                }
            }
        }
    }




    /**
     * 插入命令到入炉采样机数据库,北仑杭钻入炉采样机表结构特殊
     * @param
     * @return
     * @throws Exception
     */
    public boolean insertCommand2RLCYJ4BL(Connection conn, JSONObject jo) throws Exception {
        String sql = "insert into CY_batch_Tb(machineCode,SampleID,SampleDate,insertTime,dataStatus) " +
                "values(?,?,GETDATE(),GETDATE(),0)";

        PreparedStatement ps = null;
        try {
            conn.setAutoCommit(false);//关闭自动提交
            ps = conn.prepareStatement(sql);
            ps.setString(1, jo.getString("MACHINE_CODE"));
            ps.setString(2, jo.getString("SAMPLE_CODE"));
            //执行insert
            int i = ps.executeUpdate();
            syncDataLogger.info("同步命令到入炉采样机数据库成功");
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            syncDataLogger.error("同步命令到入炉采样机数据库失败："+e.getMessage());
            return false;
        } finally {
            if (ps != null) {
                ps.close();
            }
        }
    }
    /**
     * 插入命令到汽车采样机数据库-大开
     * @param
     * @return
     * @throws Exception
     */
    public boolean insertCommand2CYJDK(Connection conn, JSONObject jo) throws Exception {
        String sql = "insert into cy_cmd_tb(machineCode,commandCode,RECORD_NO,carid,car_typeid,SampleNumber,SamNumber,SendCommandTime,DataStatus,CoalClass,PreCarNum,PreWeight,suofeninterval) " +
                "values(?,?,?,?,?,?,?,GETDATE(),0,'0',?,?,?)";

        PreparedStatement ps = null;
        try {
            conn.setAutoCommit(false);//关闭自动提交
            ps = conn.prepareStatement(sql);
            ps.setString(1, jo.getString("MACHINE_CODE"));
            ps.setInt(2, Integer.parseInt(jo.getString("COMMAND_CODE")));
            ps.setInt(3, Integer.parseInt(jo.getString("RECORD_NO")));
            ps.setString(4, jo.getString("CARID"));
            ps.setString(5, jo.getString("CAR_TYPEID"));
            ps.setString(6, jo.getString("SAMPLENUMBER"));
            ps.setInt(7, Integer.parseInt(jo.getString("SAMNUMBER")));
            ps.setInt(8, Integer.parseInt(jo.getString("PRECARNUM")));
            ps.setInt(9, Integer.parseInt(jo.getString("PREWEIGHT")));
            ps.setInt(10, Integer.parseInt(jo.getString("SUOFENINTERVAL")));
            //执行insert
            int i = ps.executeUpdate();

            syncDataLogger.info("同步命令到采样机数据库成功");
            return true;
        } catch (Exception e) {
            syncDataLogger.error("同步命令到采样机数据库失败："+e.getMessage());
            return false;
        } finally {
            if (ps != null) {
                ps.close();
            }
        }
    }

    /**
     * 插入命令到采样机数据库
     * @param
     * @return
     * @throws Exception
     */
    public boolean insertCommand2LDRLCYJ(Connection conn, JSONObject jo) throws Exception {
        String sql = "insert into cy_cmd_tb(machineCode, commandCode,sampleId,sendCommandTime,dataStatus) " +
                "values(?,?,?,GETDATE(),0)";

        PreparedStatement ps = null;
        try {
            conn.setAutoCommit(false);//关闭自动提交
            ps = conn.prepareStatement(sql);
            ps.setString(1, jo.getString("MACHINE_CODE"));
            ps.setInt(2, Integer.parseInt(jo.getString("COMMAND_CODE")));
            ps.setString(3, jo.getString("SAMPLE_CODE")==null?"":jo.getString("SAMPLE_CODE"));

            //执行insert
            int i = ps.executeUpdate();

            //启动需要填写参数
            String cmdCode = jo.getString("COMMAND_CODE");
            if (cmdCode != null && cmdCode.equals("1")) {
                sql = "insert into cy_interface_tb(sampleId,batchNo,trainNumber,weight,type,water,sampleType,barrelNumber,SampleInteval,SFFreq,SFCount,SFWaitTime,dataStatus) " +
                        "values(?,?,?,?,?,?,?,?,?,?,?,?,0)";

                ps = conn.prepareStatement(sql);
                ps.setString(1, jo.getString("SAMPLE_CODE"));
                ps.setString(2, jo.getString("BATCH_NO"));
                ps.setInt(3, Integer.parseInt(jo.getString("TRAIN_NUMBER")==""?"0":jo.getString("TRAIN_NUMBER")));
                ps.setInt(4, Integer.parseInt(jo.getString("BATCH_WEIGHT")==""?"0":jo.getString("BATCH_WEIGHT")));
                ps.setInt(5, Integer.parseInt(jo.getString("COAL_TYPE")==""?"0":jo.getString("COAL_TYPE")));
                ps.setInt(6, Integer.parseInt(jo.getString("WATER_CYJ")==""?"0":jo.getString("WATER_CYJ")));
                ps.setInt(7, Integer.parseInt(jo.getString("SAMPLE_TYPE")==""?"0":jo.getString("SAMPLE_TYPE")));
                ps.setInt(8, Integer.parseInt(jo.getString("BARREL_NUMBER")==""?"0":jo.getString("BARREL_NUMBER")));
                ps.setInt(9, Integer.parseInt(jo.getString("SAMPLE_INTEVAL")==""?"0":jo.getString("SAMPLE_INTEVAL")));
                ps.setInt(10, Integer.parseInt(jo.getString("SF_FREQ")==""?"0":jo.getString("SF_FREQ")));
                ps.setInt(11, Integer.parseInt(jo.getString("SF_COUNT")==""?"0":jo.getString("SF_COUNT")));
                ps.setInt(12, Integer.parseInt(jo.getString("SF_WAITTIME")==""?"0":jo.getString("SF_WAITTIME")));
                int k = ps.executeUpdate();
            }else if (cmdCode != null && cmdCode.equals("2"))
            {
                sql = "insert into cy_interface_tb(sampleId,batchNo,trainNumber,weight,type,water,sampleType,barrelNumber,SampleInteval,SFFreq,SFCount,SFWaitTime,dataStatus) " +
                        "values(?,?,?,?,?,?,?,?,?,?,?,?,0)";

                ps = conn.prepareStatement(sql);
                ps.setString(1, jo.getString("SAMPLE_CODE"));
                ps.setString(2, jo.getString("BATCH_NO"));
                ps.setInt(3, Integer.parseInt("0"));
                ps.setInt(4,Integer.parseInt("0"));
                ps.setInt(5, Integer.parseInt("0"));
                ps.setInt(6, Integer.parseInt("0"));
                ps.setInt(7,Integer.parseInt("0"));
                ps.setInt(8, Integer.parseInt("0"));
                ps.setInt(9, Integer.parseInt("0"));
                ps.setInt(10,Integer.parseInt("0"));
                ps.setInt(11, Integer.parseInt("0"));
                ps.setInt(12, Integer.parseInt("0"));
                int k = ps.executeUpdate();
            }
            syncDataLogger.info("同步命令到采样机数据库成功");
            return true;
        } catch (Exception e) {
            syncDataLogger.error("同步命令到采样机数据库失败："+e.getMessage());
            return false;
        } finally {
            if (ps != null) {
                ps.close();
            }
        }
    }


    /**
     * 插入命令到乐东制样机数据库
     * @param
     * @return
     * @throws Exception
     */
    public boolean insertCommand2LDZYJ(Connection conn, JSONObject jo) throws Exception {
        String sql = "insert into MACHIN_CMD_INFO(MACHIN_CODE, COMMAND_CODE,SAMPLE_CODE,SEND_CMD_TIME,DATA_STATUS) " +
                "values(?,?,?,GETDATE(),0)";

        PreparedStatement ps = null;
        try {
            conn.setAutoCommit(false);//关闭自动提交
            ps = conn.prepareStatement(sql);
            ps.setString(1, jo.getString("MACHINE_CODE"));
            ps.setInt(2, Integer.parseInt(jo.getString("COMMAND_CODE")));
            ps.setString(3, jo.getString("SAMPLE_CODE"));
            //执行insert
            int i = ps.executeUpdate();
            //启动需要填写参数
            String cmdCode = jo.getString("COMMAND_CODE");
            if (cmdCode != null && (cmdCode.equals("1") || cmdCode.equals("4"))) {//启动和开启投料罩，都发送参数
                sql = "insert into PREPAR_SAMPLING_INTF(SAMPLE_CODE,COAL_TYPE,COAL_SIZE,COAL_WATER,SAMPLING_CODE,DATA_STATUS) " +
                        "values(?,?,?,?,?,0)";

                ps = conn.prepareStatement(sql);
                ps.setString(1, jo.getString("SAMPLE_CODE"));
                ps.setString(2, jo.getString("COAL_TYPE"));
                ps.setString(3, jo.getString("SIZE"));
                ps.setString(4, jo.getString("WATER_ZYJ"));
                ps.setString(5, jo.getString("SAMPLE_CODE"));

                int k = ps.executeUpdate();
            }

            syncDataLogger.info("同步命令到制样机数据库成功");
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            syncDataLogger.error("同步命令到制样机数据库失败："+e.getMessage());
            return false;
        } finally {
            if (ps != null) {
                ps.close();
            }
        }
    }


    /**
     * 织金  入炉采样机集样桶数据库中更新下当前采样编码
     * @return
     */
    public boolean updateCommand2ZJRLCYJ(Connection conn, JSONObject jo) throws Exception {
        String sql = "update cy_cmd_tb set commandCode=?, sampleID=?, sendCommandTime=GETDATE(), dataStatus=? where machineCode=?";

        PreparedStatement ps = null;
        try {
            conn.setAutoCommit(false);//关闭自动提交
            ps = conn.prepareStatement(sql);
            ps.setInt(1, Integer.parseInt(jo.getString("COMMAND_CODE")));
            ps.setString(2, jo.getString("SAMPLE_CODE")==null?"":jo.getString("SAMPLE_CODE"));
            ps.setString(3, "0");
            ps.setString(4, jo.getString("MACHINE_CODE"));

            //执行update
            int i = ps.executeUpdate();

            syncDataLogger.info("同步命令到入炉采样封装机数据库成功");
            return true;
        } catch (Exception e) {
            syncDataLogger.error("同步命令到入炉采样封装机数据库失败："+e.getMessage());
            return false;
        } finally {
            if (ps != null) {
                ps.close();
            }
        }
    }

    /**
     * 插入开元存查样柜的操作命令
     * @param
     * @return
     * @throws Exception
     */
    public boolean insertCMD2ZJky(Connection conn, JSONObject jo) throws Exception {
//        String sql = "insert into tb_preAction(SSName,Sample_ID,Priority,DoneState,OP_DEST,person_ID,Operator,I_Time) VALUES " +
//                "(?,?,?,?,?,?,?,'1',GETDATE())" ;
        String sql = "insert into tb_preAction(Sample_ID,Operate_code,person_ID,Priority,bolt_id,PersonName,DoneState) VALUES " +
                "(?,?,?,?,?,?,0)" ;//由于开元两个柜子号里边都填的是1，所以柜子号填死


        PreparedStatement ps = null;
        try {
            conn.setAutoCommit(false);//关闭自动提交
            ps = conn.prepareStatement(sql);
            ps.setString(1, jo.getString("PACK_CODE"));
            ps.setInt(2, jo.getInt("OPERATE_CODE"));
            ps.setString(3, jo.getString("OPERATOR"));
            ps.setInt(4, jo.getInt("PRIORITY"));
            ps.setInt(5, jo.getInt("CABINET_REC_ID"));
            ps.setString(6, jo.getString("OPERATOR"));

            //执行
            int k = ps.executeUpdate();

            syncDataLogger.info("同步存样柜操作命令成功");
            return true;
        } catch (Exception e) {
            syncDataLogger.error("同步存样柜操作命令失败："+e.getMessage());
            return false;
        } finally {
            if (ps != null) {
                ps.close();
            }
        }
    }



    /**
     * 接收到的http数据处理
     * @param data
     * @return
     * @throws Exception
     */
    public JSONObject dealHttpData(String data) throws Exception {
        CallableStatement cs = null;
        Connection conn = commonUtil.getConnection();
        JSONObject resJson = new JSONObject();

        if (conn == null) {
            syncDataLogger.error("dealHttpData数据库连接为空，请检查");
            resJson.put("resCode", "1");
            resJson.put("resMsg","dealHttpData数据库连接为空");
            return resJson;
        }

        int sep = data.indexOf("#");
        String procedure = data.substring(0, sep);
        String dataString = data.substring(sep+1);

        try {
            conn.setAutoCommit(false);//关闭自动提交
            cs = conn.prepareCall("{call "+procedure+"(?,?,?)}");
            cs.setString(1, dataString);//查出来的结果集的json对象

            cs.registerOutParameter(2, Types.VARCHAR);//输出
            cs.registerOutParameter(3, Types.VARCHAR);
            cs.execute();

            String resCode = cs.getString(2);
            String resMsg = cs.getString(3);

            resJson.put("resCode", resCode);
            resJson.put("resMsg", resMsg);

            if(!resCode.equals("0")) {
                syncDataLogger.error(procedure+"数据入库失败："+resMsg);
            }

            return resJson;
        } catch (Exception e) {
            syncDataLogger.error(procedure+"数据入库异常："+e.getMessage());
            resJson.put("resCode", "1");
            resJson.put("resMsg", procedure+"数据入库异常：" + e.getMessage());
            return resJson;
        } finally {
            commonUtil.closeResource(cs, conn);
        }
    }


    /**
     * 接收到的http数据处理
     * @param data
     * @return
     * @throws Exception
     */
    public String dealNHToolHttpData(String data) throws Exception {
        CallableStatement cs = null;
        Connection conn = commonUtil.getConnection();
        String responeStr = "";

        if (conn == null) {
            syncDataLogger.error("dealNHToolHttpData数据库连接为空，请检查");
            System.out.println("dealNHToolHttpData数据库连接为空，请检查");

        }

        try {
            conn.setAutoCommit(false);//关闭自动提交
            cs = conn.prepareCall("{call pkg_intf_4_nhtool.invoke_znrl_db(?,?)}");
            cs.setString(1, data);//查出来的结果集的json对象

            cs.registerOutParameter(2, Types.VARCHAR);//输出
            cs.execute();

            responeStr = cs.getString(2);

        } catch (Exception e) {
            syncDataLogger.error("dealNHToolHttpData异常："+e.getMessage());
            System.out.println("dealNHToolHttpData异常："+e.getMessage());
            return "";
        } finally {
            commonUtil.closeResource(cs, conn);
        }

        return responeStr;
    }



    /**
     * 获取轨道衡数据到管控（丰城）
     * @param
     * @return
     * @throws Exception
     */
    public List<TrainDataEntity> getGDHData4FC(String dbSource) throws Exception {
        StringBuffer sqlStrBuffer = new StringBuffer();
        Connection conn = null;
        ResultSet rs;
        PreparedStatement ps = null;
        List<TrainDataEntity> list = new ArrayList<>();
        String[] dbInfo = dbSource.split("#");

        //如果换成远程rmi方式调用数据库
        //String sDriverName = "org.objectweb.rmijdbc.Driver";
        //String url = "jdbc:rmi://192.200.200.70/jdbc:odbc:lab_dbs";

        String sDriverName = "com.hxtt.sql.access.AccessDriver";
        try {
            Class.forName(sDriverName);
            conn = DriverManager.getConnection(dbInfo[0], "", dbInfo[1]);
            if (conn == null) {
                syncDataLogger.error("获取缓存数据时连接数据库失败");
                return list;
            }

            //轨道衡数据
            sqlStrBuffer.append("select top 60 列车流水码,车序,车型,车号,载重,自重,总重,净重,过衡时间,速度 from SDat where 净重 > 2000 order by 列车流水码 desc");
            ps = conn.prepareStatement(sqlStrBuffer.toString());
            rs = ps.executeQuery();
            TrainDataEntity cd;

            while (rs != null && rs.next()) {
                cd = new TrainDataEntity();
                cd.setId(String.valueOf(rs.getInt("列车流水码")));
                cd.setCarOrder(String.valueOf(rs.getInt("车序")));
                cd.setCarType(rs.getString("车型"));
                cd.setCarNo(rs.getString("车号"));
                cd.setTickQty(String.valueOf(rs.getInt("载重")));
                cd.setPzQty(String.valueOf(rs.getInt("自重")));
                cd.setMzQty(String.valueOf(rs.getInt("总重")));
                cd.setNetQty(String.valueOf(rs.getInt("净重"))); // >0
                cd.setWeightTime(String.valueOf(rs.getString("过衡时间")));
                cd.setWeightSpeed(String.valueOf(rs.getInt("速度")));

                list.add(cd);
            }

            if (rs != null) {
                rs.close();
            }
        } catch (Exception e) {
            syncDataLogger.error("获取终端接口缓存数据失败：" + e.getMessage());
            throw e;
        } finally {
            commonUtil.closeResource(ps, conn);
        }
        return list;
    }



    /**
     * 丰城提交同步的轨道衡数据
     * @return
     * @throws Exception
     */
    public void saveGDHData4FC(String data, String ourDBSource) throws Exception {
        CallableStatement cs = null;
        Connection conn = commonUtil.getConnection(ourDBSource);
        String resCode = "";
        if (conn == null) {
            syncDataLogger.error("同步命令时回写命令状态获取数据库连接为空");
            return;
        }

        try {
            conn.setAutoCommit(false);//关闭自动提交
            cs = conn.prepareCall("{call PK_SYNC_2_ZNRL.sync_gdh_data(?,?,?)}");
            cs.setString(1, data);
            cs.registerOutParameter(2, Types.VARCHAR);
            cs.registerOutParameter(3, Types.VARCHAR);
            cs.execute();

            resCode = cs.getString(2);
            if (!"0".equals(resCode)) {
                syncDataLogger.warn("同步轨道衡数据失败：" + cs.getString(3));
                System.out.println("同步轨道衡数据失败：" + cs.getString(3));
           } 
        } catch (Exception e) {
            syncDataLogger.error("同步轨道衡数据异常："+e.getMessage());
        } finally {
            commonUtil.closeResource(cs, conn);
        }
    }

    //同步汽车信息到汽采上位机 - 大开
    public boolean syncCarInfo2CYJDK(Connection conn, JSONObject jo) throws Exception {
        String sql;

        String action = jo.getString("ACTION");
        PreparedStatement ps = null;

        try {
            if (action != null && action.equals("ADD")) {
                sql = "insert into CY_CarInfo_Tb " +
                        "(a.CarID, " + //1
                        " a.Car_TypeID, " +
                        " a.CarToW_length," +
                        " a.Car1_length," +
                        " a.Car1_width," + //5
                        " a.Car1ToN_length," +
                        " a.Car1NTF_length," +
                        " a.Car1L1TW_length," +
                        " a.Car1L2TL1_length," +
                        " a.Car1L3TL2_length," + //10
                        " a.Car1L4TL3_length," +
                        " a.Car1L5TL4_length," +
                        " a.Car1L6TL5_length)," +
                        "values " +
                        "(?,?,?,?,?,?,?,?,?,?,?,?,?)";

                int i = 1;
                ps = conn.prepareStatement(sql);
                ps.setString(i++, jo.getString("CAR_ID"));
                ps.setString(i++, jo.getString("CAR_TYP"));
                ps.setInt(i++, Integer.parseInt(jo.getString("CARTOW_LENGTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1_LENGTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1_WIDTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1TON_LENGTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1NTF_LENGTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1L1TW_LENGTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1L2TL1_LENGTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1L3TL2_LENGTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1L4TL3_LENGTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1L5TL4_LENGTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1L6TL5_LENGTH")));

            } else if (action != null && action.equals("MOD")) {
                sql = "update CY_CarInfo_Tb  " +
                        " set Car_TypeID = ?, " +
                        " CarToW_length = ?," +
                        " Car1_length = ?," +
                        " Car1_width = ?," + //5
                        " Car1ToN_length = ?," +
                        " Car1NTF_length = ?," +
                        " Car1L1TW_length = ?," +
                        " Car1L2TL1_length = ?," +
                        " Car1L3TL2_length = ?," + //10
                        " Car1L4TL3_length = ?," +
                        " Car1L5TL4_length = ?," +
                        " Car1L6TL5_length = ?"+
                        " where CarID = ?";

                int i = 1;
                ps = conn.prepareStatement(sql);
                ps.setString(i++, jo.getString("CAR_TYP"));
                ps.setInt(i++, Integer.parseInt(jo.getString("CARTOW_LENGTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1_LENGTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1_WIDTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1TON_LENGTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1NTF_LENGTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1L1TW_LENGTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1L2TL1_LENGTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1L3TL2_LENGTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1L4TL3_LENGTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1L5TL4_LENGTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1L6TL5_LENGTH")));
                ps.setString(i++, jo.getString("CAR_ID"));
            }

            conn.setAutoCommit(false);//关闭自动提交
            //执行insert
            ps.executeUpdate();

            syncDataLogger.info("同步汽车数据成功");
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            syncDataLogger.error("同步汽车数据失败："+e.getMessage());
            return false;
        } finally {
            if (ps != null) {
                ps.close();
            }
        }
    }

    /**
     * 汽车信息状态回写 --大开
     * @param id
     * @param status
     * @param msg
     * @param ourDBSource
     * @throws Exception
     */
    public void updateBackStatusDK(String id,String status,String msg, String ourDBSource) throws Exception{
        CallableStatement cs = null;
        Connection conn = commonUtil.getConnection(ourDBSource);
        if (conn == null) {
            syncDataLogger.error("同步命令时回写命令状态获取数据库连接为空");
            return;
        }

        try {
            conn.setAutoCommit(false);//关闭自动提交
            cs = conn.prepareCall("{call pkg_device.update_carInfo_status(?,?,?)}");
            cs.setString(1, id);
            cs.setString(2,status );
            //cs.setString(3, type);
            cs.setString(3, msg);
            cs.execute();
        } catch (Exception e) {
            syncDataLogger.error("同步设备命令回写发送状态异常："+e.getMessage());
        } finally {
            commonUtil.closeResource(cs, conn);
        }
    }

    /**
     * 汽车命令状态回写 --大开
     * @param id
     * @param status
     * @param msg
     * @param ourDBSource
     * @throws Exception
     */
    public void updateCmdStatusDK(String id,String status,String msg, String ourDBSource) throws Exception{
        CallableStatement cs = null;
        Connection conn = commonUtil.getConnection(ourDBSource);
        if (conn == null) {
            syncDataLogger.error("同步命令时回写命令状态获取数据库连接为空");
            return;
        }

        try {
            conn.setAutoCommit(false);//关闭自动提交
            cs = conn.prepareCall("{call pkg_device.update_cmd_status(?,?,?)}");
            cs.setString(1, id);
            cs.setString(2,status );
            //cs.setString(3, type);
            cs.setString(3, msg);
            cs.execute();
        } catch (Exception e) {
            syncDataLogger.error("同步设备命令回写发送状态异常："+e.getMessage());
        } finally {
            commonUtil.closeResource(cs, conn);
        }
    }



    /**
     * 同步汽车信息到汽采上位机 - 丰城
     * @param
     * @return
     * @throws Exception
     */
    public boolean syncCarInfo2CYJFC(Connection conn, JSONObject jo) throws Exception {
        String sql;

        String action = jo.getString("ACTION");
        PreparedStatement ps = null;

        try {
            if (action != null && action.equals("ADD")) {
                sql = "insert into CARINFO_TB a" +
                        "(a.ID, " +
                        " a.DataStatus, " + //1
                        " a.CarID, " + //1
                        " a.Car_TypeID, " +
                        " a.Car_TypeName, " +
                        " a.CarToW_length," +
                        " a.Car1_length," +
                        " a.Car1_width," + //5
                        " a.Car1ToN_length," +
                        " a.Car1NTF_length," +
                        " a.Car1L1TW_length," +
                        " a.Car1L2TL1_length," +
                        " a.Car1L3TL2_length," + //10
                        " a.Car1L4TL3_length," +
                        " a.Car1L5TL4_length," +
                        " a.Car1L6TL5_length) " +
                        "values " +
                        "(SEQ_carinfo_ID.Nextval,'0',?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

                int i = 1;
                ps = conn.prepareStatement(sql);
                ps.setString(i++, jo.getString("CAR_ID"));
                ps.setString(i++, jo.getString("CAR_TYP"));
                ps.setString(i++, jo.getString("CAR_TYPE_NAME"));
                ps.setInt(i++, Integer.parseInt(jo.getString("CARTOW_LENGTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1_LENGTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1_WIDTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1TON_LENGTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1NTF_LENGTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1L1TW_LENGTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1L2TL1_LENGTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1L3TL2_LENGTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1L4TL3_LENGTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1L5TL4_LENGTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1L6TL5_LENGTH")));

            } else if (action != null && action.equals("MOD")) {
                sql = "update CARINFO_TB  " +
                        " set Car_TypeID = ?, " +
                        " Car_TypeName = ?, " +
                        " CarToW_length = ?," +
                        " Car1_length = ?," +
                        " Car1_width = ?," + //5
                        " Car1ToN_length = ?," +
                        " Car1NTF_length = ?," +
                        " Car1L1TW_length = ?," +
                        " Car1L2TL1_length = ?," +
                        " Car1L3TL2_length = ?," + //10
                        " Car1L4TL3_length = ?," +
                        " Car1L5TL4_length = ?," +
                        " Car1L6TL5_length = ? " +
                        " where CarID = ?  and id > 1000000";

                int i = 1;
                ps = conn.prepareStatement(sql);
                ps.setString(i++, jo.getString("CAR_TYP"));
                ps.setString(i++, jo.getString("CAR_TYPE_NAME"));
                ps.setInt(i++, Integer.parseInt(jo.getString("CARTOW_LENGTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1_LENGTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1_WIDTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1TON_LENGTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1NTF_LENGTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1L1TW_LENGTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1L2TL1_LENGTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1L3TL2_LENGTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1L4TL3_LENGTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1L5TL4_LENGTH")));
                ps.setInt(i++, Integer.parseInt(jo.getString("CAR1L6TL5_LENGTH")));
                ps.setString(i++, jo.getString("CAR_ID"));
            }

            conn.setAutoCommit(false);//关闭自动提交
            //执行insert
            ps.executeUpdate();

            syncDataLogger.info("同步汽车数据成功");
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            syncDataLogger.error("同步汽车数据失败："+e.getMessage());
            return false;
        } finally {
            if (ps != null) {
                ps.close();
            }
        }
    }

    /**
     * 状态回写 --丰城
     * @param id
     * @param type
     * @param status
     * @param msg
     * @param ourDBSource
     * @throws Exception
     */
    public void updateBackStatusFC(String id,String type,String status,String msg, String ourDBSource) throws Exception{
        CallableStatement cs = null;
        Connection conn = commonUtil.getConnection(ourDBSource);
        if (conn == null) {
            syncDataLogger.error("同步命令时回写命令状态获取数据库连接为空");
            return;
        }

        try {
            conn.setAutoCommit(false);//关闭自动提交
            cs = conn.prepareCall("{call PK_SYNC_2_ZNRL.update_back_status(?,?,?,?)}");
            cs.setString(1, id);
            cs.setString(2,status );
            cs.setString(3, type);
            cs.setString(4, msg);
            cs.execute();
        } catch (Exception e) {
            syncDataLogger.error("同步设备命令回写发送状态异常："+e.getMessage());
        } finally {
            commonUtil.closeResource(cs, conn);
        }

    }


    /**
     * 插入命令到汽车采样机数据库-丰城
     * @param
     * @return
     * @throws Exception
     */
    public boolean insertCommand2CYJFC(Connection conn, JSONObject jo) throws Exception {
        String sql = "insert into CMD_TB(ID,machineCode,commandCode,RECORD_NO,carid,car_typeid,SampleNumber,SamNumber,SendCommandTime,DataStatus,PreCarNum,PreWeight) " +
                "values(SEQ_cmd_tb_ID.Nextval,?,?,?,?,?,?,?,sysdate,'0',?,?)";

        PreparedStatement ps = null;
        try {
            conn.setAutoCommit(false);//关闭自动提交
            ps = conn.prepareStatement(sql);
            ps.setString(1, jo.getString("MACHINE_CODE"));
            ps.setInt(2, Integer.parseInt(jo.getString("COMMAND_CODE")));
            ps.setInt(3, Integer.parseInt(jo.getString("RECORD_NO")));
            ps.setString(4, jo.getString("CARID"));
            ps.setString(5, jo.getString("CAR_TYPEID"));
            ps.setString(6, jo.getString("SAMPLENUMBER"));
            ps.setInt(7, Integer.parseInt(jo.getString("SAMNUMBER")));
            ps.setInt(8, Integer.parseInt(jo.getString("PRECARNUM")));
            ps.setInt(9, Integer.parseInt(jo.getString("PREWEIGHT")));
            //执行insert
            int i = ps.executeUpdate();

            syncDataLogger.info("同步命令到采样机数据库成功");
            return true;
        } catch (Exception e) {
            syncDataLogger.error("同步命令到采样机数据库失败："+e.getMessage());
            return false;
        } finally {
            if (ps != null) {
                ps.close();
            }
        }
    }

    /**
     * 插入命令到入厂皮带采样机数据库-丰城
     * @param
     * @return
     * @throws Exception
     */
    public boolean insertCommand2PCYJFC(Connection conn, JSONObject jo) throws Exception {

        String sql = "INSERT INTO CY_Cmd_Tb (CommandCode,MachineCode,SendCommandTime,SampleID,DataStatus)  "+
                "VALUES(?,?,getdate(),?,?)";
        PreparedStatement ps = null;


        try {
            conn.setAutoCommit(false);//关闭自动提交
            ps = conn.prepareStatement(sql);
            ps.setInt(1, Integer.parseInt(jo.getString("COMMAND_CODE")));
            ps.setString(2, jo.getString("MACHINE_CODE"));
           // ps.setString(3, jo.getString("SEND_COMMAND_TIME"));
            ps.setString(3, jo.getString("SAMPLE_CODE"));
            ps.setInt(4, Integer.parseInt(jo.getString("COMMAND_STATUS")));
            //执行insert
            int i = ps.executeUpdate();
            //启动需要填写参数
            String cmdCode = jo.getString("COMMAND_CODE");
            if (cmdCode != null && (cmdCode.equals("1") )) {//启动发送参数
                sql = "INSERT INTO  CY_Interface_Tb (SampleID,BatchNO,TrainNumber,Weight,Type,Water,SampleType,BarrelNumber,DataStatus) "+
                        "VALUES (?,?,?,?,?,?,?,1,?)  ";

                ps = conn.prepareStatement(sql);
                ps.setString(1, jo.getString("SAMPLE_CODE"));
                ps.setString(2, jo.getString("TRAIN_BATCH_NO"));
                ps.setInt(3, Integer.parseInt(jo.getString("CAR_NUM")));
                ps.setInt(4, Integer.parseInt(jo.getString("ALL_NET_QTY")));
                ps.setInt(5, Integer.parseInt(jo.getString("COAL_TYPE")));
                ps.setInt(6, Integer.parseInt(jo.getString("COAL_WATER")));
                ps.setInt(7, Integer.parseInt(jo.getString("SAMPLE_TYP")));
                ps.setInt(8, Integer.parseInt(jo.getString("INTERFACE_STATUS")));
                int k = ps.executeUpdate();
            }

            syncDataLogger.info("同步命令到入厂皮带采样机数据库成功");
            return true;
        } catch (Exception e) {
            syncDataLogger.error("同步命令到入厂皮带采样机数据库失败："+e.getMessage());
            return false;
        } finally {
            if (ps != null) {
                ps.close();
            }
        }
    }
    /**
     * 插入命令接口信息到入厂皮带采样机数据库-丰城
     * @param
     * @return
     * @throws Exception
     */
    public boolean insertCommand2PCYJINTF_FC(Connection conn, JSONObject jo) throws Exception {

        String sql = "INSERT INTO  CY_Interface_Tb (SampleID,BatchNO,TrainNumber,Weight,Type,Water,SampleType,BarrelNumber,DataStatus) "+
                "VALUES (?,?,?,?,?,?,?,1,0)  ";
        PreparedStatement ps = null;
        try {
            conn.setAutoCommit(false);//关闭自动提交
            ps = conn.prepareStatement(sql);
            ps.setString(1, jo.getString("SAMPLE_CODE"));
            ps.setString(2, jo.getString("TRAIN_BATCH_NO"));
            ps.setInt(3, Integer.parseInt(jo.getString("CAR_NUM")));
            ps.setInt(4, Integer.parseInt(jo.getString("ALL_NET_QTY")));
            ps.setInt(5, Integer.parseInt(jo.getString("COAL_TYPE")));
            ps.setInt(6, Integer.parseInt(jo.getString("COAL_WATER")));
            ps.setInt(7, Integer.parseInt(jo.getString("SAMPLE_TYP")));

            //执行insert
            int i = ps.executeUpdate();

            syncDataLogger.info("同步命令到入厂皮带采样机数据库成功");
            return true;
        } catch (Exception e) {
            syncDataLogger.error("同步命令到入厂皮带采样机数据库失败："+e.getMessage());
            return false;
        } finally {
            if (ps != null) {
                ps.close();
            }
        }
    }

    /**
     * 插入命令到制样机数据库-丰城
     * @param
     * @return
     * @throws Exception
     */
    public boolean insertCommand2ZYJFC(Connection conn, JSONObject jo) throws Exception {
        String sql = "insert into zy_cmd_tb(machineCode, CommandCode,SampleId,SendCommandTime, dataStatus) " +
                "values(?,?,?,GETDATE(),?)";

        PreparedStatement ps = null;
        try {
            conn.setAutoCommit(false);//关闭自动提交
            ps = conn.prepareStatement(sql);
            ps.setString(1, jo.getString("MACHINE_CODE"));
            ps.setInt(2, Integer.parseInt(jo.getString("COMMAND_CODE")));
            ps.setString(3, jo.getString("SAMPLE_CODE"));
            ps.setInt(4, Integer.parseInt(jo.getString("COMMAND_STATUS")));
            //执行insert
            int i = ps.executeUpdate();
            //启动需要填写参数
            String cmdCode = jo.getString("COMMAND_CODE");
            if (cmdCode != null && (cmdCode.equals("1") || cmdCode.equals("4"))) {//启动和开启投料罩，都发送参数
                sql = "insert into zy_interface_tb(SampleId,Type,Size,Water,barrelNumber,DataStatus) " +
                        "values(?,?,?,?,?,?)";

                ps = conn.prepareStatement(sql);
                ps.setString(1, jo.getString("SAMPLE_CODE"));
                ps.setInt(2, Integer.parseInt(jo.getString("COAL_TYPE")));
                ps.setInt(3, Integer.parseInt(jo.getString("SIZE")));
                ps.setInt(4, Integer.parseInt(jo.getString("WATER_ZYJ")));
                ps.setInt(5, Integer.parseInt(jo.getString("BARREL_NUMBER")));
                ps.setInt(6, Integer.parseInt(jo.getString("INTERFACE_STATUS")));
                //ps.setInt(5, Integer.parseInt(jo.getString("BARREL_NUMBER")));

                int k = ps.executeUpdate();
            }

            syncDataLogger.info("同步命令到制样机数据库成功");
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            syncDataLogger.error("同步命令到制样机数据库失败："+e.getMessage());
            return false;
        } finally {
            if (ps != null) {
                ps.close();
            }
        }
    }


    /**
     * 修改积硕存查样柜的工作参数
     * @param
     * @return
     * @throws Exception
     */
    public boolean updateWorkParam2JesooFC(Connection conn, JSONObject jo) throws Exception {
        String sql = "update WORKPARA set [01MODE] = ?,[03MODE] = ?,[04MODE] = ?,[05MODE] = ?," +
                "[01Cycle] = ?,[03Cycle] = ?,[04Cycle] = ?,[05Cycle] = ?,"+
                "CABNUM = ?,CELLNUM = ?" ;
        int i = 1;
        PreparedStatement ps = null;
        try {
            conn.setAutoCommit(false);//关闭自动提交
            ps = conn.prepareStatement(sql);
            ps.setInt(i++, jo.getInt("MODE_6"));
            ps.setInt(i++, jo.getInt("MODE_3"));
            ps.setInt(i++, jo.getInt("MODE_21"));
            ps.setInt(i++, jo.getInt("MODE_22"));
            ps.setInt(i++, jo.getInt("CYCLE_6"));
            ps.setInt(i++, jo.getInt("CYCLE_3"));
            ps.setInt(i++, jo.getInt("CYCLE_21"));
            ps.setInt(i++, jo.getInt("CYCLE_22"));
            ps.setInt(i++, jo.getInt("CABNUM"));
            ps.setInt(i++, jo.getInt("CELLNUM"));

            //执行
            int k = ps.executeUpdate();

            syncDataLogger.info("同步存样柜工作参数成功");
            return true;
        } catch (Exception e) {
            syncDataLogger.error("同步存样柜工作参数失败："+e.getMessage());
            return false;
        } finally {
            if (ps != null) {
                ps.close();
            }
        }
    }

    /**
     * 插入积硕存查样柜的操作命令
     * @param
     * @return
     * @throws Exception
     */
    public boolean insertCMD2JesooFC(Connection conn, JSONObject jo) throws Exception {
        String sql = "insert into OPDOC(SampleId,OpType,OpDest,WWName,GGName,CCName,Operator,OpAUDIT,CreateTime) VALUES " +
                "(?,?,?,?,?,?,?,'1',GETDATE())" ;

        int i = 1;
        PreparedStatement ps = null;
        try {
            conn.setAutoCommit(false);//关闭自动提交
            ps = conn.prepareStatement(sql);
            ps.setString(i++, jo.getString("PACK_CODE"));
            ps.setInt(i++, jo.getInt("OP_TYPE"));
            ps.setInt(i++, jo.getInt("OP_DEST"));
            ps.setString(i++, jo.getString("WW"));
            ps.setString(i++, jo.getString("GG"));
            ps.setString(i++, jo.getString("CC"));
            ps.setString(i++, jo.getString("OPERATOR"));

            //执行
            int k = ps.executeUpdate();

            syncDataLogger.info("同步存样柜操作命令成功");
            return true;
        } catch (Exception e) {
            syncDataLogger.error("同步存样柜操作命令失败："+e.getMessage());
            return false;
        } finally {
            if (ps != null) {
                ps.close();
            }
        }
    }


    /**
     * 获取需要发测点的数据--丰城，批量获取
     * @return
     * @throws Exception
     */
    public String qryDataStrForSendFC() throws Exception {
        StringBuffer sqlStrBuffer = new StringBuffer();
        Connection conn = null;
        String returnStr = "";
        ResultSet rs;
        PreparedStatement ps = null;
        try {
            conn = commonUtil.getConnection();
            //获取日志ID主键
            sqlStrBuffer.append("SELECT PK_GET_DATA_FUNCTIONS.get_send_info() RESSTRING FROM DUAL");
            ps = conn.prepareStatement(sqlStrBuffer.toString());
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                returnStr = rs.getString("RESSTRING");
                rs.close();
            }
        } catch (Exception e) {
            infoPointLogger.error("通用查询管控自发测点数据异常："+e.getMessage());
            throw e;
        } finally {
            commonUtil.closeResource(ps, conn);
        }
        return returnStr;
    }
}