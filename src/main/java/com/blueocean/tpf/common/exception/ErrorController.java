package com.blueocean.tpf.common.exception;

import javax.servlet.http.HttpServletRequest;

import org.springframework.boot.autoconfigure.web.AbstractErrorController;
import org.springframework.boot.autoconfigure.web.ErrorAttributes;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

@Controller
public class ErrorController extends AbstractErrorController{
	private static final String errorPath = "error";
	
	public ErrorController(ErrorAttributes errorAttributes) {
		super(errorAttributes);
		this.errorAttributes = errorAttributes;
	}

	private ErrorAttributes errorAttributes;

	@Override
	public String getErrorPath() {
		 return errorPath;
	}

	@RequestMapping(errorPath)
	public String error(HttpServletRequest request) {
		RequestAttributes requestAttributes = RequestContextHolder.currentRequestAttributes();
		Throwable error = errorAttributes.getError(requestAttributes);
		return "redirect:/Client/Bid-price-forecast-system/Client/index.html#";
	}
}
