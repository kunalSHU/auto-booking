import React, { useEffect, useState } from 'react';
import './App.css';
import { callNodeHelloWorld } from './apiServer/api';

const App: React.FC = () => {
  
  const [nodeResponse, setNodeResponse] = useState("");
  
  useEffect(() => {
    testApiCall();
  },[]);
  
  const testApiCall = async () => {
    let response = await callNodeHelloWorld();
    setNodeResponse(response?.data.message);
  }

  return (
    <div>Sample result from api: {nodeResponse}</div>
  )
}

export default App;
