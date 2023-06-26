import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import MessageModel from "../../../models/MessageModel";

export const PostNewMessage = () => {

    const { authState } = useOktaAuth();
    const [title, setTitle] = useState('');
    const [question, setQuestion] = useState('');
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    //Function call POST API post message
    async function submitNewQuestion() {
        const url = `http://localhost:8080/api/messages/secure/add/message`;

        if (authState && authState.isAuthenticated && title.trim() !== '' && question.trim() !== '') {
            const messageRequestModel = new MessageModel(title, question);
            console.log(messageRequestModel);
            
            const requestOptions = {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    'Content-type': "application/json"
                },
                body: JSON.stringify(messageRequestModel)
            }
            const messageRequestModelResponse = await fetch(url, requestOptions);

            if (!messageRequestModelResponse.ok) {
                throw new Error("Something went wrong!")
            }
            setTitle('');
            setQuestion('');
            setDisplaySuccess(true);
            setDisplayWarning(false);

        } else {

            setDisplaySuccess(false);
            setDisplayWarning(true);

        }
    }


    return (
        <div className="card mt-3">

            <div className="card-header">
                Ask question to Ronin&Lee Read Admin
            </div>
            <div className="card-body">

                <form method="POST" >

                    {displaySuccess &&
                        <div className="alert alert-success" role="alert">
                            Question added successfully
                        </div>
                    }
                    {displayWarning &&
                        <div className="alert alert-danger" role="alert">
                            All fields must be filled out
                        </div>
                    }

                    <div className="mb-3">
                        <label className="form-label">
                            Title
                        </label>
                        <input type="text" className="form-control" id="exampleFormControlInput1"
                            placeholder="Title" onChange={(e) => setTitle(e.target.value)} value={title} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">
                            Question
                        </label>
                        <textarea className="form-control" id="exampleFormControlTextarea1"
                            rows={3} onChange={(e) => setQuestion(e.target.value)} value={question} />
                    </div>
                    <div>
                        <button onClick={() => submitNewQuestion()} type="button" className="btn btn-primary mt-3">
                            Submit question
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );

}