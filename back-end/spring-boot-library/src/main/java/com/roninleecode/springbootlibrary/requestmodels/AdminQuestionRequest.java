package com.roninleecode.springbootlibrary.requestmodels;

import lombok.Data;

//Class AdminQuestionRequest: nhận response cho Message Entity
// từ phía client gửi lên Server
@Data
public class AdminQuestionRequest {
	
	private Long id;
	
	private String response;

	public AdminQuestionRequest() {
		
	}
	
	public AdminQuestionRequest(Long id, String response) {
		
		this.id = id;
		this.response = response;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getResponse() {
		return response;
	}
	public void setResponse(String response) {
		this.response = response;
	}
	
	
}
