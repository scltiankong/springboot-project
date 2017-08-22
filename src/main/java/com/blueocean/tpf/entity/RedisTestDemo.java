package com.blueocean.tpf.entity;

import java.io.Serializable;

/**
 * 测试Redis的Demo实体类
 * @author scl
 *
 */
public class RedisTestDemo implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private long id;
	private String name,pwd;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPwd() {
		return pwd;
	}

	public void setPwd(String pwd) {
		this.pwd = pwd;
	}

	@Override
	public String toString() {
		return "RedisDemo [id=" + id + ", name=" + name + ", pwd=" + pwd + "]";
	}
}
