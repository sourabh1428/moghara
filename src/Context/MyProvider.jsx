import React, { createContext, useState } from "react";
import MyContext from "./MyContext";



const MyProvider = ({ children }) => {
    const [userName, setUserName] = useState("");
    const [customerName, setCustomerName] = useState('');
    const [logged, setLogged] = useState(false);
  
    return (
      <MyContext.Provider value={{ setLogged,logged,userName, setUserName, customerName,setCustomerName }}>
        {children}
      </MyContext.Provider>
    );
  };
  
  export default MyProvider;