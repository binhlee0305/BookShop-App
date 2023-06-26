import { useOktaAuth } from "@okta/okta-react"
import { useState } from "react";
import { Redirect } from "react-router";
import { AdminMessages } from "./components/AdminMessages";
import { AddNewBook } from "./components/AddNewBook";
import { ChangeQuantityOfBooks } from "./components/ChangeQuantityOfBooks";

export const ManageLibraryPage = () => {

    const { authState } = useOktaAuth();

    const [changeQuantityOfBooksClick, setChangeQuantityOfBooksClick] = useState(false);
    const [messageClick, setMessageClick] = useState(false);

    const addBookClickFunction =() => {
        setChangeQuantityOfBooksClick(false);
        setMessageClick(false);
    }

    const changeQuantityOfBooksClickFunction =() => {
        setChangeQuantityOfBooksClick(true);
        setMessageClick(false);
    }

    const messageClickFunction = () =>{
        setChangeQuantityOfBooksClick(false);
        setMessageClick(true);
    }

    // Nếu userType ko tồn tại = không phải admin
    if (authState?.accessToken?.claims.userType === undefined) {
        return <Redirect to="/home"></Redirect>;
    }

    return (
        <div className="container">
            <div className="mt-5">
                <h3>Manage Library</h3>
                <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <button onClick={addBookClickFunction} className="nav-link active" id="nav-add-book-tab" data-bs-toggle='tab'
                            data-bs-target="#nav-add-book" type="button" role="tab" aria-controls="nav-add-book"
                            aria-selected="false">
                            Add new book
                        </button>
                        <button onClick={changeQuantityOfBooksClickFunction} className="nav-link" id="nav-quantity-tab" data-bs-toggle='tab'
                            data-bs-target="#nav-quantity" type="button" role="tab" aria-controls="nav-quantity"
                            aira-selected='true'>
                            Change quantity
                        </button>
                        <button onClick={messageClickFunction} className="nav-link" id="nav-messages-tab" data-bs-toggle='tab'
                            data-bs-target="#nav-messages" type="button" role="tab" aria-controls="nav-messages"
                            aria-selected="false">
                            Messages
                        </button>
                    </div>
                </nav>

                <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="nav-add-book" role="tabpanel"
                        aria-labelledby="nav-add-book-tab">
                        {/* {!changeQuantityOfBooksClick && !messageClick ? <AddNewBook/> :<></>}
                         */}
                        <AddNewBook/>
                    </div>

                    <div className="tab-pane fade" id="nav-quantity" role="tabpanel"
                        aria-labelledby="nav-quantity">
                        {changeQuantityOfBooksClick && <ChangeQuantityOfBooks/>}
                    </div>

                    <div className="tab-pane fade" id="nav-messages" role="tabpanel"
                        aria-labelledby="nav-messages">
                        {messageClick && <AdminMessages/>}
                    </div>
                </div>

            </div>
        </div>
    );
}