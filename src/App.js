import './App.css';

import React, { useState } from 'react';
import axios from 'axios'; // Corrected the import statement

function App() {
  const [data, setUserData] = useState([]);
  const [userid, setUserId] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const updateUserId = (event) => {
    setUserId(event.target.value);
  };

  const updateEmail = (event) => {
    setEmail(event.target.value);
  };

  const updatePassword = (event) => {
    setPassword(event.target.value);
  };

  const insertUsers = (event) => {
    event.preventDefault(); // Prevent form submission and page reload

    axios.post('http://localhost:9901/insert', { userid:userid, emailid:email, password:password})
      .then((response) => {
        // Handle the response as needed
        console.log(response.data);
        // Clear input fields
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  function fetchdata() {
    axios.get('http://localhost:9901/getAll')
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  

  function clear(){
    setUserId('');
    setPassword('');
    setEmail('');
  }

  const modify = (event) => {
    event.preventDefault();
    axios.put('http://localhost:9901/update', { userid:userid, emailid:email, password:password})
      .then((response) => {
        // Handle the response as needed
        console.log(response.data);
        // Clear input fields
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const remove = (event) => {
    event.preventDefault();
    axios.post('http://localhost:9901/delete', { userid:userid})
      .then((response) => {
        // Handle the response as needed
        console.log(response.data);
        // Clear input fields
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  return (
    <div className="App">
      <div className="Form">
      <form onSubmit={insertUsers} onReset={clear}>
        <table>
          <tr>
            <th>User ID</th>
            <td colSpan={4}><input type="text" value={userid} onChange={updateUserId} /></td>
          </tr>
          <tr>
            <th>Password</th>
            <td colSpan={4}><input type="password" value={password} onChange={updatePassword} /></td>
          </tr>
          <tr>
            <th>Email ID</th>
            <td colSpan={4}><input type="text" value={email} onChange={updateEmail} /></td>
          </tr>
          <tr>
            <td><button type="submit">Add</button></td>
            <td><button type="reset">Reset</button></td>
            <td><button type="button" onClick={modify}>Modify</button></td>
            <td><button type="delete" onClick={remove}>Remove</button></td>
            <td><button type="button" onClick={fetchdata}>Show</button></td>
          </tr>
        </table>
      </form>
      </div><br/>
      <div className='result'>
        <table>
          <tr>
            <th>ID</th>
            <th>Password</th>
            <th>Email</th>
          </tr>
          {data.map((item) => (
            <tr key={item.userid}><td>{item.userid}</td><td>{item.password}</td><td>{item.emailid}</td></tr>
          ))}
        </table>
      </div>
    </div>
  );
}

export default App;