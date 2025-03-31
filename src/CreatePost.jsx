// src/components/PokemonList.jsx
import { useState } from 'react';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

// Handle input change
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleBodyChange = (event) => {
    setBody(event.target.value);
  };

  // Form validation
  const validateForm = () => {
    if (title.trim() === '' || body.trim() === '') {
      setError('Both title and body are required');
      return false;
    }
    setError('');
    return true;
  };

// Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    if (!validateForm()) {
      return; // If validation fails, exit
    }

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'GET',
        body: JSON.stringify({
          title: title,
          body: body,
          userId: 1,
        }),
        headers: {
          'Content-type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const data = await response.json();

      setTitle('');  // Reset title
      setBody('');   // Reset body
      setSuccess(
        <div>
            <p>New Post Created Successfully:</p>
            ID: {data.id}<br/>
            Title: {data.title}<br/>
            Body: {data.body}
        </div>
      );
    } catch (e) {
      setError(e.message);
    }
  };

/*********** added code starts here ***********/
return (
    <div>
      <h1>Create New Post</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label><br/>
          <input
            type="text"
						id="title"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter post title"
          />
        </div>
        <div>
          <label htmlFor="body">Body:</label><br/>
          <textarea
						id="body"
            value={body}
            onChange={handleBodyChange}
            placeholder="Enter post content"
          />
        </div><br/>
        <button type="submit">Create Post</button>
      </form>

      {/* Display validation error or success message */}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
    </div>
  );
/*********** added code stops here ***********/

}

export default CreatePost;