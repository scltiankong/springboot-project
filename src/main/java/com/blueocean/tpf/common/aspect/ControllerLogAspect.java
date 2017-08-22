package com.blueocean.tpf.common.aspect;

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestBody;

import com.blueocean.tpf.common.util.HttpContextUtils;

/**
 * 控制层日志切面类
 */
@Aspect
@Component
public class ControllerLogAspect {
	
	@Pointcut("execution(* com.blueocean.tpf.controller.*.*(..))")
	public void logPointCut() { }
	
	@Before("logPointCut()")
	public void saveSysLog(JoinPoint joinPoint) {
		MethodSignature signature = (MethodSignature) joinPoint.getSignature();
		//请求的方法名
		String className = joinPoint.getTarget().getClass().getName();
		String methodName = signature.getName();
		Method method = signature.getMethod();
		StringBuffer logMsg = new StringBuffer("请求Contoller类："+className+",请求方法名："+methodName+"\n请求参数：{");
		boolean flag = false;
		Annotation[][] annotations = method.getParameterAnnotations();
		if (annotations!=null && annotations.length>0) {
			List<Annotation> annotationList = Arrays.asList(annotations[0]);
			for (Annotation annotation : annotationList) {
				if (annotation.annotationType() == RequestBody.class) {
					flag = true;
				}
			}
		}
		if (flag) {
			Object[] args = joinPoint.getArgs();
			logMsg.append(args[0]);
		}else {
			//获取request
			HttpServletRequest request = HttpContextUtils.getHttpServletRequest();
			//请求的参数
			Map<String, String[]> parameterMap = request.getParameterMap();
			
			parameterMap.forEach((x,y) ->{
				logMsg.append("["+x+"="+y[0]+"]");
			});
		}
		logMsg.append("}");
		System.err.println(logMsg);
	}
	
}
