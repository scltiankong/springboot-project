package com.blueocean.tpf.common.util;

import java.io.UnsupportedEncodingException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 *	字符串处理的相关类
 */
@SuppressWarnings("rawtypes")
public abstract class StringUtils {
	
	/**
	 * 检查一个字符串中是否包含多个连续相同字符
	 * @param targetStr	目标字符串
	 * @param charNum	被检测数量
	 * @return	包含连续相同字符 true, 目标字符串为null或者"",false, 其他false
	 */
	public static boolean containsContinuousSameChar(String targetStr, int charNum){
		if(DataValidUtil.isEmpty(targetStr)) return false;
		int count = 0;
		char startChar = 0;
		for (int i = 0; i < targetStr.length(); i++) {
			char _tmp = targetStr.charAt(i);
			if(i == 0) startChar = _tmp;
			if(startChar == _tmp) count++;
			else count = 1;
			startChar = _tmp;
			if(count >= charNum) return true;
		}
		return false;
	}
	
	/**
	 * 检查一个字符串中是否包含多个升序或降序字符
	 * @param targetStr	目标字符串
	 * @param charNum	被检测数量
	 * @return	包含连续相同字符 true, 目标字符串为null或者"",false, 其他false
	 */
	public static boolean containsContinuousLiftChar(String targetStr, int charNum){
		if(DataValidUtil.isEmpty(targetStr)) return false;
		int count = 0;
		char startChar = 0;
		boolean liftFlag = true;
		for (int i = 0; i < targetStr.length(); i++) {
			char _tmp = targetStr.charAt(i);
			if(i == 0) startChar = _tmp;
			if(startChar == _tmp-1) {
				if(liftFlag) count++;
				else count = 1;
			}else if(startChar == _tmp+1){
				if(liftFlag){
					liftFlag = false;
					count = 1;
				}
				if(liftFlag) count = 1; 
				else count++;
			}else{
				liftFlag = true;
				count = 1;
			}
			startChar = _tmp;
			if(count >= charNum) return true;
		}
		return false;
	}
	
	/**
	 *	unicode 转中文 
	 */
	public static String unicodeToString(String str) {
	    Pattern pattern = Pattern.compile("(\\\\u(\\p{XDigit}{4}))");    
	    Matcher matcher = pattern.matcher(str);
	    char ch;
	    while (matcher.find()) {
	        ch = (char) Integer.parseInt(matcher.group(2), 16);
	        str = str.replace(matcher.group(1), ch + "");    
	    }
	    return str;
	}
	/**
	 * 检查email是否是邮箱格式，返回true表示是，反之为否
	 * 
	 * @param email
	 * @return
	 */
	public static boolean isEmail(String email) {
		if (DataValidUtil.isEmpty(email)) {
			return false;
		}
		Pattern regex = Pattern
				.compile("\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*");
		Matcher matcher = regex.matcher(email);
		return matcher.matches();
	}
	/**
	 * 检验手机号码格式
	 * @param mobiles
	 * @return
	 */
	 public static boolean isMobile(String mobiles){
		if (DataValidUtil.isEmpty(mobiles)){
			return false;
		}
        Pattern p = Pattern.compile("^((13[0-9])|(14[5|7|9])|(15[^4,\\D])|(17[0|1|5-8])|(18[0-9]))\\d{8}$");     
        Matcher m = p.matcher(mobiles);      
        return m.matches();     
    } 
	 /**
	 * 检验银行卡格式
	 * @param mobiles
	 * @return
	 */
	 public static boolean isBankCard(String bankCard){
		if (DataValidUtil.isEmpty(bankCard)){
			return false;
		} 
        Pattern p = Pattern.compile("^[0-9]{15,19}$");
        Matcher m = p.matcher(bankCard);
        return m.matches();
     }  
	/**
	 * 检查身份证的格式，返回true表示是，反之为否
	 * 
	 * @param email
	 * @return
	 */
	public static boolean isCard(String cardId) {
		if (DataValidUtil.isEmpty(cardId)) {
			return false;
		}
		//身份证正则表达式(15位) 
		Pattern isIDCard1=Pattern.compile("^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$"); 
		//身份证正则表达式(18位) 
		Pattern isIDCard2=Pattern.compile("^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}([0-9]|X)$"); 
		Matcher matcher1= isIDCard1.matcher(cardId);
		Matcher matcher2= isIDCard2.matcher(cardId);
		return matcher1.matches()||matcher2.matches();
	}

	/**
	 * 判断字符串是否为整数
	 * 
	 * @param str
	 * @return
	 */
	public static boolean isInteger(String str) {
		if (DataValidUtil.isEmpty(str)) {
			return false;
		}
		Pattern regex = Pattern.compile("\\d*");
		Matcher matcher = regex.matcher(str);
		boolean isMatched = matcher.matches();
		return isMatched;
	}

	/**
	 * 判断字符串是否为数字
	 * 
	 * @param str
	 * @return
	 */
	public static boolean isNumber(String str) {
		if (DataValidUtil.isEmpty(str)) {
			return false;
		}
		Pattern regex = Pattern.compile("\\d*(.\\d*)?");
		Matcher matcher = regex.matcher(str);
		boolean isMatched = matcher.matches();
		return isMatched;
	}
    
    /**
     * 获取Map中的属性
     * @see 由于Map.toString()打印出来的参数值对,是横着一排的...参数多的时候,不便于查看各参数值
     * @see 故此仿照commons-lang.jar中的ReflectionToStringBuilder.toString()编写了本方法
     * @return String key11=value11 \n key22=value22 \n key33=value33 \n......
     */
    public static String getStringFromMap(Map<String, String> map){
        StringBuilder sb = new StringBuilder();
        sb.append(map.getClass().getName()).append("@").append(map.hashCode()).append("[");
        for(Map.Entry<String,String> entry : map.entrySet()){
            sb.append("\n").append(entry.getKey()).append("=").append(entry.getValue());
        }
        return sb.append("\n]").toString();
    }
    /**
     * 获取Map中的属性
     * @see 该方法的参数适用于打印Map<String, byte[]>的情况
     * @return String key11=value11 \n key22=value22 \n key33=value33 \n......
     */
    public static String getStringFromMapForByte(Map<String, byte[]> map){
        StringBuilder sb = new StringBuilder();
        sb.append(map.getClass().getName()).append("@").append(map.hashCode()).append("[");
        for(Map.Entry<String,byte[]> entry : map.entrySet()){
            sb.append("\n").append(entry.getKey()).append("=").append(new String(entry.getValue()));
        }
        return sb.append("\n]").toString();
    }
    
    
    /**
     * 获取Map中的属性
     * @see 该方法的参数适用于打印Map<String, Object>的情况
     * @return String key11=value11 \n key22=value22 \n key33=value33 \n......
     */
    public static String getStringFromMapForObject(Map<String, Object> map){
        StringBuilder sb = new StringBuilder();
        sb.append(map.getClass().getName()).append("@").append(map.hashCode()).append("[");
        for(Map.Entry<String,Object> entry : map.entrySet()){
            sb.append("\n").append(entry.getKey()).append("=").append(entry.getValue().toString());
        }
        return sb.append("\n]").toString();
    }
    
	/**
	 * 首字母大写
	 * @param s
	 * @return
	 */
	public static String firstCharUpperCase(String s) {
		StringBuffer sb = new StringBuffer(s.substring(0, 1).toUpperCase());
		sb.append(s.substring(1, s.length()));
		return sb.toString();
	}
	/**
	 * 首字母小写
	 * @param s
	 * @return
	 */
	public static String firstCharLowerCase(String s) {
		StringBuffer sb = new StringBuffer(s.substring(0, 1).toLowerCase());
		sb.append(s.substring(1, s.length()));
		return sb.toString();
	}
	/**
	 * 隐藏字符
	 * @param str
	 * @param len
	 * @return
	 */
	public static String hideChar(String str,int len){
		if(str==null) return null;
		char[] chars=str.toCharArray();
		for(int i=1;i>chars.length-1;i++){
			if(i<len){
				chars[i]='*';
			}
		}
		str=new String(chars);
		return str;
	}
	
	public static String hideLastChar(String str,int len){
		if(str==null) return null;
		char[] chars=str.toCharArray();
		if(str.length()<=len){
			for(int i=0;i<chars.length;i++){
				chars[i]='*';
			}
		}else{
			for(int i=chars.length-1;i>chars.length-len-1;i--){
				chars[i]='*';
			}
		}
		return new String(chars);
	}
	
	/**
	 * 
	 * @return
	 */
	public static String format(String str,int len){
		if(str==null) return "-";
		if(str.length()<=len){
			int pushlen=len-str.length();
			StringBuffer sb=new StringBuffer();
			for(int i=0;i<pushlen;i++){
				sb.append("0");
			}
			sb.append(str);
			str=sb.toString();
		}else{
			String newStr=str.substring(0, len);
			str=newStr;
		}
		return str;
	}
	
	public static String contact(Object[] args){
		StringBuffer sb=new StringBuffer();
		for(int i=0;i<args.length;i++){
			sb.append(args[i]);
			if(i<args.length-1){
				sb.append(",");
			}
		}
		return sb.toString();
	}
	
	/**
	 * 是否包含在以“，”隔开字符串内
	 * @param s
	 * @param type
	 * @return
	 */
	public static boolean isInSplit(String s,String type){
		if(DataValidUtil.isEmpty(s)){
			return false;
		}
		List<String> list=Arrays.asList(s.split(","));
		if(list.contains(type)){
			return true;
		}
		return false;
	}
	public static String generateTradeNO(long userid,String type){
		return type + userid + DateUtils.getTimeStamp();
	}
	/**
	 * 数组转字符串并以都好分割
	 * @param arr
	 * @return
	 */
	public static String array2Str(Object[] arr){
		StringBuffer s=new StringBuffer();
		for(int i=0;i<arr.length;i++){
			s.append(arr[i]);
			if(i<arr.length-1){
				s.append(",");
			}
		}
		return s.toString();
	}
	
	public static String array2Str(int[] arr){
		StringBuffer s=new StringBuffer();
		for(int i=0;i<arr.length;i++){
			s.append(arr[i]);
			if(i<arr.length-1){
				s.append(",");
			}
		}
		return s.toString();
	}
	
    public static String gbk2Utf(String gbk) throws UnsupportedEncodingException {  
        char[] c = gbk.toCharArray();  
        byte[] fullByte = new byte[3*c.length];  
        for (int i=0; i<c.length; i++) {  
            String binary = Integer.toBinaryString(c[i]);  
            StringBuffer sb = new StringBuffer();  
            int len = 16 - binary.length();  
            //前面补零  
            for(int j=0; j<len; j++){  
                    sb.append("0");  
                }  
            sb.append(binary);  
            //增加位，达到到24位3个字节  
            sb.insert(0, "1110");  
                sb.insert(8, "10");  
                sb.insert(16, "10");  
                fullByte[i*3] = Integer.valueOf(sb.substring(0, 8), 2).byteValue();//二进制字符串创建整型  
                fullByte[i*3+1] = Integer.valueOf(sb.substring(8, 16), 2).byteValue();  
                fullByte[i*3+2] = Integer.valueOf(sb.substring(16, 24), 2).byteValue();  
        }  
        //模拟UTF-8编码的网站显示  
        return new String(fullByte,"UTF-8");
    }  
	
    public static String getGbk(String str) throws UnsupportedEncodingException{
    	return new String(str.getBytes("UTF-8"),"GB2312");
    }
    
    /**
     * 将数据替换模板中的匹配内容（无屏蔽规则）
     * @param templateStr
     * @param paramsMap
     * @return
     */
    public static String replace(String templateStr,Map paramsMap) {
		Matcher m = Pattern.compile("[$]([^{]*?)[$]").matcher(templateStr);
		StringBuffer buf = new StringBuffer();
		while (m.find()) {
			try {
				String paramValue = paramsMap.get(m.group(1)) == null ? ""
						: paramsMap.get(m.group(1)).toString();
				m.appendReplacement(buf, paramValue);
			} catch (Exception ex) {
				ex.printStackTrace();
			}
		}
		m.appendTail(buf);
		templateStr = buf.toString();

		return templateStr;
	}
	/**
	 *	带屏蔽规则模板数据组合
	 * @param paramsMap
	 * @param templateStr
	 * @param regMap 屏蔽规则 key 屏蔽字段  value 规则
	 * 规则示例:
	 * HashMap reg=new HashMap();
	 * reg.put("NAME","1:*"); 将NAME保留为前 1 位内容，后面全部替换为 *
	 * reg.put("TEL","-4:*"); 将TEL保留为后 4 位内容，前面全部替换为 *
	 * @return
	 */
	public static String replaceWithReg(String templateStr,Map paramsMap, Map<String,String> regMap) {
		Matcher m = Pattern.compile("[$]([^{]*?)[$]").matcher(templateStr);
		StringBuffer buf = new StringBuffer();
		while (m.find()) {
			try {
				String paramValue = paramsMap.get(m.group(1)) == null ? ""
						: paramsMap.get(m.group(1)).toString();
				
				//脱敏---begin----
				if(regMap!=null){
					//获取规则
					String reg= regMap.get(String.valueOf(m.group(1)));
					//是否配置规则
					if(reg!=null){							
						char[] paramValueArray=paramValue.toCharArray();
						//校验规则格式是否正确
						String [] regArray=reg.split(":");
						//位置
						int local=Integer.valueOf(regArray[0]);
						//替换字符
						String repChar=regArray[1];
						//必须满足替换条件
						if(paramValue.length()>Math.abs(local)){
							
							if(local>0){
								
								for(int i=local;i<paramValueArray.length;i++){
									paramValueArray[i]=(char)repChar.toCharArray()[0];
								}
								
							}
							else
							{
								for(int i=0;i<(paramValueArray.length+local);i++){
									paramValueArray[i]=(char)repChar.toCharArray()[0];
								}
							}
							
						}
						
						
						paramValue=String.valueOf(paramValueArray);
					}
					//脱敏结束
				}
				m.appendReplacement(buf, paramValue);
			} catch (Exception ex) {
				ex.printStackTrace();
			}
		}
		m.appendTail(buf);
		templateStr = buf.toString();
		return templateStr;
	}
	/**
	 * 将字符串后面替换成指定字符
	 * @param str
	 * @return
	 */
	public static String stringReplice(String str,int n,char b){
		if(str==null)return "";
		if(n<=0)return str;
		if(n>=str.length())return str;
		if(str.length()<=n)return str;
		char[] chars=str.toCharArray();
		for(int i=n;i<chars.length;i++){
			chars[i]=b;
		}
		return new String(chars);
	}
    
	/**
	 * 将字符串中指定的一段字符串替换成指定字符
	 * @param str
	 * @return
	 */
	public static String stringReplaceSection(String str,int a,int b,char c){
		if(str==null)return "";
		if(a<=0)return str;
		if(a>=str.length())return str;
		if(str.length()<=a)return str;
		char[] chars=str.toCharArray();
		for(int i=a;i<b;i++){
			chars[i]=c;
		}
		return new String(chars);
	}
	
	/**
	 * value必须为n中的一个
	 * @param value 需要判断的对象
	 * @param n 必须为n中的一个
	 * @return
	 */
	public static boolean isMustContain(Object value,Object...n ) {
		if(n!=null){
			for(Object a:n)
				if(a.equals(value))return true;
		}
		return false;
	}

	public static boolean equalsIgnoreCase(String readData, String taskThread) {
		return readData.equalsIgnoreCase(taskThread);
	}

	public static boolean equals(Object nodeNamePath, Object string) {
		return nodeNamePath.equals(string);
	}
}
