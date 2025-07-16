// client/src/App.js
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [msg, setMsg] = useState('Loading...');
  useEffect(() => {
    axios.get('http://localhost:5000/')
      .then(res => setMsg(res.data.message))
      .catch(() => setMsg('Error connecting to API'));
  }, []);
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">{msg}</h1>
    </div>
  );
}

export default App;
