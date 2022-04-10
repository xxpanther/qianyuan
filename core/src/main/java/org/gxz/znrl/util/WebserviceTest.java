package org.gxz.znrl.util;

import java.util.ArrayList;
import java.util.List;

import org.apache.axis2.addressing.EndpointReference;
import org.apache.axis2.client.Options;
import org.apache.axis2.client.ServiceClient;
import org.apache.axis2.transport.http.HTTPConstants;
import org.apache.axis2.transport.http.HttpTransportProperties;
import org.apache.axis2.transport.http.HttpTransportProperties.Authenticator;

/*
 *  CmPersonUpServiceTest Junit test case
 */

public class WebserviceTest { //CmPersonUpServiceTest


//    /**
//     * Auto generated test method
//     */
//    public  void testcmPersonUp() throws java.lang.Exception{
//
//        com.test.CmPersonUpServiceStub stub = new com.test.CmPersonUpServiceStub();//the default implementation should point to the right endpoint
//
//        Options opt = stub._getServiceClient().getOptions();
//        EndpointReference epr = new EndpointReference("http://10.112.209.51:6500/spl/XAIApp/xaiserver/CmPersonUp");
//        opt.setTo(epr);
//        opt.setProperty(HTTPConstants.SO_TIMEOUT, new Integer(300000));
//        HttpTransportProperties.Authenticator authenticator = new HttpTransportProperties.Authenticator();
//        List<String> auth = new ArrayList<String>();
//        auth.add(Authenticator.BASIC);
//        authenticator.setAuthSchemes(auth);
//        authenticator.setUsername("HSYS");
//        authenticator.setPassword("sysuser00");
//        authenticator.setHost("10.112.209.51:6500");
//        authenticator.setPort(80);
//        authenticator.setPreemptiveAuthentication(true);
//        opt.setProperty(HTTPConstants.AUTHENTICATE, authenticator);
//        stub._getServiceClient().setOptions(opt);
//
//        Options opt1 = stub._getServiceClient().getOptions();
//        if(opt1.getProperty(HTTPConstants.AUTHENTICATE)!=null){
//            Authenticator authenticator1=(Authenticator)opt1.getProperty(HTTPConstants.AUTHENTICATE);
//            System.out.println(authenticator1.getUsername()+" : "+authenticator1.getPassword()+" : "+authenticator1.getHost()+" : "+authenticator1.getDomain()+" : "+authenticator1.getPort()+" : "+authenticator1.getRealm());
//        }
//        else System.out.println("opt1.getProperty(HTTPConstants.AUTHENTICATE); is null ");
//
//        com.oracle.cmpersonup_xsd.CmPersonUp cmPersonUp5=
//                (com.oracle.cmpersonup_xsd.CmPersonUp)getTestObject(com.oracle.cmpersonup_xsd.CmPersonUp.class);
//        // TODO : Fill in the cmPersonUp5 here
//        cmPersonUp5.setPersonId("0272100000");
//        cmPersonUp5.setPersonEmailId("vinay.bhar@hcl.com");
//        cmPersonUp5.setFaultStyle("wsdl");
//        CmPersonUp response=stub.cmPersonUp(cmPersonUp5);
//        System.out.println(response.getPersonEmailId()+" ------>>>>>> "+response.getPersonId()+" ------->>>>>>> "+response.getPersonBirthDay());
//
//    }
//
//    //Create an ADBBean and provide it as the test object
//    public org.apache.axis2.databinding.ADBBean getTestObject(java.lang.Class type) throws java.lang.Exception{
//        return (org.apache.axis2.databinding.ADBBean) type.newInstance();
//    }
//
//    public static void main(String[] args) {
//        WebserviceTest test = new WebserviceTest();
//        try {
//            test.testcmPersonUp();
//        } catch (Exception e) {
//            // TODO Auto-generated catch block
//            e.printStackTrace();
//        }
//    }


}