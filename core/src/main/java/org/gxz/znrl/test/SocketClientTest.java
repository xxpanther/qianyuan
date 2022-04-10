package org.gxz.znrl.test;

import java.io.*;
import java.net.Socket;

/**
 * Created by xieyt on 2016-09-07.
 */
public class SocketClientTest {
    private static final String HOST = "192.168.30.11";
    private static final int PORT = 2017;

    public static void main(String[] args) {

        Socket socket = null;
        DataOutputStream os = null;
        int loopCnt = 0;
        try {
            socket = new Socket(HOST, PORT);
            //给服务端发送请求
            os = new DataOutputStream(socket.getOutputStream());
            OutputStream out = socket.getOutputStream();
            PrintWriter pw = new PrintWriter(out);
            //三通
            String requestJSON = "{\"baseInfo\":{\"srcCode\":\"60\",\"infoType\":\"6001\",\"reqTime\":\"20161026150953\",\"reserve\":\"\"},\"param\":[{\"TrippleNo\":\"0A\",\"Position\":\"0\"},{\"TrippleNo\":\"0B\",\"Position\":\"0\"}]}";
            //皮带
            String requestJSON1 = "{\"baseInfo\":{\"srcCode\":\"60\",\"infoType\":\"6002\",\"reqTime\":\"20161026150953\",\"reserve\":\"\"},\"param\":[{\"BeltNo\":\"1A\",\"Status\":\"1\"},{\"BeltNo\":\"1B\",\"Status\":\"1\"}]}";
            //碎煤机
            String requestJSON2 = "{\"baseInfo\":{\"srcCode\":\"60\",\"infoType\":\"6003\",\"reqTime\":\"20161026150953\",\"reserve\":\"\"},\"param\":[{\"CrushNo\":\"001\",\"Status\":\"1\"},{\"CrushNo\":\"002\",\"Status\":\"1\"}]}";
            //犁煤器
            String requestJSON3 = "{\"baseInfo\":{\"srcCode\":\"60\",\"infoType\":\"6004\",\"reqTime\":\"20161026150953\",\"reserve\":\"\"},\"param\":[{\"UpmineNo\":\"11A001\",\"Status\":\"1\"},{\"UpmineNo\":\"05A003\",\"Status\":\"1\"}]}";
            //斗轮机
            String requestJSON4 = "{\"baseInfo\":{\"srcCode\":\"60\",\"infoType\":\"6005\",\"reqTime\":\"20161026150953\",\"reserve\":\"\"},\"param\":[{\"WheelNo\":\"001\",\"Status\":\"1\"},{\"WheelNo\":\"002\",\"Status\":\"1\"}]}";
            //筒仓
            String requestJSON5 = "{\"baseInfo\":{\"srcCode\":\"60\",\"infoType\":\"6006\",\"reqTime\":\"20161026150953\",\"reserve\":\"\"},\"param\":[{\"BarrelNo\":\"5B011\",\"Height\":\"7.66\"},{\"BarrelNo\":\"5A001\",\"Height\":\"5.12\"}]}";
            //皮带秤
            String requestJSON6 = "{\"baseInfo\":{\"srcCode\":\"50\",\"infoType\":\"5001\",\"reqTime\":\"20161026150953\",\"reserve\":\"\"},\"param\":[{\"BalanceNo\":\"RCA01\",\"RealValue\":\"796.04\",\"SumValue\":\"145060.23\",\"GroupValue\":\"1102.79\"},{\"BalanceNo\":\"RLB02\",\"RealValue\":\"796.04\",\"SumValue\":\"145060.23\",\"GroupValue\":\"1102.79\"}]}";
            //皮带采样机
            String requestJSON7 = "{\"baseInfo\":{\"srcCode\":\"10\",\"infoType\":\"1001\",\"reqTime\":\"20161026150953\",\"reserve\":\"\"},\"param\":[{\"device\":\"PC001\",\"value\":\"34.04\"},{\"device\":\"PC002\",\"value\":\"75.77\"},{\"device\":\"PC003\",\"value\":\"796.04\"}]}";
            //设置当前翻车的火车
            String requestJSON8 = "{\"baseInfo\":{\"srcCode\":\"120\",\"infoType\":\"12001\",\"reqTime\":\"20161026150953\",\"reserve\":\"\"},\"param\":[{\"RailNo\":\"2\",\"RailID\":\"4623084\",\"RailType\":\"C64K\"}]}";
            //翻车动作，>150°发送采样命令
            String requestJSON9 = "{\"baseInfo\":{\"srcCode\":\"40\",\"infoType\":\"4002\",\"reqTime\":\"20161026150953\",\"reserve\":\"\"},\"param\":[{\"DumperNo\":\"2\",\"Angle\":\"150.02\"},{\"DumperNo\":\"2\",\"Angle\":\"79.00\"}]}";


            while(loopCnt < 1){
//                String requestJSON = "{abc}\nqqqqqqqqqqqqq\nwwwwwwwwww#FF#\n{def}\n#FF#";
                pw.println(requestJSON9);
                pw.flush();
//                try {
//                    Thread.sleep(1*1000);
//                } catch (InterruptedException e) {
//                    e.printStackTrace();
//                    break;
//                }
                loopCnt++;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }finally{
            try {
                if(os != null){
                    os.close();
                }

                if(socket != null){
                    socket.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }

        }
    }
}
