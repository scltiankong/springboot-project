package com.test;

import java.util.Date;
/**
 * 测试demo类
 * @author scl
 *
 */
public class Demo {
	private String custId;
	private String name,status;
	private String type;
	private String way;
	private Date date;
	public String getCustId() {
		return custId;
	}
	public void setCustId(String custId) {
		this.custId = custId;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getWay() {
		return way;
	}
	public void setWay(String way) {
		this.way = way;
	}
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Demo(String custId, String name, String type,String status, String way, Date date) {
		super();
		this.custId = custId;
		this.name = name;
		this.type = type;
		this.way = way;
		this.status = status;
		this.date = date;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	@Override
	public String toString() {
		return "Demo [custId=" + custId + ", name=" + name + ", status=" + status + ", type=" + type + ", way=" + way
				+ ", date=" + date + "]";
	}
}
