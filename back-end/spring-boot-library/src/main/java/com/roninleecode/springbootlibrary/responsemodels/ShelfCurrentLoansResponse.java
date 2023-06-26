package com.roninleecode.springbootlibrary.responsemodels;

import com.roninleecode.springbootlibrary.entity.Book;

import lombok.Data;

//ShelfCurrentLoansResponse: dạng json format {book:.., daysLeft:...} từ backend trả về front-end
//frontend phải tạo class giống để nhận data từ Backend
@Data
public class ShelfCurrentLoansResponse {
	
	private Book book;
	private int daysLeft;
	public ShelfCurrentLoansResponse(Book book, int daysLeft) {
		
		this.book = book;
		this.daysLeft = daysLeft;
	}
	public Book getBook() {
		return book;
	}
	public void setBook(Book book) {
		this.book = book;
	}
	public int getDaysLeft() {
		return daysLeft;
	}
	public void setDaysLeft(int daysLeft) {
		this.daysLeft = daysLeft;
	}
	
	
	
}
