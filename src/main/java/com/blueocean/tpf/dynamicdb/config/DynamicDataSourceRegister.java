package com.blueocean.tpf.dynamicdb.config;

import java.util.HashMap;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.beans.MutablePropertyValues;
import org.springframework.beans.PropertyValues;
import org.springframework.boot.autoconfigure.jdbc.DataSourceBuilder;
import org.springframework.boot.bind.RelaxedDataBinder;
import org.springframework.boot.bind.RelaxedPropertyResolver;
import org.springframework.context.EnvironmentAware;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.ConversionService;
import org.springframework.core.convert.support.DefaultConversionService;
import org.springframework.core.env.Environment;
@Configuration
public class DynamicDataSourceRegister implements  EnvironmentAware{

    private ConversionService conversionService = new DefaultConversionService(); 
    private PropertyValues dataSourcePropertyValues;

    // 如配置文件中未指定数据源类型，使用该默认值
    private static final String DATASOURCE_TYPE_DEFAULT = "org.apache.tomcat.jdbc.pool.DataSource";
    //主数据源name
    private static final String DEFAULT_DS_NAME = "master";
    //主数据源配置前缀
    private static final String DEFAULT_PREFIX = "spring.datasource.";
    //其它数据源配置前缀
    private static final String CUSTOMER_PREFIX = "custom.datasource.";

    // 数据源
    private DataSource dataSource;
    private Map<Object, Object> targetDataSources = new HashMap<>();
    @Bean("dataSource")
    public DynamicDataSource dynamicDataSource(){
		DynamicDataSource dynamicDataSource = new DynamicDataSource();
		// 将主数据源添加到更多数据源中
		for (Object key : targetDataSources.keySet()) {
			DynamicDataSourceContextHolder.dataSourceIds.add((String) key);
		}
		dynamicDataSource.setTargetDataSources(targetDataSources);
		dynamicDataSource.setDefaultTargetDataSource(dataSource);
		return dynamicDataSource;
    }

    /**
     * 创建DataSource
     *
     * @param propertyResolver
     * @return
     */
    @SuppressWarnings("unchecked")
    public DataSource buildDataSource( RelaxedPropertyResolver propertyResolver) {
        try {
        	String type = propertyResolver.getProperty("type");
            if (type == null)
                type = DATASOURCE_TYPE_DEFAULT;// 默认DataSource

            Class<? extends DataSource> dataSourceType  = (Class<? extends DataSource>) Class.forName(type);

            String driverClassName = propertyResolver.getProperty("driverClassName");
            String url =propertyResolver.getProperty("url");
            String username = propertyResolver.getProperty("username");
            String password = propertyResolver.getProperty("password");

            DataSourceBuilder factory = DataSourceBuilder.create().driverClassName(driverClassName).url(url)
                    .username(username).password(password).type(dataSourceType);
            return factory.build();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 加载多数据源配置
     */
    @Override
    public void setEnvironment(Environment env) {
        initDefaultDataSource(env);
        initCustomDataSources(env);
    }

    /**
     * 初始化主数据源
     */
    private void initDefaultDataSource(Environment env) {
    	dataSource = buildDataSource(new RelaxedPropertyResolver(env, DEFAULT_PREFIX));
        // 读取主数据源
    	dataBinder(dataSource, env);
        targetDataSources.put(DEFAULT_DS_NAME,dataSource);
    }

    /**
     * 为DataSource绑定更多数据
     *
     * @param dataSource
     * @param env
     */
    private void dataBinder(DataSource dataSource, Environment env){
        RelaxedDataBinder dataBinder = new RelaxedDataBinder(dataSource);
        //dataBinder.setValidator(new LocalValidatorFactory().run(this.applicationContext));
        dataBinder.setConversionService(conversionService);
        dataBinder.setIgnoreNestedProperties(false);//false
        dataBinder.setIgnoreInvalidFields(false);//false
        dataBinder.setIgnoreUnknownFields(true);//true
        if(dataSourcePropertyValues == null){
            Map<String, Object> rpr = new RelaxedPropertyResolver(env, DEFAULT_PREFIX).getSubProperties("");
            Map<String, Object> values = new HashMap<>(rpr);
            // 排除已经设置的属性
            values.remove("type");
            values.remove("driverClassName");
            values.remove("url");
            values.remove("username");
            values.remove("password");
            dataSourcePropertyValues = new MutablePropertyValues(values);
        }
        dataBinder.bind(dataSourcePropertyValues);
    }

    /**
     * 初始化更多数据源
     */
    private void initCustomDataSources(Environment env) {
        // 读取配置文件获取更多数据源，也可以通过defaultDataSource读取数据库获取更多数据源
    	RelaxedPropertyResolver propertyResolver = new RelaxedPropertyResolver(env,CUSTOMER_PREFIX);
        String dsPrefixs = propertyResolver.getProperty("names");
        for (String dsPrefix : dsPrefixs.split(",")) {// 多个数据源
            DataSource ds = buildDataSource(new RelaxedPropertyResolver(env, CUSTOMER_PREFIX+dsPrefix+ "."));
            targetDataSources.put(dsPrefix, ds);
            dataBinder(ds, env);
        }
    }

}
