
import { Routes, Route } from "react-router-dom";
import Details from "./pages/details";
import Favorites from "./pages/favorites";
import Header from "./components/header";
import Banner from "./components/banner";
import Home from "./pages/home";
import Hackatons from "./pages/hackatons";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/profile";

function App() {
  return (
    <div>
        <Banner />
        <Header />
<div className="flex justify-center items-center min-h-[80vh] w-full">

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hackatons" element={<Hackatons />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/recipe-item/:id" element={<Details />} />
        </Routes>
</div>
    </div>
  );
}

export default App;
