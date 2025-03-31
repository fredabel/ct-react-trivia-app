
import { useEffect, useState } from 'react';

function Question({data, formData}){
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [error, setError] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [answered, setAnswered] = useState(0);
    const [allOptions,setAllOptions] = useState()

    useEffect(() => {
        setCorrectAnswer(data.correct_answer);
    
        // Create a copy of the incorrect answers array
        const options = [...data.incorrect_answers];
    
        // Generate a random index to insert the correct answer
        const randomIndex = Math.floor(Math.random() * (options.length + 1));
    
        // Insert the correct answer at the random index
        options.splice(randomIndex, 0, data.correct_answer);
    
        // Set the allOptions state with the randomized array
        setAllOptions(options);
    }, [data]);

    const decodeHtmlEntities = (text) => {
        const parser = new DOMParser().parseFromString(text, "text/html");
        return parser.body.textContent;
    };

    const handleAnswer = (event) => {
        setSelectedAnswer(event.target.value);
        setError('') //clear error message
    }

    const handleSubmitAnswer = (event) => {
        event.preventDefault();
        if(!validateAnswerForm()){
            return;
        }
        setAnswered(1)
    }
    const handleReloadPAge = () => {
        window.location.reload()
    }

    const validateAnswerForm = () => {
        if (selectedAnswer.trim() === '') {
            setError('Please select an answer');
            return false;
        }
        setError('');
        return true;
    }

    return(
        <div>
            {
                !answered ? 
                    <form onSubmit={handleSubmitAnswer}>
                
                        <h3>Question: {decodeHtmlEntities(data.question)}</h3>
                        <div className="m-b-10">
                            {/* <input type="radio" name="answer" value={decodeHtmlEntities(data.correct_answer)} onClick={handleAnswer} />
                            {decodeHtmlEntities(data.correct_answer)} */}

                            {
                                allOptions && allOptions.map((answer, index) => (
                                    <div key={index} >
                                        <input  type="radio" name="answer" value={decodeHtmlEntities(answer)} id={decodeHtmlEntities(answer)} onClick={handleAnswer} />
                                        <label htmlFor={decodeHtmlEntities(answer)}>{decodeHtmlEntities(answer)}</label> 
                                    </div>
                                ))
                            }
                        </div>
                        <button type="submit" className="w-100 btn">Submit</button>
                        {error ? <div className="error text-center">{error}</div> : ''}
                    </form>
                : 
                    <div >
                        {
                            selectedAnswer == correctAnswer ? 
                                <div>
                                    <h3> {formData.firstName} your answer is <span className="text-success">correct!</span></h3>  Click start over to start again. 
                                </div>
                            : 
                            <div>
                                <h3>{formData.firstName} your answer is <span className="text-danger">wrong!</span></h3>
                                <p>The correct answer is:   <b className="text-success">{correctAnswer}</b></p>
                            </div>
                        }
                        <button type="button" className="btn w-100 btn-primary" onClick={handleReloadPAge}>Start Over</button>

                    </div>
            }
        </div>
    )
}
export default Question;