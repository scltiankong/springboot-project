package com.blueocean.tpf.common.data;

import java.util.HashMap;

import com.blueocean.tpf.common.consts.ResultCode;

/** 统一的返回封装对象 */
public class Result_copy extends HashMap<String, Object>{
	private static final long serialVersionUID = 1L;
	private static final String ERROR_MSG="未知异常，请联系管理员";
	private static final String KEY_CODE="code";
	private static final String KEY_MSG="msg";
	private static final String KEY_DATA="data";
	/************************************************/
	private static final String KEY_BACK="backHttpResult";
	private static final String KEY_BEAN="bean";
	private static final String KEY_RESULT="result";
	
	public static Result_copy ok(){
		return new Result_copy(ResultCode.SUCCESS);
	}
	public static Result_copy ok(Object data){
		return new Result_copy(ResultCode.SUCCESS).addData(data);
	}
	public static Result_copy error(){
		return new Result_copy(ResultCode.SYS_ERROR).addMsg(ERROR_MSG);
	}
	public static Result_copy error(Object msg){
		return new Result_copy(ResultCode.SYS_ERROR).addMsg(msg);
	}
	public static Result_copy error(int code,Object msg){
		return new Result_copy(code).addMsg(msg);
	}
	
	/*========================================================================================*/
	public Result_copy addMsg(Object msg){
		put(KEY_MSG, msg);
		return this;
	}
	public Result_copy setCode(Integer code){
		put(KEY_CODE, code);
		return this;
	}
	public Result_copy addData(Object data){
		put(KEY_DATA, data);
		return this;
	}
	public Result_copy addAttribute(String key,Object value){
		put(key, value);
		return this;
	}
	public Result_copy addResult(Result_copy result){
		put(KEY_BACK, result);
		return this;
	}
	
	/* ==================================== 私有构造方法 ======================================== */
	private Result_copy(int code) {
		put(KEY_CODE, code);
	}
	private Result_copy(int code,Object result) {
		this(code);
		put(KEY_RESULT, result);
	}
}
