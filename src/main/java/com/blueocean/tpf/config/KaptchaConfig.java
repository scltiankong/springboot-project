package com.blueocean.tpf.config;

import java.util.Properties;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.google.code.kaptcha.impl.DefaultKaptcha;
import com.google.code.kaptcha.util.Config;


/**
 * 验证码生成配置
 */
@Configuration
public class KaptchaConfig {
    @Bean
    public DefaultKaptcha producer() {
        DefaultKaptcha defaultKaptcha = new DefaultKaptcha();
        defaultKaptcha.setConfig(kaptchaConfig());
        return defaultKaptcha;
    }

	private Config kaptchaConfig() {
		Properties properties = new Properties();
        properties.put("kaptcha.border", "yes");//图片边框，合法值：yes , no
        properties.put("kaptcha.border.color", "red");//边框颜色，合法值： r,g,b (and optional alpha) 或者 white,black,blue.
        properties.put("kaptcha.border.thickness", "1");//边框厚度，合法值：>0，默认值1
        properties.put("kaptcha.textproducer.char.space", "2");//文字间隔,默认值2
        properties.put("kaptcha.image.width", "200");//图片宽，默认值200
        properties.put("kaptcha.textproducer.char.string", "abcde2345678gfynmnpwx");//文本集合，验证码值从此集合中获取，abcde2345678gfynmnpwx
        properties.put("kaptcha.noise.color", "blue");//干扰颜色，合法值： r,g,b 或者 white,black,blue.
        properties.put("kaptcha.textproducer.font.color", "blue");//字体颜色，合法值： r,g,b 或者 white,black,blue.
        return new Config(properties);
	}
}
