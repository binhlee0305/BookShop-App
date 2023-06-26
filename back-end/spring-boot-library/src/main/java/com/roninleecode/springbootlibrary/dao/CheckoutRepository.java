package com.roninleecode.springbootlibrary.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.roninleecode.springbootlibrary.entity.Checkout;

@Repository
public interface CheckoutRepository extends JpaRepository<Checkout, Long>{
	
	Checkout findByUserEmailAndBookId(String userEmail, Long bookId);

	List<Checkout> findBooksByUserEmail(String userEmail);
	
	
	//@Modifying annotation is used to enhance the @Query annotation 
	//so that we can execute not only SELECT queries, but also INSERT, UPDATE, DELETE, and even DDL queries
	@Modifying
	@Query("delete from checkout where book_id in :book_id")
	void deleteAllByBookId(@Param("book_id") Long bookId);
	
}
