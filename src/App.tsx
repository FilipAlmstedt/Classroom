import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './Scss/App.scss';
import { LandingPage } from './components/LandingPage';
import { Navbar } from './components/Layouts/Navbar';
import { Footer } from './components/Layouts/Footer';
import { Login } from "./components/Authentication/Login";
import { CreateNewAccount } from "./components/Authentication/CreateNewAccount";
import { ForgotPassword } from "./components/Authentication/ForgotPassword";
import { ResetPassword } from "./components/Authentication/ResetPassword";
import { CreateNewPost } from "./components/Posts/CreateNewPost";
import { EditPost } from "./components/Posts/EditPost";
import { AcceptOrDecline } from "./components/Posts/AcceptOrDecline";


function App() {

  
  return (
    <>
      <div className="App">
        <Router>
         
          <Navbar></Navbar>

          <Routes>

            <Route path="/" element={<LandingPage/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<CreateNewAccount/>} />
            <Route path="/forgot" element={<ForgotPassword/>} />
            <Route path="/reset-password" element={<ResetPassword/>} />
            <Route path="/create-new-post" element={<CreateNewPost/>} />
            <Route path="/edit-post/:id" element={<EditPost/>} /> 
            <Route path="/accept-or-decline/:id" element={<AcceptOrDecline/>} />

          </Routes>

          <Footer></Footer>

        </Router>
      </div>
    </>
  );
  
}

export default App;
