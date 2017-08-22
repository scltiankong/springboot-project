package com.test;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.blueocean.tpf.common.util.DateUtils;
import com.blueocean.tpf.common.util.JsonSerializUtil;

public class TestClass {
	public static void main(String[] args) {
		List<Demo> list = getCusts();
		Map<String, Map<String, List<Demo>>> map = list.stream()
				.sorted((x,y) -> {
					Date date1 = x.getDate();
					Date date2 = y.getDate();
					if (date1 != null && date2!=null) {
						long l = DateUtils.diff(date1, date2);
						return l > 0 ? -1 : 1;
					}
					if (date1 != null && date2 ==null) {
						return  -1;
					}
					return 1;
				})
				.collect(Collectors.groupingBy(Demo::getCustId,Collectors.groupingBy(Demo::getType)));
		List<Demo> results = new ArrayList<>();
		map.forEach((x,y) -> {
			y.forEach((a,b) -> {
				results.add(b.get(0));
			});
		});
		System.out.println(JsonSerializUtil.javaToJson(results));
	}

	private static List<Demo> getCusts() {
		List<Demo> list = new ArrayList<>();
		list.add(new Demo("DR001", "张三", "手机","已授权", "MDE", DateUtils.str2Date("2016-03-04 3:23:33")));
		list.add(new Demo("DR001", "张三", "手机", "已授权","GRV", DateUtils.str2Date("2016-02-04 3:23:33")));
		list.add(new Demo("DR001", "张三", "手机", "已授权","WX", DateUtils.str2Date("2016-04-04 3:23:33")));
		
		list.add(new Demo("DR001", "张三", "HQ邮箱","已授权", "GRV", DateUtils.str2Date("2015-03-04 3:23:33")));
		list.add(new Demo("DR001", "张三", "HQ邮箱","已授权", "WX", DateUtils.str2Date("2016-03-04 3:23:33")));
		
		list.add(new Demo("DR001", "张三", "RTE邮箱","已授权", "MDE", DateUtils.str2Date("2016-03-04 3:23:33")));
		list.add(new Demo("DR001", "张三", "微信", "WX","已授权", DateUtils.str2Date("2016-03-04 3:23:33")));
		
		list.add(new Demo("DR002", "李四", "手机","未授权", "MDE", null));
		list.add(new Demo("DR002", "李四", "手机", "已授权","GRV", DateUtils.str2Date("2016-02-04 3:23:33")));
		list.add(new Demo("DR002", "李四", "手机", "已授权","WX", DateUtils.str2Date("2016-04-04 3:23:33")));
		
		list.add(new Demo("DR002", "李四", "HQ邮箱","已授权", "GRV", null));
		list.add(new Demo("DR002", "李四", "HQ邮箱","已授权", "WX", DateUtils.str2Date("2016-03-04 3:23:33")));
		
		list.add(new Demo("DR002", "李四", "RTE邮箱","已授权", "MDE", DateUtils.str2Date("2016-03-04 3:23:33")));
		list.add(new Demo("DR002", "李四", "微信", "WX","已授权", DateUtils.str2Date("2016-03-04 3:23:33")));
		
		list.add(new Demo("DR003", "王五", "手机","未授权", "MDE", null));
		list.add(new Demo("DR003", "王五", "手机", "未授权","GRV",null));
		list.add(new Demo("DR003", "王五", "手机", "未授权","WX",null));
		
		list.add(new Demo("DR003", "王五", "HQ邮箱","已授权", "GRV", null));
		list.add(new Demo("DR003", "王五", "HQ邮箱","已授权", "WX", DateUtils.str2Date("2016-03-04 3:23:33")));
		
		list.add(new Demo("DR003", "王五", "RTE邮箱","已授权", "MDE", DateUtils.str2Date("2016-03-04 3:23:33")));
		list.add(new Demo("DR003", "王五", "微信", "WX","已授权", DateUtils.str2Date("2016-03-04 3:23:33")));
		return list;
	}
}
