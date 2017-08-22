package com.blueocean.tpf.common.base;

import java.util.List;
import java.util.Map;

/**
 * 基础Dao(还需在XML文件里，有对应的SQL语句)
 */
public interface BaseDao<T> {
	
	void save(T t);
	
	void saveBatch(List<? extends Object> list);
	
	int update(T t);
	
	int update(Map<String, Object> map);
	
	int delete(Object id);
	
	int delete(Map<String, Object> map);
	
	int deleteBatch(Object[] id);

	T getObject(Object id);
	
	List<T> queryList(Query criteria);
	/**
	 * 通过查询条件查询数量
	 * @param criteria
	 * @return
	 */
	int count(Query query);
	
	List<T> queryList(Object id);
}
