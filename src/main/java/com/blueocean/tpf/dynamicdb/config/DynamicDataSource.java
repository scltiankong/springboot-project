package com.blueocean.tpf.dynamicdb.config;

import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;
public class DynamicDataSource extends AbstractRoutingDataSource{
	/**
	 * 返回数据源对应的key
	 */
	@Override
	protected Object determineCurrentLookupKey() {
		 return DynamicDataSourceContextHolder.getDataSourceType();
	}

}
