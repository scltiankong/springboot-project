package com.blueocean.tpf.common.exception;

import java.util.List;

import org.apache.shiro.authz.AuthorizationException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.blueocean.tpf.common.consts.ResultCode;
import com.blueocean.tpf.common.data.Result;

/**
 * 异常处理器
 */
@RestControllerAdvice
public class SysExceptionHandler {
	/**
	 * 字段数据校验异常信息返回
	 * @param ex
	 * @return
	 */
	@ExceptionHandler({MethodArgumentNotValidException.class})
	public Result handleException(MethodArgumentNotValidException ex){
		List<FieldError> fieldErrors = ex.getBindingResult().getFieldErrors();
		fieldErrors.get(0).getDefaultMessage();
		return Result.error(fieldErrors.get(0).getDefaultMessage());
	}
	@ExceptionHandler(DuplicateKeyException.class)
	public Result handleDuplicateKeyException(DuplicateKeyException e){
		return Result.error("数据库中已存在该记录");
	}

	@ExceptionHandler(AuthorizationException.class)
	public Result handleAuthorizationException(AuthorizationException e){
		return Result.error("没有权限，请联系管理员授权");
	}

	@ExceptionHandler(CustomException.class)
	public Result handleCustomException(CustomException e){
		Result error = Result.error(e.getMessage());
		if (e.getCode() != null) {
			error.setCode(e.getCode());
		}
		return error.setCode(ResultCode.ERROR_MSG);
	}
	@ExceptionHandler(MissingServletRequestParameterException.class)
	public Result handleRuntimeException(MissingServletRequestParameterException e){
		return Result.error(ResultCode.ERROR_MSG, "参数不正确");
	}
	@ExceptionHandler(RuntimeException.class)
	public Result handleRuntimeException(RuntimeException e){
		e.printStackTrace();
		return Result.error();
	}
	@ExceptionHandler(Exception.class)
	public Result handleException(Exception e){
		e.printStackTrace();
		return Result.error();
	}
}
