package com.roninleecode.springbootlibrary.dao;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable; // Pageable có 2 thư viện
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestParam;

import com.roninleecode.springbootlibrary.entity.History;

@Repository
public interface HistoryRepository extends JpaRepository<History,Long>{
	
	Page<History> findBooksByUserEmail(@RequestParam("userEmail") String userEmail, Pageable pageable);
}
