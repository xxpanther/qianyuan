package org.gxz.znrl.test;

import oracle.jdbc.OracleTypes;
import oracle.sql.CLOB;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import org.gxz.znrl.util.CommonUtil;

import java.io.InputStream;
import java.io.Reader;
import java.io.UnsupportedEncodingException;
import java.sql.*;
import java.util.List;

/**
 * 客户端测试类.
 */
public class DBTest {
    public static void main(String[] args) {
        DBTest dt = new DBTest();
        //dt.testDB();
        //dt.testxml();
        //dt.testSqlserverConn();

        try {
//            dt.testClobQuery();
//            dt.testRmiJdbcAccessConn()
            dt.testAccessConn();
//            dt.testSQLITEConn();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void testxml() {
        SAXReader saxReader = new SAXReader();
        Document document = null;
        try {
            System.out.println("absolute path:" + DBTest.class.getResource("/resource/sqlConfig"));
            //TODO 循环获取该目录下的所有*.xml文件并加

            InputStream is = DBTest.class.getResourceAsStream("/resource/sqlConfig/sql_CYJ.xml");
            document = saxReader.read(is);
        } catch (DocumentException e) {
            e.printStackTrace();
        }

        List<Element> elements = document.selectNodes("/sqlConfig/sql");
        for (Element e : elements) {
            String id = e.attributeValue("id");
            System.out.println("id:" + id);
            System.out.println("cdata text:" + e.getText());
        }
    }

    public void testSqlserverConn() {
        Connection conn = null;
        String sDriverName = "com.microsoft.sqlserver.jdbc.SQLServerDriver";
        String sDBUrl = "jdbc:sqlserver://192.168.1.101;databaseName=chehao";

        try {
            Class.forName(sDriverName);
            conn = DriverManager.getConnection(sDBUrl, "sa", "administrator");

            if (conn == null) {
                System.out.println("===connection is not not not success===");
            } else {
                System.out.println("***connection is successfully***");
            }

            ResultSet rs = null;
            PreparedStatement ps = null;
            ps = conn.prepareStatement("select a.user_id,a.user_name, a.user_passwd from test_user a");
            rs = ps.executeQuery();
            while (rs != null && rs.next()) {
                System.out.println("aaaaaaaa:" + rs.getString("user_id"));
                System.out.println("bbbbbbbb:" + rs.getString("user_name"));
                System.out.println("cccccccc:" + rs.getString("user_passwd"));
            }
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }


    public void testSQLITEConn() {
        Connection conn = null;
        String sDriverName = "org.sqlite.JDBC";
        String url = "jdbc:sqlite:D:/cache.db";
        try {
            Class.forName(sDriverName);

            conn = DriverManager.getConnection(url, "", "");

            if (conn == null) {
                System.out.println("===connection is not not not success===");
            } else {
                System.out.println("***connection is successfully***");
            }

            ResultSet rs = null;
            PreparedStatement ps = null;
            ps = conn.prepareStatement("select * from INTF_CACHE");
            rs = ps.executeQuery();
            while (rs != null && rs.next()) {
                System.out.println("aaaaaaaa:" + rs.getString("ID"));
                System.out.println("bbbbbbbb:" + rs.getString("CACHE_TEXT"));
            }
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }



    public void testAccessConn() {
        Connection conn = null;
        String sDriverName = "com.hxtt.sql.access.AccessDriver";
        String url = "jdbc:Access:///D://MainDB.mdb";
        try {
            Class.forName(sDriverName);

            conn = DriverManager.getConnection(url, "", "hhgs49314zzl");

            if (conn == null) {
                System.out.println("===connection is not not not success===");
            } else {
                System.out.println("***connection is successfully***");
            }

            ResultSet rs = null;
            PreparedStatement ps = null;
            ps = conn.prepareStatement("select top 70 列车流水码,车序,车型,车号,载重,自重,总重,净重,过衡时间,速度 from SDat order by 列车流水码 desc");
            rs = ps.executeQuery();
            while (rs != null && rs.next()) {
                System.out.println("aaaaaaaa:" + rs.getInt("列车流水码"));
                System.out.println("bbbbbbbb:" + rs.getString("车型"));
            }
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void testAccessConn1() {
        Connection conn = null;
        String sDriverName = "sun.jdbc.odbc.JdbcOdbcDriver";
        String url = "jdbc:odbc:driver={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=Z://Database1.mdb";

        try {
            Class.forName(sDriverName).newInstance();

            conn = DriverManager.getConnection(url, "", "");

            if (conn == null) {
                System.out.println("===connection is not not not success===");
            } else {
                System.out.println("***connection is successfully***");
            }

            ResultSet rs = null;
            PreparedStatement ps = null;
            ps = conn.prepareStatement("select * from test_user");
            rs = ps.executeQuery();
            while (rs != null && rs.next()) {
                System.out.println("aaaaaaaa:" + rs.getString("user_id"));
                System.out.println("bbbbbbbb:" + new String(rs.getBytes("user_name"), "gbk"));
                System.out.println("cccccccc:" + rs.getString("user_passwd"));
            }
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        } catch (InstantiationException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }


    public static void testDB() {
        ResultSet rs = null;
        PreparedStatement ps = null;
        Connection conn = null;
        CommonUtil commonUtil = new CommonUtil();
        try {
            conn = commonUtil.getConnection("jdbc");

            ps = conn.prepareStatement("select a.user_id,a.user_name, a.user_passwd from test_user a");
            rs = ps.executeQuery();
            ResultSetMetaData data = rs.getMetaData();

            for (int i = 1; i <= data.getColumnCount(); i++) {
                // 获得所有列的数目及实际列数
                int columnCount = data.getColumnCount();
                System.out.println("kkkkkkkkkkkkkkkkkkkkkk:" + columnCount);
                // 获得指定列的列名
                String columnName = data.getColumnName(i);
                System.out.println("aaaaaaaaaaaaaaaaa:" + columnName);
            }

            while (rs != null && rs.next()) {
                System.out.println("bbbbbbbbbbbbbbbbbbbbbbb:" + rs.getString("user_name"));
            }

            ///////////////另外一个数据源///////////////////////////////////////////////

            conn = commonUtil.getConnection("cyjDB");

            ps = conn.prepareStatement("select a.user_id,a.user_name, a.user_passwd from test_user a");
            rs = ps.executeQuery();
            ResultSetMetaData data1 = rs.getMetaData();

            for (int i = 1; i <= data1.getColumnCount(); i++) {
                // 获得所有列的数目及实际列数
                int columnCount = data1.getColumnCount();
                System.out.println("rrrrrrrrrrrrrrrrrr:" + columnCount);
                // 获得指定列的列名
                String columnName = data1.getColumnName(i);
                System.out.println("tttttttttttttttttttttttttt:" + columnName);
            }

            while (rs != null && rs.next()) {
                System.out.println("yyyyyyyyyyyyyyyyyyyyy:" + rs.getString("user_name"));
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (rs != null) {
                try {
                    rs.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }


    public void testRmiJdbcAccessConn() throws Exception {
        Connection conn = null;
        String sDriverName = "org.objectweb.rmijdbc.Driver";
        //String sDriverName = "sun.jdbc.odbc.JdbcOdbcDriver";

        //String url =  "jdbc:rmi://192.168.0.58/jdbc:odbc:laoxietest"; //表：tb_user/"dell", "laoxie"
        //String url =  "jdbc:rmi://192.168.0.52/jdbc:odbc:sftestdb";  //表：sdtga300
        //String url =  "jdbc:rmi://192.168.0.54/jdbc:odbc:gfytestdb";  //表：testresult 密码CSKY
        //String url = "jdbc:rmi://192.168.20.132/jdbc:odbc:sqlite3DB";  //表：testresult 密码CSKY
        String url = "jdbc:rmi://192.200.200.70/jdbc:odbc:lab_dbs";

        ResultSet rs = null;
        PreparedStatement ps = null;
        try {
            Class.forName(sDriverName).newInstance();

            conn = DriverManager.getConnection(url, "", "");

            if (conn == null) {
                System.out.println("===connection is not not not success===");
            } else {
                System.out.println("***connection is successfully***");
            }


            //ps = conn.prepareStatement("select * from tb_user");
            ps = conn.prepareStatement("select id, name from result");
            rs = ps.executeQuery();
            ResultSetMetaData rsm = rs.getMetaData();
            System.out.println("########################"+rsm.getColumnCount()+"###################");
            while (rs != null && rs.next()) {
                for (int i = 1; i <= rsm.getColumnCount(); i++) {
                    System.out.print(rs.getString(i) + " | ");
                }
                System.out.println("\n");
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (rs != null) {
                rs.close();
            }

            if (ps != null) {
                ps.close();
            }

            if (conn != null) {
                conn.close();
            }
        }
    }


    public void testClobQuery() {
        CallableStatement cs = null;
        Connection conn = null;
        String returnStr = "";
        CLOB clob = null;

        String sDriverName = "oracle.jdbc.driver.OracleDriver";
        String url = "jdbc:oracle:thin:@10.46.6.220:1521:orcl";
        try {
            Class.forName(sDriverName);

            conn = DriverManager.getConnection(url, "znrl_app", "znrl_app");
            if (conn == null) {
                System.out.println("conn is nulllllllllllllllllllllllllllllllllllllll");
            }

            conn.setAutoCommit(false);//关闭自动提交
            //cs = conn.prepareCall("{call pk_yg_report.Get_30702_xml(?,?,?,?)}");
            cs = conn.prepareCall("{call pk_yg_report_xieyt.get_report_msg(?,?)}");

            cs.setString(1, "7001");
            cs.registerOutParameter(2, oracle.jdbc.OracleTypes.CLOB);


            cs.execute();

            clob = (CLOB) cs.getClob(2);

            StringBuffer sb = new StringBuffer();
            if (clob != null) {
                Reader clobStream = clob.getCharacterStream();
                char[] cBuff = new char[Integer.parseInt(String.valueOf(clob.length()))];
                int i = 0;
                while ((i = clobStream.read(cBuff)) != -1) {
                    sb.append(cBuff, 0, i);
                }
                clobStream.close();
            }
            returnStr = sb.toString();
            System.out.println("returnStr::::::::: " + returnStr);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (clob != null) {
                    clob.freeTemporary();
                }

                if (cs != null) {
                    cs.close();
                }

                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException e2) {
            }

        }
    }

    public void testDBPool() {
        CallableStatement cs = null;
        Connection conn = null;
        String returnStr = "";
        CLOB clob = null;

        String sDriverName = "oracle.jdbc.driver.OracleDriver";
        String url = "jdbc:oracle:thin:@192.168.30.11:1521:orcl";
        try {
            Class.forName(sDriverName);

            conn = DriverManager.getConnection(url, "znrl_app_new", "znrl_app_new");
            if (conn == null) {
                System.out.println("conn is nulllllllllllllllllllllllllllllllllllllll");
            }

            conn.setAutoCommit(false);//关闭自动提交
            //cs = conn.prepareCall("{call pk_yg_report.Get_30702_xml(?,?,?,?)}");
            cs = conn.prepareCall("{call pk_yg_report_xieyt.get_report_msg(?,?)}");

            cs.setString(1, "7001");
            cs.registerOutParameter(2, oracle.jdbc.OracleTypes.CLOB);


            cs.execute();

            clob = (CLOB) cs.getClob(2);

            StringBuffer sb = new StringBuffer();
            if (clob != null) {
                Reader clobStream = clob.getCharacterStream();
                char[] cBuff = new char[Integer.parseInt(String.valueOf(clob.length()))];
                int i = 0;
                while ((i = clobStream.read(cBuff)) != -1) {
                    sb.append(cBuff, 0, i);
                }
                clobStream.close();
            }
            returnStr = sb.toString();
            System.out.println("returnStr::::::::: " + returnStr);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (clob != null) {
                    clob.freeTemporary();
                }

                if (cs != null) {
                    cs.close();
                }

                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException e2) {
            }

        }
    }

}
