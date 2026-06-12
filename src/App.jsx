import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ChatSection from "./components/ChatSection";
import About from "./components/About";
export default function App() {
  return (
    <div className="bg-[#F7F7F5] min-h-screen">
      <Navbar />
      <Hero />
      <ChatSection />
      <About />
    </div>
  );
}