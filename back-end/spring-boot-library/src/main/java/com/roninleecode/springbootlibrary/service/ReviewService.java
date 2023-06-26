package com.roninleecode.springbootlibrary.service;


import java.time.LocalDate;
import java.sql.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.roninleecode.springbootlibrary.dao.BookRepository;
import com.roninleecode.springbootlibrary.dao.ReviewRepository;
import com.roninleecode.springbootlibrary.entity.Review;
import com.roninleecode.springbootlibrary.requestmodels.ReviewRequest;

@Service
@Transactional
public class ReviewService {
	
	private BookRepository bookRepository;
	
	private ReviewRepository reviewRepository;

	@Autowired
	public ReviewService(BookRepository bookRepository, ReviewRepository reviewRepository) {
		
		this.bookRepository = bookRepository;
		this.reviewRepository = reviewRepository;
	}
	
	public void postReview (String userEmail, ReviewRequest reviewRequest) throws Exception {
		Review validateReview = reviewRepository.findByUserEmailAndBookId(userEmail, reviewRequest.getBookId());
		
		// 1 userEmail chỉ được review Book 1 lần
		if (validateReview != null) {
			throw new Exception("Review already created !!!");
		}
		
		Review review = new Review();
		review.setBookId(reviewRequest.getBookId());
		review.setRating(reviewRequest.getRating());
		review.setUserEmail(userEmail);
		
		if (reviewRequest.getReviewDescription().isPresent()) {
			
			review.setReviewDescription(reviewRequest.getReviewDescription().map(
						Object::toString
					).orElse(null));
			
		}
		
		review.setDate(Date.valueOf(LocalDate.now()));
		reviewRepository.save(review);
		
	}
	
	public Boolean userReviewListed(String userEmail, Long bookId) {
		
		Review validateReview = reviewRepository.findByUserEmailAndBookId(userEmail, bookId);
		
		if(validateReview != null) {
			return true;
		}else {
			return false;
		}
		
	}
	
	
	
}
