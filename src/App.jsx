import { useContext, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Nav/NavBar"; // Import the Navbar component
import ProductType from "./Components/ProductType/ProductType";
import Products from "./Components/Products/Products";
import Receipt from "./Components/Reciept/Reciept";
import LoginPage from "./Auth/LoginPage";
import MyContext from "./Context/MyContext";

function App() {
  const {logged}=useContext(MyContext);

  const sampleProducts = [
    { id: "1", description: "Product A", quantity: 2 },
    { id: "2", description: "Product B", quantity: 1 },
    { id: "3", description: "Product C", quantity: 3 },
  ];

  return (
    <div>
      {/* Navbar appears only if the user is logged in */}
      {logged && <Navbar />}

      <Routes>
        <Route
          path="/Product-Type"
          element={<ProductType />}
        />
        <Route path="/Products" element={<Products />} />
        <Route
          path="/Receipt"
          element={<Receipt customerName="John Doe" products={sampleProducts} />}
        />
        <Route
          path="/login"
          element={<LoginPage/>}
        />
      </Routes>
    </div>
  );
}

export default App;
