package com.roninleecode.springbootlibrary.dao;


import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestParam;

import com.roninleecode.springbootlibrary.entity.Book;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
	
	
	// Spring Boot sẽ hỗ trợ method lấy data từ Database
	// có dạng: find...By... , default API: ../search/find...By...? 
	// với @RequestParam(name="..") primitive datatype // nếu wrapper datatype phải overwrite bằng @Query
	
	//@RequestParam: ?title=... 
	//tên trong requestParam không quan trọng-> ưu tiên tên giống Class Entity
	Page<Book> findByTitleContaining(@RequestParam("title") String title, Pageable pageable); // pagealbe:thêm ?page=*&size=*
	Page<Book> findByCategory(@RequestParam("category") String category, Pageable pageable);
	
	//book là tên bảng trong database(không phải trong Book Entity)
	@Query("SELECT u FROM book u WHERE u.id IN (:book_ids)") // do SpringBoot không hiểu List<>Long BookIdList nên phải overwrite 
	List<Book> findBooksByIds(@Param("book_ids") List<Long> bookIdList);
}
