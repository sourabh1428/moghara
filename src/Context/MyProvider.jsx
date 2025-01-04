import React, { createContext, useState } from "react";
import MyContext from "./MyContext";



const MyProvider = ({ children }) => {
    const [userName, setUserName] = useState("");
    const [customerName, setCustomerName] = useState('');
    const [logged, setLogged] = useState(false);
    const{supabaseUser,setSupabaseUser}=useState(null)  
    return (
      <MyContext.Provider value={{ supabaseUser,setSupabaseUser,setLogged,logged,userName, setUserName, customerName,setCustomerName }}>
        {children}
      </MyContext.Provider>
    );
  };
  
  export default MyProvider;