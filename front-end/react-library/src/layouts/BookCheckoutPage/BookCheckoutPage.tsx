import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import ReviewModel from "../../models/ReviewModel";
import { LatestReviews } from "./LatestReviews";
import { useOktaAuth } from "@okta/okta-react";
import ReviewRequestModel from "../../models/ReviewRequestModel";

export const BookCheckoutPage = () => {

    const { authState } = useOktaAuth();

    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    const bookId = (window.location.pathname).split('/')[2]; // type : string, nên không dùng trong checkout model

    //Review state
    const [review, setReview] = useState<ReviewModel[]>([]);
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

    const [isReviewLeft, setIsReviewLeft] = useState(false);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

    //Loans Count State
    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true);

    //is Book Check out ?
    const [isCheckedOut, setIsCheckedOut] = useState(false);
    const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true);

    //Fetch Book useEffect
    useEffect(() => {
        const fetchBook = async () => {
            const baseUrl: string = `http://localhost:8080/api/books/${bookId}`;

            const response = await fetch(baseUrl);
            if (!response.ok) {
                throw new Error('Somthing went wrong');
            }
            const responseJson = await response.json();

            const loadedBooks: BookModel = {
                id: responseJson.id,
                title: responseJson.title,
                author: responseJson.author,
                description: responseJson.description,
                copies: responseJson.copies,
                copiesAvailable: responseJson.copiesAvailable,
                category: responseJson.category,
                img: responseJson.img,
            };

            setBook(loadedBooks);
            setIsLoading(false);
        };
        fetchBook().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [isCheckedOut, bookId])

    //Fetch Review useEffect
    useEffect(() => {
        const fetchBookReviews = async () => {
            const reviewUrl: string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}`;

            const responseReviews = await fetch(reviewUrl);

            if (!responseReviews.ok) {
                throw new Error('Something went wrong !!')
            }

            const responseJsonReviews = await responseReviews.json();

            const responseData = responseJsonReviews._embedded.reviews;

            const loadedReviews: ReviewModel[] = [];

            let weightedStarReviews: number = 0;

            for (const key in responseData) {
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    book_id: responseData[key].bookId,
                    reviewDescription: responseData[key].reviewDescription
                })
                weightedStarReviews = weightedStarReviews + responseData[key].rating;
            }

            if (loadedReviews) {
                const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2).toFixed(1);
                setTotalStars(Number(round));
            }

            setReview(loadedReviews);
            setIsLoadingReview(false);
        };
        fetchBookReviews().catch((error) => {
            setIsLoadingReview(false);
            setHttpError(error.message);
        })
    }, [isReviewLeft])

    //Fetch is User left Review or not ?
    useEffect(() => {

        const fetUserReviewBook = async () => {

            if (authState && authState.isAuthenticated) {

                const url = `http://localhost:8080/api/reviews/secure/user/book?bookId=${bookId}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'content-type': "application/json"
                    }
                }
                const userReview = await fetch(url, requestOptions);

                if (!userReview.ok) {
                    throw new Error("Something went wrong!!");
                }

                const userReviewResponseJson = await userReview.json();

                setIsReviewLeft(userReviewResponseJson);
            }

            setIsLoadingUserReview(false);
        }

        fetUserReviewBook().catch(error => {
            setIsLoadingUserReview(false);
            setHttpError(error.message);
        })


    }, [authState])

    //Fetch currentLoans useEffect
    useEffect(() => {
        const fetchUserCurrentLoansCount = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8080/api/books/secure/currentloans/count`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'content-type': 'application/json'
                    }
                };
                const currentLoansCountResponse = await fetch(url, requestOptions); // return int books (số lượng books)

                if (!currentLoansCountResponse.ok) {
                    throw new Error("Somthing went wrong !!");
                }
                const currentLoansCountResponseJson = await currentLoansCountResponse.json(); // parse json 


                setCurrentLoansCount(currentLoansCountResponseJson);

            }
            setIsLoadingCurrentLoansCount(false);
        }
        fetchUserCurrentLoansCount().catch((error: any) => {
            setIsLoadingCurrentLoansCount(false);
            setHttpError(error.message);
        })
    }, [authState, isCheckedOut])

    //Fetch book is Checked out?
    useEffect(() => {
        const fetchUserCheckedOutBook = async () => {

            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8080/api/books/secure/ischeckedout/byuser?bookId=${bookId}`;
                const requestOptions = {
                    method: "GET",
                    headers: {
                        Authorization: `bearer ${authState.accessToken?.accessToken}`,
                        "content-type": "application/json"
                    }
                }

                const bookCheckedOut = await fetch(url, requestOptions);
                if (!bookCheckedOut.ok) {
                    throw new Error("Something went wrong!!");
                }
                const bookCheckedOutResponseJson = await bookCheckedOut.json();
                setIsCheckedOut(bookCheckedOutResponseJson);

            }
            setIsLoadingBookCheckedOut(false);
        }
        fetchUserCheckedOutBook().catch((error) => {
            setIsLoadingBookCheckedOut(false);
            setHttpError(error.message);
        })

    }, [authState])


    if (isLoading || isLoadingReview || isLoadingCurrentLoansCount || isLoadingBookCheckedOut || isLoadingUserReview) {
        return (
            <SpinnerLoading />
        );
    }

    if (httpError) {
        return (
            <div className="container">
                <p>{httpError}</p>
            </div>
        );
    }

    //Submit checkoutBook when click on Submit button Checkout
    async function checkoutBook() {
        const url = `http://localhost:8080/api/books/secure/checkout?bookId=${book?.id}`;
        const requestOptions = {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                "content-type": "application/json"
            }
        }
        const checkoutBookResponse = await fetch(url, requestOptions);
        if (!checkoutBookResponse.ok) {
            throw new Error("Something went wrong!!");
        }
        setIsCheckedOut(true);
    }

    // Submit review call when click on Submit button review
    async function submitReview(starInput:number, reviewDesciption: string) {
        let bookId: number = 0;
        
        if (book?.id) {
            bookId = book?.id;
        }

        const reviewRequestModel = new ReviewRequestModel(starInput, bookId, reviewDesciption);
        
        const url = `http://localhost:8080/api/reviews/secure`; // phải chính xác từng dấu "/"
        const requestOptions = {
            method: "POST",
            headers:{
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-type': 'application/json'
            },
            body: JSON.stringify(reviewRequestModel)
        };
        const returnResponse = await fetch(url, requestOptions);
        
        if(!returnResponse.ok) {
            throw new Error('Something went wrong !!!');
        }

        setIsReviewLeft(true);

    }

    return (
        <div>
            {/* d-none d-lg-block: hidden all element except large size (type block) */}
            <div className="container d-none d-lg-block">
                <div className="row mt-5">
                    <div className="col-sm-2 col-md-2">
                        {book?.img ?
                            <img src={book?.img} width='226' height='349' alt="Book" />
                            :
                            <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226' height='349' alt="Book"/>
                        }
                    </div>

                    <div className="col-4 col-md-4 container">
                        <div className="ml-2">
                            <h2>{book?.title}</h2>
                            <h5 className="text-primary">{book?.author}</h5>
                            <p className="lead">{book?.description}</p>
                            <StarsReview rating={totalStars} size={32} />
                        </div>
                    </div>
                    <CheckoutAndReviewBox book={book} mobile={false} currentLoansCount={currentLoansCount}
                        isAuthenticated={authState?.isAuthenticated}
                        isCheckedOut={isCheckedOut} checkoutBook={checkoutBook}
                        isReviewLeft={isReviewLeft}  submitReview={submitReview}/>

                </div>


                <hr />
                <LatestReviews reviews={review} bookId={book?.id} mobile={false} />
            </div>
            {/* Mobile type : d-flex means all elements in one line*/}
            <div className="container d-lg-none mt-5">
                <div className="d-flex justify-content-center align-items-center">
                    {book?.img ?
                        <img src={book?.img} width='226' height='349' alt="Book" />
                        :
                        <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226' height='349' alt="Book"/>
                    }
                </div>

                <div className="mt-4">
                    <div className="ml-2">
                        <h2>{book?.title}</h2>
                        <h5 className="text-primary">{book?.author}</h5>
                        <p className="lead">{book?.description}</p>
                        <StarsReview rating={totalStars} size={32} />
                    </div>
                </div>

                <CheckoutAndReviewBox book={book} mobile={true} currentLoansCount={currentLoansCount}
                    isAuthenticated={authState?.isAuthenticated} 
                    isCheckedOut={isCheckedOut} checkoutBook={checkoutBook} 
                    isReviewLeft={isReviewLeft} submitReview={submitReview}/>
                <hr />
                <LatestReviews reviews={review} bookId={book?.id} mobile={true} />
            </div>

        </div>
    );
}