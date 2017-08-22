package com.blueocean.tpf.common.consts;

public interface ResultCode {
	/**成功*/
	int SUCCESS = 000;
	/**没有授权*/
	int SC_UNAUTHORIZED = 401;
	/**系统异常*/
	int SYS_ERROR = 10002;
	/**身份校验失败*/
	int USER_VALID_FAILED = 10003;
	/**查无记录*/
	int NO_RESULT = 10004;
	/**返回具体的错误信息*/
	int ERROR_MSG = 111;
	/**用户身份已过期，请重新登录*/
	int LOGIN_OVERDUE = 10006;
	/**用户信息错误*/
	int USER_INFO_ERROR = 20001;
	/**账号已存在*/
	int EXIST_ACCT = 444;
}
