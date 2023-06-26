package com.roninleecode.springbootlibrary.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import com.roninleecode.springbootlibrary.entity.Book;
import com.roninleecode.springbootlibrary.entity.History;
import com.roninleecode.springbootlibrary.entity.Message;
import com.roninleecode.springbootlibrary.entity.Review;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer{
	
	private String theAllowedOrigin = "http://localhost:3000";
	
	@Override
	public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
		HttpMethod[] theUnsupportedActions = {
					HttpMethod.POST, 
					HttpMethod.PATCH,
					HttpMethod.DELETE,
					HttpMethod.PUT 
				};
		config.exposeIdsFor(Book.class);// Hiển thị giá trị ID của book trong API
		config.exposeIdsFor(Review.class); // Hiển thị giá trị ID của review trong API
		config.exposeIdsFor(History.class);
		config.exposeIdsFor(Message.class);
		
		disableHttpMethods(Book.class,config,theUnsupportedActions);
		
		disableHttpMethods(Review.class,config,theUnsupportedActions);
		
		disableHttpMethods(Message.class,config,theUnsupportedActions);
		
		/*Configure CORS mapping*/
		cors.addMapping(config.getBasePath() + "/**")
			.allowedOriginPatterns(theAllowedOrigin); //Configure domain localhost:3000 (frontend) can call RestAPI
	
	
	}

	private void disableHttpMethods(Class theClass, RepositoryRestConfiguration config,
			HttpMethod[] theUnsupportedActions) {
		
		config.getExposureConfiguration()
			.forDomainType(theClass)
			.withItemExposure((metdata, httpMethods) 
					->httpMethods.disable(theUnsupportedActions))
			.withCollectionExposure((metdata,httpMethods)
					->httpMethods.disable(theUnsupportedActions));
		
	}
	
}
