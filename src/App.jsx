import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import TopNavbar from "./components/TopNavbar";
import ChatSectionPremium from "./components/ChatSectionPremium";

export default function App() {
  const [chatHistory, setChatHistory] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load chats once
  useEffect(() => {
    try {
      const savedChats = localStorage.getItem("kunChats");

      if (savedChats) {
        const parsedChats = JSON.parse(savedChats);

        setChatHistory(parsedChats);

        if (parsedChats.length > 0) {
          setActiveChat(parsedChats[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to load chats:", error);
    }

    setIsLoaded(true);
  }, []);

  // Save chats
  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem(
      "kunChats",
      JSON.stringify(chatHistory)
    );
  }, [chatHistory, isLoaded]);

  return (
    <div className="h-screen flex flex-col bg-[#0f0f0f]">
      <TopNavbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
  chatHistory={chatHistory}
  activeChat={activeChat}
  setActiveChat={setActiveChat}
  setChatHistory={setChatHistory}
/>

        <ChatSectionPremium
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          activeChat={activeChat}
          setActiveChat={setActiveChat}
        />
      </div>
    </div>
  );
}