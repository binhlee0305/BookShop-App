import { useOktaAuth } from "@okta/okta-react"
import { useEffect, useState } from "react";
import MessageModel from "../../../models/MessageModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";
import { AdminMessage } from "./AdminMessage";
import AdminMessageRequest from "../../../models/AdminMessageRequest";

export const AdminMessages = () => {

    const { authState } = useOktaAuth();


    //Normal Loading Pieces
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [httpError, setHttpError] = useState(null);


    //Messages Endpoint State
    const [messages, setMessages] = useState<MessageModel[]>([]);

    //Pagination
    const [messagesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    //Recall useEffect fetch question with closed == false
    const [btnSubmit, setBtnSubmit] = useState(false);



    useEffect(() => {

        const fetchUserMessages = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8080/api/messages/search/findByClosed?closed=false&page=${currentPage - 1}&size=${messagesPerPage}`;
                const requestOptions = {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        "Content-type": "application/json"
                    }
                }
                const messagesResponse = await fetch(url, requestOptions);

                if (!messagesResponse.ok) {
                    throw new Error("Somthing went wrong!!")
                }
                const messageResponseJson = await messagesResponse.json();

                setMessages(messageResponseJson._embedded.messages);
                setTotalPages(messageResponseJson.page.totalPages);

            }

            setIsLoadingMessages(false);
        }


        fetchUserMessages().catch(error => {
            setIsLoadingMessages(false);
            setHttpError(error.message);
        })

    }, [authState, currentPage, btnSubmit,messagesPerPage]);


    if (isLoadingMessages) {
        <SpinnerLoading />
    }

    if (httpError) {
        <div className="container m-5">
            <p>{httpError}</p>
        </div>
    }

    

    //Function call API to response Question
    async function submitResponseToQuestion(id: number, response: string) {
        const url = `http://localhost:8080/api/messages/secure/admin/message`;

        if (authState && authState.isAuthenticated && id != null && response.trim() !== "") {
            const messageAdminRequestModel: AdminMessageRequest = new AdminMessageRequest(id, response);
            
            const requestOptions = {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(messageAdminRequestModel)
            }
            const messageAdminRequestModelResponse = await fetch(url, requestOptions);

            if (!messageAdminRequestModelResponse.ok) {
                throw new Error("Something went wrong!!");
            }

            setBtnSubmit(!btnSubmit);
        }

    }

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    }

    return (
        <div className="mt-3">
            {messages.length > 0 ?
                <>
                    <h5>Pending Q/A: </h5>
                    {messages.map(message => (
                        <AdminMessage key={message.id}  message={message}  submitResponseToQuestion={submitResponseToQuestion} />
                    ))}
                </>
                :
                <h5>No pending Q/A</h5>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
        </div>
    );
}