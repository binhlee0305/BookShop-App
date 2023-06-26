package com.roninleecode.springbootlibrary.requestmodels;

import java.util.Optional;

import lombok.Data;

// Class ReviewRequest: có dạng JSON: {rating:..., reviewDescription:...} 
//từ front-end gửi lên phải create dúng Class == backend
@Data
public class ReviewRequest {
	
	private double rating;
	
	private Long bookId;
	
	private Optional<String> reviewDescription; // optinal: not required data
	
	
	public ReviewRequest() {
		
	}

	public ReviewRequest(double rating, Long bookId, Optional<String> reviewDescription) {
		this.rating = rating;
		this.bookId = bookId;
		this.reviewDescription = reviewDescription;
	}

	public double getRating() {
		return rating;
	}

	public void setRating(double rating) {
		this.rating = rating;
	}

	public Long getBookId() {
		return bookId;
	}

	public void setBookId(Long bookId) {
		this.bookId = bookId;
	}

	public Optional<String> getReviewDescription() {
		return reviewDescription;
	}

	public void setReviewDescription(Optional<String> reviewDescription) {
		this.reviewDescription = reviewDescription;
	}
	
	
	
}
