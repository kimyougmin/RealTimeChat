import React from 'react';
import './App.css';
import LoginScreen from "./loginScreen/LoginScreen";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import SignUpScreen from "./signUpScreen/SignUpScreen";
import MainScreen from "./mainScreen/MainScreen";

function App() {
  return (
    <div className="App">
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<LoginScreen />}/>
                <Route path={"/signupScreen"} element={<SignUpScreen />}/>
                <Route path={"/mainScreen"} element={<MainScreen />}/>
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
