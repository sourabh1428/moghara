import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Me = () => {
    const navigate=useNavigate();
    useEffect(()=>{
        navigate('/login');
    },[]);
 
    return (
    <div>Me</div>
  )
}

export default Me