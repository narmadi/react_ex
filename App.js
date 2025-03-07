import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginForm } from './LoginForm/LoginForm';
import { RegistrationForm } from "./RegistrationForm/RegistrationForm";
import { Profile } from './Profile/Profile';
import { LogoutPage } from "./LogoutPage/LogoutPage.js";
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/profile/view/:id/*" element={<Profile />} />
          <Route path="/profile/edit/:id/*" element={<Profile />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="*" element={<LogoutPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;