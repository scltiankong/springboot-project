package com.blueocean.tpf.common.base;

import java.util.HashMap;

/**
 * 查询参数
 */
public class Query extends HashMap<String, Object> {
	private static final long serialVersionUID = 1L;
	//当前页码
    private int pageIndex=1;
    //每页条数
    private int pageSize=10;

    public Query(){
        //分页参数
        try {
			this.pageIndex = Integer.parseInt(get("page").toString());
			this.pageSize = Integer.parseInt(get("pageSize").toString());
		} catch(Exception e) {
		}
        this.put("offset", (pageIndex - 1) * pageSize);
        this.put("pageIndex", pageIndex);
        this.put("limit", pageSize);
    }
    public static Query createQuery(){
    	return new Query();
    }
    public  Query addKey(String key,Object value){
    	this.put(key, value);
    	return this;
    }
    public Query setPage(boolean page){
    	if (!page) {
    		this.remove("pageIndex");
    		this.remove("offset");
    		this.remove("limit");
		}
    	return this;
    }
	public int getPageSize() {
		return pageSize;
	}
	public int getPage() {
		return pageIndex;
	}
}
