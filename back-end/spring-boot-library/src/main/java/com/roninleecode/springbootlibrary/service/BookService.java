package com.roninleecode.springbootlibrary.service;



import java.util.Date;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.ArrayList;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.roninleecode.springbootlibrary.dao.BookRepository;
import com.roninleecode.springbootlibrary.dao.CheckoutRepository;
import com.roninleecode.springbootlibrary.dao.HistoryRepository;
import com.roninleecode.springbootlibrary.entity.Book;
import com.roninleecode.springbootlibrary.entity.Checkout;
import com.roninleecode.springbootlibrary.entity.History;
import com.roninleecode.springbootlibrary.responsemodels.ShelfCurrentLoansResponse;


@Service
@Transactional
public class BookService {
	
	private BookRepository bookRepository;
	
	private CheckoutRepository checkoutRepository;
	
	private HistoryRepository historyRepository;
	
	public BookService(BookRepository bookRepository, CheckoutRepository checkoutRepository, HistoryRepository historyRepository) {
		
		this.bookRepository = bookRepository;
		this.checkoutRepository = checkoutRepository;
		this.historyRepository = historyRepository;
	}
	
	public Book checkoutBook(String userEmail, Long bookId) throws Exception{
		
		Optional<Book> book = bookRepository.findById(bookId);
		
		//validateCheckout : để chắc chắn 1 người chỉ được checkout 1 lần
		Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
		
		if (!book.isPresent() || validateCheckout != null || book.get().getCopiesAvailable() <= 0) {
			throw new Exception("Book doesn't exist or already checked out by user");
		}
		
		book.get().setCopiesAvailable(book.get().getCopiesAvailable() -1);
		
		bookRepository.save(book.get());
		
		Checkout checkout = new Checkout(
				userEmail,
				LocalDate.now().toString(),
				LocalDate.now().plusDays(7).toString(),//expired book after 7 days
				book.get().getId());
		
		checkoutRepository.save(checkout);
		
		return book.get();
	}
	
	public Boolean checkoutBookByUser(String userEmail, Long bookId) {
		
		Checkout validCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
		if (validCheckout != null) {
			return true;
		}else {
			return false;
		}
	}
	
	public int currentLoansCount (String userEmail) {
		
		return checkoutRepository.findBooksByUserEmail(userEmail).size();
	}
	
	public List<ShelfCurrentLoansResponse> currentLoans(String userEmail) throws Exception{
		List<ShelfCurrentLoansResponse> shelfCurrentLoansResponseList = new ArrayList<>();
		
		List<Checkout> checkoutList = checkoutRepository.findBooksByUserEmail(userEmail);
		
		List<Long> bookIdList = new ArrayList<>();
		
		for (Checkout checkout : checkoutList) {
			bookIdList.add(checkout.getBookId());
		}
		
		List<Book> books = bookRepository.findBooksByIds(bookIdList);
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		
		//Tìm book match with Checkout
		for(Book book : books) {
			
			//Optional: Checkout có thể sẽ không tồn tại do checkoutList có thể ko tồn tại
			Optional<Checkout> checkout = checkoutList.stream()
					.filter(x-> x.getBookId() == book.getId()).findFirst();
			
			if(checkout.isPresent()) {
				
				//parse(text->Date)
				Date d1 = sdf.parse(checkout.get().getReturnDate());
				
				Date d2 = sdf.parse(LocalDate.now().toString());
				
				//Timeunit: chuyển đơn vị thời gian sang DAYS
				TimeUnit time = TimeUnit.DAYS;
				
				//d1.getTime(), d1.getTime(): lấy thời gian từ since 1970 (MILISECONDS)-> tìm khoảng cách giữa 2 mốc thời gian để covert sang DAYS
				long difference_In_Time= time.convert(d1.getTime() - d2.getTime(), TimeUnit.MILLISECONDS); // TimeUnit.MILISECONDS: đơn vị first param
				
				shelfCurrentLoansResponseList.add(new ShelfCurrentLoansResponse(book, (int) difference_In_Time));
			}
		}
		
		return shelfCurrentLoansResponseList;
	}
	
	public void returnBook (String userEmail, Long bookId) throws Exception {
		
		//findByID(): truyen vao primary key
		Optional<Book> book = bookRepository.findById(bookId); // lấy từ book từ database xuống
		
		Checkout valiCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
		
		
		if(!book.isPresent() || valiCheckout == null) {
			throw new Exception("Book doesn't exist or not checkout by user");
		}
		
		book.get().setCopiesAvailable(book.get().getCopiesAvailable()+1); // update dữ liệu book
		
		bookRepository.save(book.get()); // gửi lên lại database.
		
		//deleteById: phải truyền vào primarykey
		checkoutRepository.deleteById(valiCheckout.getId());
		
		//Lưu lịch sử sau khi return book;
		History history = new History(
				userEmail,  
				valiCheckout.getCheckoutDate(), 
				LocalDate.now().toString(),
				book.get().getTitle(), 
				book.get().getAuthor(),
				book.get().getDescription(), 
				book.get().getImg());
		
		historyRepository.save(history);
		
	}
	
	//Gia hạn thời gian mượn sách thêm 7 ngày
	public void renewLoan(String userEmail, Long bookId) throws Exception {
		 Checkout valiCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
		 
		 if(valiCheckout == null) {
			 throw new Exception("Book does not exist or not checkout out by user");
			 
		 }
		 SimpleDateFormat sdFormat = new SimpleDateFormat("yyyy-MM-dd");
		 
		 Date d1 = sdFormat.parse(valiCheckout.getReturnDate());
		 Date d2 = sdFormat.parse(LocalDate.now().toString());
		 
		 if(d1.compareTo(d2) > 0 || d1.compareTo(d2) == 0) {
			 valiCheckout.setReturnDate(LocalDate.now().plusDays(7).toString());
			 checkoutRepository.save(valiCheckout);
		 }
	}
	

}
