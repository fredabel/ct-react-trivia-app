import { useState, useEffect } from 'react';

import Question from './Question';

function HomePage(){

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [categoryList, setCategoryLists] = useState([]);
    const [difficultyList, setDifficultyList] = useState(['easy', 'medium', 'hard']);
  

    const [formData, setFormData] = useState({
        firstName: '',
        category: '',
        difficulty: '',
    });

    //Handle onchange input
    const handleChange = (event) =>{
        const {name, value} = event.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }))
    }

    //Fetch category lists
    useEffect(() => {
        const fetchCategories = async () =>{
            
            const response = await fetch('https://opentdb.com/api_category.php');
            if(!response.ok){
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();
            setCategoryLists(data.trivia_categories);
        }
        fetchCategories()
    
    },[])

    //Form validation
    const validateForm = () => {
        //If fromData is missing
        if(!formData){
            setError('Form data is missing.');
            return false;
        }
        // Filter keys of fromData Object and store to the emptyFields variable
        const emptyFields = Object.keys(formData).filter((key) => 
            !formData[key]
        )

        //Check if there is empty fields
        if(emptyFields.length > 0){
            console.log(formData)
            setError('Oops! All fields are required!');
            return false;
        }
        setError('');
        return true;
    }
        

    //Handle submmision of form
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission

        if(!validateForm()) {
            return; // If validation fails, exit 
        }
        try {
            const response = await fetch(`https://opentdb.com/api.php?amount=1&category=${formData.category}&difficulty=${formData.difficulty}&type=multiple`);
            if (!response.ok) {
                throw new Error('Failed to fetch questions');
            }
            const data = await response.json();
            console.log(data);
            if(data){
                setQuestions(data.results);
                setLoading(false);
            }
           
        } catch (e) {
            setError(e);
            console.log(e);
        }
    }

    return (
        <div className="container">
            {
                questions.length > 0 ?
                    formData ?
                        <div className="card">
                            {
                                questions.length > 0 ?
                                questions.map((question, index) => (
                                    <Question data={question} key={index} formData={formData}/>
                                ))
                                : ''
                            }
                        </div>
                    : ''
                :  
                <div className="card">
                    <h2 className="text-center">Welcome to Trivia Questions</h2>
                    <p className="text-center text-muted">To start, enter your name, select a category and difficulty then click submit. Enjoy!</p>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="firstname">First name:</label>
                        <input
                            type="text"
                            name="firstName"
                            id="firstname"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Type your first name here"
                            className="w-100"
                        />
                            
                        <label htmlFor="category">Category</label>
                        <select
                            name="category"
                            id="category"
                            value={formData.category}
                            className="w-100"
                            onChange={handleChange} >
                                <option value="">Select Category</option>
                                {
                                    
                                    categoryList ? 
                                        categoryList.map((category) => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        ))
                                    : ''
                                }
                        </select>
                               
                        <label htmlFor="difficulty">Difficulty</label>
                        <select 
                        name="difficulty" 
                        id="difficulty"
                        value={formData.difficulty}
                        className=" w-100"
                        onChange={handleChange}>
                            <option value="">Select Difficulty</option>
                            {
                                difficultyList ?
                                    difficultyList.map((item, index) => (
                                        <option key={index} value={item}> {item}</option>
                                    )) 
                                : ''
                            }
                        </select>

                        <button type="submit" className="btn w-100 btn-primary">Submit</button>
                        {error ? <div className="error text-center">{error}</div> : ''}

                    </form>
                </div>
            }
           
      </div>

    )
}

export default HomePage