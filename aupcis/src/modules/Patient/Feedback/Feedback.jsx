export default function Feedback(){
    return(
        <div className="FeedbackProper">
            <div>
                <h1 className="FeedbackIntro">Write Your Feedback down below</h1>
                <input type="text"className="FeedbackInput"></input>
            </div>
            <div className="FeedbackBTN2">
                <button type="submit" className="FeedbackBTN">Submit</button>
            </div>
        </div>
    )
}