import CallToAction from "../../components/call_to_action";
import Cards from "../../components/cards";
import Footer from "../../components/footer";
import Hero from "../../components/hero";
import Testimonials from "../../components/testimonials/testimonials";


const Home = () => {
  return (
    <main className="relative">
      <Hero />
      <Cards />
      <CallToAction />
      <Testimonials />
      <Footer />

    </main>
  );
};

export default Home;
