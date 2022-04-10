package org.gxz.znrl.test;


/**
 * Created by Administrator on 19-12-20.
 */
public class HEXTest {
    public static void main(String[] args) {
        String hex = "4407f723";//"001E7180"; //1995136
        int tmp = hex2Int(hex);
        if(tmp != -1){
            System.out.println(hex2Int(hex));
        }else {
            System.out.println("包含非十六进制字符！！！");
        }

    }


    private float byte2float(byte[] arr, int index) {
        return Float.intBitsToFloat(getInt(arr, index));
    }

    private int getInt(byte[] arr, int index) {
        return (0xff000000 & (arr[index + 0] << 24)) |
                (0x00ff0000 & (arr[index + 1] << 16)) |
                (0x0000ff00 & (arr[index + 2] << 8)) |
                (0x000000ff & arr[index + 3]);
    }

    /**
     * 获取十六进制字符ch的int值，如A：10，F：15，9：9
     */
    public static int getHexValue(char ch){
        if(ch >= '0' && ch <= '9'){
            return Integer.parseInt(String.valueOf(ch));
        }
        if ( (ch >= 'a'  && ch <= 'f') || (ch >= 'A' && ch <= 'F')) {
            switch (ch) {
                case 'a':
                case 'A':
                    return 10;
                case 'b':
                case 'B':
                    return 11;
                case 'c':
                case 'C':
                    return 12;
                case 'd':
                case 'D':
                    return 13;
                case 'e':
                case 'E':
                    return 14;
                case 'f':
                case 'F':
                    return 15;
            }
        }
        /* -1 我习惯用它表示出错，在调用的地方检测它
            在后面可以弄一个异常类来抛出，这里简单用-1检测
        */
        return -1;
    }

    /*  str形如：10,不包括十六进制前面的Ox
        没判断是否字符串
    */
    public static int hex2Int(String str) {
        int result = 0;
        char[] hex = str.toCharArray();
        for(int i = 0; i < hex.length; i++){
            if(getHexValue(hex[i]) != -1){
                result += getHexValue(hex[i]) * Math.pow(16, hex.length-i-1);
            }
            else {
                return -1;
            }
        }
        return result;
    }
}
