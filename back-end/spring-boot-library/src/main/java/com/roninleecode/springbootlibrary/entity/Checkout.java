package com.roninleecode.springbootlibrary.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Entity(name = "checkout")
@Table(name = "checkout")
@Data
public class Checkout {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name="user_email")
	String userEmail;
	
	@Column(name="checkout_date")
	String checkoutDate;
	
	@Column(name = "return_date")
	String returnDate;
	
	@Column(name="book_id")
	Long bookId;
	
	
	public Checkout() {
		
	}
	public Checkout(String userEmail, String checkoutDate, String returnDate, Long bookId) {
		this.userEmail = userEmail;
		this.checkoutDate = checkoutDate;
		this.returnDate = returnDate;
		this.bookId = bookId;
	}
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getUserEmail() {
		return userEmail;
	}
	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}
	public String getCheckoutDate() {
		return checkoutDate;
	}
	public void setCheckoutDate(String checkoutDate) {
		this.checkoutDate = checkoutDate;
	}
	public String getReturnDate() {
		return returnDate;
	}
	public void setReturnDate(String returnDate) {
		this.returnDate = returnDate;
	}
	public Long getBookId() {
		return bookId;
	}
	public void setBookId(Long bookId) {
		this.bookId = bookId;
	}
	
	
}