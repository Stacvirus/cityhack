
import { Routes, Route } from "react-router-dom";
import Details from "./pages/details";
import Favorites from "./pages/favorites";
import Header from "./components/header";
import Banner from "./components/banner";
import Home from "./pages/home";
import Hackatons from "./pages/hackatons";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/profile";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/sign-up";

function App() {
  return (
    <div>
        <Banner />
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hackatons" element={<Hackatons />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />

          <Route path="/sign-up" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/recipe-item/:id" element={<Details />} />
        </Routes>
</div>
  );
}

export default App;
