package com.blueocean.tpf.common.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

public class DateUtils {
	private static final String P_DAY = "yyyy-MM-dd";
	private static final String L_DAY = "yyyy年MM月dd日";
	private static final String S_DAY = "yyyyMMdd";
	private static final String P_SECOND = P_DAY+" HH:mm:ss";
	private static final String L_SECOND = L_DAY+" HH时mm分ss秒";
	private static final String S_SECOND = "yyyyMMddHHmmss";
	private static final String L_MON_MIN = "MM月dd日 hh:mm";
	
	public static DateFormat dateFormat(String pattern) {
		return new SimpleDateFormat(pattern);
	}
	/**
	 * 日期格式化：MM月dd日 hh:mm
	 * @param date
	 * @return
	 */
	public static String date2Str(Date date) {
		if(date==null){return "";}
		return dateFormat(L_MON_MIN).format(date);
	}
	/**
	 * 日期格式化：yyyyMMdd
	 * @param date
	 * @return
	 */
	public static String date2ShortDay(Date date) {
		if(date==null){return "";}
		return dateFormat(S_DAY).format(date);
	}
	/**
	 * 日期格式化
	 * @param date
	 * @param f 输入格式
	 * @return
	 */
	public static String formatDate(Date date,String f) {
		if(date==null){return "";}
		return dateFormat(f).format(date);
	}
	/**
	 * 日期格式化：yyyy-MM-dd
	 * @param date
	 * @return
	 */
	public static String date2day(Date date) {
		if(date==null){return "";}
		return dateFormat(P_DAY).format(date);
	}
	/**
	 * 日期格式化：yyyyMMddHHmmss
	 * @param date
	 * @return
	 */
	public static String date2second(Date date) {
		if(date==null){return "";}
		return dateFormat(S_SECOND).format(date);
	}
	/**
	 * 日期格式化：yyyy-MM-dd HH:mm:ss
	 * @param date
	 * @return
	 */
	public static String date4second(Date date) {
		if(date==null){return "";}
		return dateFormat(P_SECOND).format(date);
	}
	/**
	 * 日期格式化：yyyy年MM月dd日 HH时mm分ss秒
	 * @param date
	 * @return
	 */
	public static String date4localSecond(Date date) {
		if(date==null){return "";}
		return dateFormat(L_SECOND).format(date);
	}
	/**
	 * 日期格式化：yyyy年MM月dd日
	 * @param date
	 * @return
	 */
	public static String date4localDay(Date date) {
		if(date==null){return "";}
		return dateFormat(L_DAY).format(date);
	}
	/**
	 * 获取当前时间时间戳
	 * @return
	 */
	public static String getTimeStamp(){
		return DateUtils.date2second(now());
	}
	/**
	 * 获取当前时间
	 * @return
	 */
	public static Date now(){
		return Calendar.getInstance().getTime();
	}
	
	/**
	 * 字符串格式化：yyyy-MM-dd HH:mm:ss
	 * @param date
	 * @return
	 */
	public static Date str2Date(String datestr) {
		try {
			return dateFormat(P_SECOND).parse(datestr);
		} catch (ParseException e) {
			return null;
		}
	}
	/**
	 * 字符串格式化：yyyy-MM-dd
	 * @param date
	 * @return
	 */
	public static Date str2day(String datestr) {
		try {
			return dateFormat(P_DAY).parse(datestr);
		} catch (ParseException e) {
			return null;
		}
	}
	public static int getDay(Date d){
		Calendar cal=Calendar.getInstance();
		cal.setTime(d);
		return cal.get(Calendar.DAY_OF_MONTH);
	}
	public static Date rollDay(Date d,int day){
		Calendar cal=Calendar.getInstance();
		cal.setTime(d);
		cal.add(Calendar.DAY_OF_MONTH, day);
		return cal.getTime();
	}
	public static Date rollMon(Date d,int mon){
		Calendar cal=Calendar.getInstance();
		cal.setTime(d);
		cal.add(Calendar.MONTH, mon);
		return cal.getTime();
	}
	public static Date rollYear(Date d,int year){
		Calendar cal=Calendar.getInstance();
		cal.setTime(d);
		cal.add(Calendar.YEAR, year);
		return cal.getTime();
	}
	public static Date rollDate(Date d,int year,int mon,int day){
		Calendar cal=Calendar.getInstance();
		cal.setTime(d);
		cal.add(Calendar.YEAR, year);
		cal.add(Calendar.MONTH, mon);
		cal.add(Calendar.DAY_OF_MONTH, day);
		return cal.getTime();
	}
	
	public static Date subtractDay(Date d,int day){
		Calendar cal=Calendar.getInstance();
		cal.setTime(d);
		cal.set(Calendar.DATE, cal.get(Calendar.DATE) - day);
		return cal.getTime();
	}
	/**
	 * 获取当前时间的秒数字符串
	 * @return
	 */
	public static String getNowTimeStr(){
		return Long.toString(System.currentTimeMillis() / 1000);
	}

	public static Date getIntegralTime(){
		Calendar cal = Calendar.getInstance();
		cal.set(Calendar.HOUR_OF_DAY, 0);
		cal.set(Calendar.SECOND, 0);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.MILLISECOND, 0);
		return cal.getTime();
	}
	
	public static Date getLastSecIntegralTime(Date d){
		Calendar cal = Calendar.getInstance();
		cal.setTimeInMillis(d.getTime());
		cal.set(Calendar.HOUR_OF_DAY, 23);
		cal.set(Calendar.SECOND, 59);
		cal.set(Calendar.MINUTE, 59);
		cal.set(Calendar.MILLISECOND, 0);
		return cal.getTime();
	}
	/**
	 * 计算两个时间的时间差
	 * @param startTime
	 * @param endTime
	 * @return
	 */
	public static String dateDiff(Date startTime,Date endTime){
		long nd = 1000*24*60*60;//一天的毫秒数
		long nh = 1000*60*60;//一小时的毫秒数
		long nm = 1000*60;//一分钟的毫秒数
		long ns = 1000;//一秒的毫秒数
		
		long diff = endTime.getTime()-startTime.getTime();
		long day = diff/nd;//计算差多少天
		long hour = diff%nd/nh;//计算差多少小时
		long min = diff%nd%nh/nm;//计算差多少分钟
		long sec = diff%nd%nh%nm/ns;//计算差多少秒//输出结果
		String daystr = day<10?"0"+day:""+day;
		String hourstr = hour<10?"0"+hour:""+hour;
		String minstr = min<10?"0"+min:""+min;
		String secstr = sec<10?"0"+sec:""+sec;
		
		return daystr+"天"+hourstr+"小时"+minstr+"分钟"+secstr+"秒";
	}
	/**
	 * 计算两个时间的时间差
	 * @param startTime
	 * @param endTime
	 * @return
	 */
	public static long diff(Date startTime,Date endTime){
		return endTime.getTime() - startTime.getTime();
	}
	/**
	 * 用于返回指定日期格式的月份增加指定月数的月份
	 * 
	 * @param appDate
	 *            指定月份
	 * @param format
	 *            指定日期格式
	 * @param days
	 *            指定月数
	 * @return 指定日期格式的月数增加指定月数的月数
	 */
	public static String getFutureMonth(String appDate, String format, int days) {
		String future = "";
		try {
			Calendar calendar = GregorianCalendar.getInstance();
			SimpleDateFormat simpleDateFormat = new SimpleDateFormat(format);
			Date date = simpleDateFormat.parse(appDate);
			calendar.setTime(date);
			calendar.add(Calendar.MONTH, days);
			date = calendar.getTime();
			future = simpleDateFormat.format(date);
		} catch (Exception e) {

		}
		return future;
	}
	/**
	 * 用于返回指定日期格式的日期增加指定天数的日期
	 * 
	 * @param appDate
	 *            指定日期
	 * @param format
	 *            指定日期格式
	 * @param days
	 *            指定天数
	 * @return 指定日期格式的日期增加指定天数的日期
	 */
	public static String getFutureDay(String appDate, String format, int days) {
		String future = "";
		try {
			Calendar calendar = GregorianCalendar.getInstance();
			SimpleDateFormat simpleDateFormat = new SimpleDateFormat(format);
			Date date = simpleDateFormat.parse(appDate);
			calendar.setTime(date);
			calendar.add(Calendar.DATE, days);
			date = calendar.getTime();
			future = simpleDateFormat.format(date);
		} catch (Exception e) {
			System.out.println(e);
		}
		return future;
	}
	/** 
     * 获取两个日期相差的天数 
     * @param date 日期字符串 
     * @param otherDate 另一个日期字符串 
     * @return 相差天数 
     */  
    public static long getIntervalDays(String date, String otherDate) {  
        return getIntervalDays(str2day(date), str2day(otherDate));  
    }  
      
    /** 
     * @param date 日期 
     * @param otherDate 另一个日期 
     * @return 相差天数 
     */  
    public static long getIntervalDays(Date date, Date otherDate) {  
        long time = otherDate.getTime()-date.getTime();  
        return (long)time/(24 * 60 * 60 * 1000);  
    }  
	

	
    /** 
     * 判断时间是否是今天 
     *  
     * @param date 
     *            当前时间 yyyy-MM-dd 
     * @param strDateBegin 
     *            指定日期
     * @return 
     */  
    public static boolean isInDate(Date date, String strDateBegin) {  
        SimpleDateFormat sdf = new SimpleDateFormat(P_DAY);  
        String strDate = sdf.format(date);                                  
        // 截取当前时间  
        int strDatey = Integer.parseInt(strDate.substring(1, 4));  
        int strDatem = Integer.parseInt(strDate.substring(5, 7));  
        int strDated = Integer.parseInt(strDate.substring(8, 10));  
        // 截取指定时间
        int strDateBeginy = Integer.parseInt(strDateBegin.substring(1, 4));  
        int strDateBeginm = Integer.parseInt(strDateBegin.substring(5, 7));  
        int strDateBegind= Integer.parseInt(strDateBegin.substring(8, 10)); 
        
        //指定时间与判断时间日期相等
        if ((strDatey == strDateBeginy)&&(strDatem == strDateBeginm)&&(strDated == strDateBegind )) {
        	return true;
         }
        	return false;
    }
    /**
     * 当前时间指定分钟之后的时间
     * @return
     */

	public static String addTime(long min) {
		long curren = System.currentTimeMillis();
		curren += min * 60 * 1000;
		Date da = new Date(curren);
		SimpleDateFormat dateFormat = new SimpleDateFormat(P_SECOND);
		return dateFormat.format(da);

	}
    
    /**
     * 当前时间指定分钟之前的时间
     * @return
     */
	public static String addTime1(long second) {
		long curren = System.currentTimeMillis();
		curren -= second * 1000;
		Date da = new Date(curren);
		SimpleDateFormat dateFormat = new SimpleDateFormat(P_SECOND);
		return dateFormat.format(da);

	}
}
