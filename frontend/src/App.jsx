
import { Routes, Route } from "react-router-dom";
import Details from "./pages/details";
import Favorites from "./pages/favorites";
import Header from "./components/header";
import Banner from "./components/banner";
import Home from "./pages/home";

function App() {
  return (
    <div>
        <Banner />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/recipe-item/:id" element={<Details />} />
        </Routes>
    </div>
  );
}

export default App;
