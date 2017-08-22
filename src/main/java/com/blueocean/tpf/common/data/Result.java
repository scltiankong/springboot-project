package com.blueocean.tpf.common.data;

import java.util.HashMap;

import com.blueocean.tpf.common.consts.ResultCode;

/** 统一的返回封装对象 */
public class Result extends HashMap<String, Object>{
	private static final long serialVersionUID = 1L;
	private static final String ERROR_MSG="未知异常，请联系管理员";
	private static final String KEY_CODE="code";
	private static final String KEY_MSG="msg";
	private static final String KEY_DATA="data";
	/************************************************/
	private static final String KEY_BACK="backHttpResult";
	private static final String KEY_BEAN="bean";
	private static final String KEY_RESULT="result";
	private static final String MSG_SUCCESS="success";
	private static final String MSG_ERROR="error";
	
	public static Result ok(){
		return getResult().addResult(new Result(ResultCode.SUCCESS, MSG_SUCCESS));
	}
	public static Result ok(Object data){
		return getResult().addResult(new Result(ResultCode.SUCCESS, MSG_SUCCESS))
					.addAttribute(KEY_BEAN, data);
	}
	public static Result error(){
		return getResult().addResult(new Result(ResultCode.SYS_ERROR, MSG_ERROR));
	}
	public static Result error(Object msg){
		return getResult().addResult(new Result(ResultCode.SYS_ERROR, msg));
	}
	public static Result error(int code,Object msg){
		return getResult().addResult(new Result(code, msg));
	}
	
	/*========================================================================================*/
	public Result addMsg(Object msg){
		Result result = (Result) get(KEY_BACK);
		result.put(KEY_RESULT, msg);
		return this;
	}
	public Result setCode(Integer code){
		Result result = (Result) get(KEY_BACK);
		result.put(KEY_CODE, code);
		return this;
	}
	public Result addData(Object data){
		put(KEY_BEAN, data);
		return this;
	}
	public Result addAttribute(String key,Object value){
		put(key, value);
		return this;
	}
	public Result addResult(Result result){
		put(KEY_BACK, result);
		return this;
	}
	
	/* ==================================== 私有构造方法 ======================================== */
	private Result(int code) {
		put(KEY_CODE, code);
	}
	private Result(int code,Object result) {
		this(code);
		put(KEY_RESULT, result);
	}
	private Result() {}
	private static Result getResult(){
		return new Result();
	}
}
