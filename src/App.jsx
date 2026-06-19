import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import TopNavbar from "./components/TopNavbar";
import ChatSectionPremium from "./components/ChatSectionPremium";

export default function App() {
  const [chatHistory, setChatHistory] = useState(() => {
    try {
      const savedChats = localStorage.getItem("kunChats");
      return savedChats ? JSON.parse(savedChats) : [];
    } catch (error) {
      console.error("Failed to load chats:", error);
      return [];
    }
  });
  const [activeChat, setActiveChat] = useState(() => chatHistory[0]?.id || null);

  // Save chats
  useEffect(() => {
    localStorage.setItem("kunChats", JSON.stringify(chatHistory));
  }, [chatHistory]);

  return (
    <div className="h-screen flex flex-col bg-[#090b0e] text-white antialiased">
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
