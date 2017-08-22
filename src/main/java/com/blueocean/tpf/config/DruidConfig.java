package com.blueocean.tpf.config;

import javax.sql.DataSource;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import com.alibaba.druid.filter.stat.StatFilter;
import com.alibaba.druid.pool.DruidDataSource;
import com.alibaba.druid.support.http.StatViewServlet;
import com.alibaba.druid.support.http.WebStatFilter;
import com.alibaba.druid.wall.WallConfig;
import com.alibaba.druid.wall.WallFilter;

/**
 * Druid相关配置
 * 
 * @author suchengliang
 *
 */
@Configuration
public class DruidConfig {

	/**
	 * dataSource数据源
	 * 
	 * @return
	 * @throws Exception
	 */
	/*@ConfigurationProperties(prefix="spring.dataSource")
	@Primary
	@Bean(name = "dataSource", destroyMethod = "close")
	public DataSource dataSource() {
		return new DruidDataSource();
	}*/
	/**
	 * 配置druidServlet
	 * @return
	 */
	@Bean
    public ServletRegistrationBean druidServlet() {
        ServletRegistrationBean druidServlet = new ServletRegistrationBean();
        druidServlet.setServlet(new StatViewServlet());
        druidServlet.addUrlMappings("/druid/*");
        druidServlet.addInitParameter("allow","192.168.16.110,127.0.0.1");// IP白名单 (没有配置或者为空，则允许所有访问)
        druidServlet.addInitParameter("deny","192.168.16.111");//IP黑名单 (存在共同时，deny优先于allow)
        druidServlet.addInitParameter("loginUsername","admin");// 用户名
        druidServlet.addInitParameter("loginPassword","admin");// 密码
        druidServlet.addInitParameter("resetEnable","false");// 禁用HTML页面上的“Reset All”功能
        return druidServlet;
    }
	@Bean
	public FilterRegistrationBean druidStatFilter(){
		FilterRegistrationBean druidStatFilter = new FilterRegistrationBean();
		druidStatFilter.setFilter(new WebStatFilter());
		druidStatFilter.addUrlPatterns("/*");
		druidStatFilter.addInitParameter("exclusions", "*.js,*.gif,*.jpg,*.bmp,*.png,*.css,*.ico,/druid/*,/static/*");
		druidStatFilter.addInitParameter("profileEnable", "true");
		druidStatFilter.addInitParameter("principalCookieName", "USER_COOKIE");
		druidStatFilter.addInitParameter("principalSessionName", "USER_SESSION");
		return druidStatFilter;
	}
	/**
	 * 用于统计监控信息
	 * @return
	 */
	@Bean
    public StatFilter statFilter(){
        StatFilter statFilter = new StatFilter();
        statFilter.setLogSlowSql(true);
        statFilter.setMergeSql(true);//合并相同的sql
        statFilter.setSlowSqlMillis(1000);
        return statFilter;
    }
	@Bean
    public WallFilter wallFilter(){
        WallFilter wallFilter = new WallFilter();

        //允许执行多条SQL
        WallConfig config = new WallConfig();
        config.setMultiStatementAllow(true);
        wallFilter.setConfig(config);
        return wallFilter;
    }
}
