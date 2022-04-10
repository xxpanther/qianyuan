package org.gxz.znrl.test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;

public class ZnrlHttpClient {

//	云
//	private static String ip = "112.74.96.112";

//	本地
	private static String ip = "localhost";

	public static void main1(String[] args){
		ZnrlHttpClient o = new ZnrlHttpClient();
		
		try {
			for(int i=0;i<1;i++){

//				String testString = o.post("http://"+ip+":8080/znrlWS/znrlHttpService","{\"base\":{\"sysId\" : \"10\",\"userId\" : \"100000013324\", \"service\" : \"qryUser\", \"signature\" : \"e93b86b37efb64d424a97ce5f1cbf11b\", \"randomNum\" : \"13579046\", \"timestamp\" : \"1431067080349\" ,\"bizId\" : \"\"}, \"param\":{\"flowNode\" : \"CQ\",\"carId\" : \"苏A0101T\" }}");
//				String testString = o.post("http://"+ip+":8080/znrlWS/znrlHttpService","{\"base\":{\"sysId\" : \"10\",\"userId\" : \"1\", \"service\" : \"qryDeviceErrInfo\", \"signature\" : \"e93b86b37efb64d424a97ce5f1cbf11b\", \"randomNum\" : \"13579046\", \"timestamp\" : \"1431067080349\" ,\"bizId\" : \"\"}, \"param\":{\"machineCode\" : \"\",\"dealStatus\" : \"1\",\"startDate\":\"20150813\",\"endDate\":\"20150905\" }}");
//				String testString = o.post("http://"+ip+":8080/znrlWS/znrlHttpService","{\"base\":{\"sysId\" : \"10\",\"userId\" : \"100000013324\", \"service\" : \"qryCoalKeyIndicate\", \"signature\" : \"e93b86b37efb64d424a97ce5f1cbf11b\", \"randomNum\" : \"13579046\", \"timestamp\" : \"1431067080349\" ,\"bizId\" : \"\"}, \"param\":{\"date\":\"20150508\" }}");
//				String testString = o.post("http://"+ip+":8080/znrlWS/znrlHttpService","{\"base\":{\"sysId\" : \"10\",\"userId\" : \"100000013324\", \"service\" : \"login\", \"signature\" : \"e93b86b37efb64d424a97ce5f1cbf11b\", \"randomNum\" : \"13579046\", \"timestamp\" : \"1431067080349\" ,\"bizId\" : \"\"}, \"param\":{\"loginAcct\":\"admin\",\"loginPwd\":\"123456\"}}");
//				String testString = o.post("http://"+ip+":8080/znrlWS/znrlHttpService","{\"base\":{\"sysId\" : \"10\",\"userId\" : \"100000013324\", \"service\" : \"login\", \"signature\" : \"9a1e20b805ca6d4cb0d7c9189ec2f135\", \"randomNum\" : \"05WrH4Qx\", \"timestamp\" : \"1436929587400\" ,\"bizId\" : \"\"}, \"param\":{\"loginAcct\":\"admin\",\"loginPwd\":\"123456\"}}");
//				String testString = o.post("http://"+ip+":8080/znrlWS/znrlHttpService","{\"base\":{\"sysId\" : \"10\",\"userId\" : \"100000013324\", \"service\" : \"qrySampleInfo\", \"signature\" : \"e93b86b37efb64d424a97ce5f1cbf11b\", \"randomNum\" : \"13579046\", \"timestamp\" : \"1431067080349\" ,\"bizId\" : \"\"}, \"param\":{\"date\":\"20150729\" }}");
//				String testString = o.post("http://"+ip+":8080/znrlWS/znrlHttpService","{\"base\":{\"sysId\" : \"10\",\"userId\" : \"100000013324\", \"service\" : \"qryMakeSampleInfo\", \"signature\" : \"e93b86b37efb64d424a97ce5f1cbf11b\", \"randomNum\" : \"13579046\", \"timestamp\" : \"1431067080349\" ,\"bizId\" : \"\"}, \"param\":{\"date\":\"20150729\" }}");
//				String testString = o.post("http://"+ip+":8080/znrlWS/znrlHttpService","{\"base\":{\"sysId\" : \"10\",\"userId\" : \"100000013324\", \"service\" : \"qryRealInfo\", \"signature\" : \"e93b86b37efb64d424a97ce5f1cbf11b\", \"randomNum\" : \"13579046\", \"timestamp\" : \"1431067080349\" ,\"bizId\" : \"\"}, \"param\":{\"date\":\"20150508\",\"transType\":\"H\" }}");
//				String testString = o.post("http://"+ip+":8080/znrlWS/znrlHttpService","{\"base\":{\"sysId\" : \"10\",\"userId\" : \"100000013324\", \"service\" : \"qryEntryPowerstationList\", \"signature\" : \"e93b86b37efb64d424a97ce5f1cbf11b\", \"randomNum\" : \"13579046\", \"timestamp\" : \"1431067080349\" ,\"bizId\" : \"\"}, \"param\":{\"date\":\"20150508\",\"transType\":\"H\" }}");
//                String testString = o.post("http://"+ip+":8080/znrlWS/znrlHttpService","{\"param\":{\"transType\":\"H\",\"date\":\"20150508\"},\"base\":{\"randomNum\":\"0a22f235\",\"sysId\":\"10\",\"userId\":\"\",\"signature\":\"7d563310626510facd99325076afae1c\",\"bizId\":\"\",\"service\":\"qryRealInfo\",\"timestamp\":\"1438048423730\"}}");
//				String testString = o.post("http://"+ip+":8080/znrlWS/znrlHttpService","{\"base\":{\"sysId\" : \"10\",\"userId\" : \"100000013324\", \"service\" : \"qryStoreSampleInfo\", \"signature\" : \"e93b86b37efb64d424a97ce5f1cbf11b\", \"randomNum\" : \"13579046\", \"timestamp\" : \"1431067080349\" ,\"bizId\" : \"\"}, \"param\":{}}");
//				String testString = o.post("http://"+ip+":8080/znrlWS/znrlHttpService","{\"base\":{\"sysId\" : \"10\",\"userId\" : \"100000013324\", \"service\" : \"qryCoalStoreInfo\", \"signature\" : \"e93b86b37efb64d424a97ce5f1cbf11b\", \"randomNum\" : \"13579046\", \"timestamp\" : \"1431067080349\" ,\"bizId\" : \"\"}, \"param\":{}}");
//				String testString = o.post("http://"+ip+":8080/znrlWS/znrlHttpService","{\"base\":{\"sysId\" : \"10\",\"userId\" : \"100000013324\", \"service\" : \"qryCoalBunkerInfo\", \"signature\" : \"e93b86b37efb64d424a97ce5f1cbf11b\", \"randomNum\" : \"13579046\", \"timestamp\" : \"1431067080349\" ,\"bizId\" : \"\"}, \"param\":{}}");
//				String testString = o.post("http://"+ip+":8080/znrlWS/znrlHttpService","{\"base\":{\"sysId\" : \"10\",\"userId\" : \"100000013324\", \"service\" : \"qryLaboratoryInfo\", \"signature\" : \"e93b86b37efb64d424a97ce5f1cbf11b\", \"randomNum\" : \"13579046\", \"timestamp\" : \"1431067080349\" ,\"bizId\" : \"\"}, \"param\":{}}");
//				String testString = o.post("http://"+ip+":8080/znrlWS/znrlHttpService","{\"base\":{\"sysId\" : \"10\",\"userId\" : \"100000013324\", \"service\" : \"qryReduceTonList\", \"signature\" : \"e93b86b37efb64d424a97ce5f1cbf11b\", \"randomNum\" : \"13579046\", \"timestamp\" : \"1431067080349\" ,\"bizId\" : \"\"}, \"param\":{\"beginRowIndex\":\"1\",\"endRowIndex\":\"30\" }}");
//				String testString = o.post("http://"+ip+":8080/znrlWS/znrlHttpService","{\"base\":{\"sysId\" : \"10\",\"userId\" : \"100000013324\", \"service\" : \"qryDynamicInfo\", \"signature\" : \"e93b86b37efb64d424a97ce5f1cbf11b\", \"randomNum\" : \"13579046\", \"timestamp\" : \"1431067080349\" ,\"bizId\" : \"\"}, \"param\":{}}");
				String testString = o.post("http://"+ip+":8080/znrlWS/znrlHttpService","{\"base\":{\"sysId\" : \"10\",\"userId\" : \"1\", \"service\" : \"qryApproveList\", \"signature\" : \"e93b86b37efb64d424a97ce5f1cbf11b\", \"randomNum\" : \"13579046\", \"timestamp\" : \"1431067080349\" ,\"bizId\" : \"\"}, \"param\":{\"date\":\"20150905\"}}");
//				String testString = o.post("http://"+ip+":8080/znrlWS/znrlHttpService","{\"base\":{\"sysId\" : \"10\",\"userId\" : \"100000013324\", \"service\" : \"submitToApprove\", \"signature\" : \"e93b86b37efb64d424a97ce5f1cbf11b\", \"randomNum\" : \"13579046\", \"timestamp\" : \"1431067080349\" ,\"bizId\" : \"\"}, \"param\":{\"apprIds\":\"[100000000146]\",\"apprRes\":\"Y\",\"apprResDesc\":\"同意，请仔细核对\",\"staffId\":\"1\"}}");
//				String testString = o.post("http://"+ip+":8080/znrlWS/znrlHttpService","{\"base\":{\"sysId\" : \"10\",\"userId\" : \"100000013324\", \"service\" : \"submitToPhoto\", \"signature\" : \"e93b86b37efb64d424a97ce5f1cbf11b\", \"randomNum\" : \"13579046\", \"timestamp\" : \"1431067080349\" ,\"bizId\" : \"\"}, \"param\":{\"recordNo\":\"12345677\",\"fileBiz\":\"1\",\"path\":/Users/zhanhua/Library/Developer/CoreSimulator/Devices/7D6D884F-020F-4713-A974-0708AD40253E/data/Containers/Data/Application/4C073822-091D-40AF-96DF-6D32A8D651F3/Documents/userPhoto.png,\"fileName\":\"20150513001\",\"fileExt\":\"jpg\",\"cardId\":\"1233467\",\"carId\":\"苏A123456\",\"descr\":\"test\"}}");
//                String testString = o.post("http://"+ip+":8080/znrlWS/znrlHttpService","{\"base\":{\"userId\":\"1\",\"service\":\"submitToPhoto\",\"randomNum\":\"0a22f235\",\"sysId\":\"10\",\"bizId\":\"\",\"signature\":\"7d563310626510facd99325076afae1c\",\"timestamp\":\"1438048423730\"},\"param\":{\"fileName\":\"userPhot\",\"recordNo\":\"1\",\"descr\":\"\",\"fileExt\":\"png\",\"carId\":\"苏A0503T\",\"fileBiz\":\"1\",\"path\":\"/Users/zhanhua/Library/Developer/CoreSimulator/Devices/7D6D884F-020F-4713-A974-0708AD40253E/data/Containers/Data/Application/4C073822-091D-40AF-96DF-6D32A8D651F3/Documents/userPhoto.png\"}}");
                System.out.println("调用接口返回值为("+i+"):"+testString);
			}
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}


    public static void main(String[] args){
        ZnrlHttpClient o = new ZnrlHttpClient();

        String testString = null;
        try {

            testString = o.post("http://192.200.200.1:8749/httpServer", "[{\"key\":\"DB_POINT.Main.PDC.lj109\", \"val\":\"1222\"}, {\"key\":\"DB_POINT.Main.PDC.ss109\",\"val\":\"333\"}, {\"key\":\"DB_POINT.Main.PDC.updatetime109\",\"val\":\"666666\"}]");
            //testString = o.post("http://127.0.0.1:7771/intfRceiveDataHttpServer", "[{'key':'Simulator.Device1.p1','val':'haha'},{'key':'Simulator.Device1.p2','val':'谢谢'}]");
            //testString = o.post("http://localhost:8009/httpServer", "[{'key':'Simulator.Device1.p1','val':'xxx'},{'key':'Simulator.Device1.p2','val':'谢谢ss'}]");
        } catch (IOException e) {
            e.printStackTrace();
        }

        System.out.println(testString);
    }

	
	public String post(String addr, String szMessage) throws
			IOException {
				
		System.setProperty("sun.net.client.defaultConnectTimeout", "300000");
		System.setProperty("sun.net.client.defaultReadTimeout", "300000");
		
		PrintWriter out = null;
		BufferedReader in = null;
		StringBuffer sbResponse = new StringBuffer();

		try {
			URL url = new URL(addr);
			HttpURLConnection httpConn = (HttpURLConnection) url.openConnection();
			//httpConn.setConnectTimeout(300000);
			//httpConn.setReadTimeout(300000);
			httpConn.setDoInput(true);
			httpConn.setDoOutput(true);
			httpConn.setRequestProperty("Content-Type","text/html;charest=utf-8");
			httpConn.setRequestProperty("method", "post");
			out = new PrintWriter(httpConn.getOutputStream());
			out.write(szMessage);
			out.flush();

			//返回流
			in = new BufferedReader(new InputStreamReader(httpConn.getInputStream()));

			String szLine = null;
			while ((szLine = in.readLine()) != null) {
				sbResponse.append(szLine);
				sbResponse.append("\n");
			}
		} catch (IOException e) {
			throw e;
		}

		return sbResponse.toString();
	}
	
}

