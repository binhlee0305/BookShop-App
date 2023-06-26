import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import HistoryModel from "../../../models/HistoryModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Link } from "react-router-dom";
import { Pagination } from "../../Utils/Pagination";

export const HistoryPage = () => {

    const { authState } = useOktaAuth();
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [httpError, setHttpError] = useState(null);

    //Histories
    const [histories, setHistories] = useState<HistoryModel[]>([]);

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPages] = useState(0);

    useEffect(() => {

        const fetchUserHistory = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8080/api/histories/search/findBooksByUserEmail?userEmail=${authState.accessToken?.claims.sub}&page=${currentPage - 1}&size=3`

                const requestOptions = {
                    method: "GET",
                    header: {
                        'Content-type': 'application/json'
                    }
                }

                const historyResponse = await fetch(url, requestOptions);

                if (!historyResponse.ok) {
                    throw new Error('Something went wrong!!');
                }
                const historyResponseJson = await historyResponse.json();

                //truyền giá trị trực tiếp không cần phải từ khóa new HistoryModel(...) giống JAVA
                setHistories(historyResponseJson._embedded.histories);
                
                setTotalPages(historyResponseJson.page.totalPages);

            }
            setIsLoadingHistory(false);
        }

        fetchUserHistory().catch((error: any) => {
            setIsLoadingHistory(false);
            setHttpError(error.message);
        })

    }, [authState, currentPage])

    if (isLoadingHistory) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    }

    return (
        <div className="mt-2">
            {histories.length > 0 ?
                <>
                    <h5>Recent History:</h5>
                    {histories.map(history => (
                        <div key={history.id}>
                            <div className="card mt-3 shadow p-3 mb-3 bg-body round">
                                <div className="row g-0">
                                    <div className="col-md-2">
                                        <div className="d-none d-lg-block">
                                            {history.img ?
                                                <img src={history.img} width='123' height='196' alt="book" />
                                                :
                                                <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')} width="123" height='196'
                                                    alt="book" />
                                            }
                                        </div>
                                        <div className="d-lg-none d-flex justify-content-center align-items-center">
                                            {history.img ?
                                                <img src={history.img} width='123' height='196' alt="book" />
                                                :
                                                <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')} width="123" height='196'
                                                    alt="book" />
                                            }
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="card-body">
                                            <h5 className="card-tille">
                                                {history.author}
                                            </h5>
                                            <p className="card-text">{history.description}</p>
                                            <hr />
                                            <p className="card-text">Checked out on: {history.checkoutDate}</p>
                                            <p className="card-text">Returned on: {history.returnedDate}</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))}
                </>
                :
                <>
                    <h3 className="mt-3">Currently no history: </h3>
                    < Link className="btn btn-primary" to={`search`}>Search for new book
                    </Link>
                </>
            }
            {totalPage > 1 && <Pagination currentPage={currentPage} totalPages={totalPage} paginate={paginate}/>}
        </div>
    );
}