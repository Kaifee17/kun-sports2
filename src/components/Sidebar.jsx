import { useState } from "react";
import {
  Plus,
  MessageSquare,
  Search,
  Trash2,
  User,
} from "lucide-react";

export default function Sidebar({
  chatHistory = [],
  activeChat,
  setActiveChat,
  setChatHistory,
}) {
  const [searchTerm, setSearchTerm] =
    useState("");

  const handleNewChat = () => {
    window.dispatchEvent(
      new CustomEvent("new-chat")
    );
  };

  const deleteChat = (chatId) => {
  const updatedChats = chatHistory.filter(
    (chat) => chat.id !== chatId
  );

  localStorage.setItem(
    "kunChats",
    JSON.stringify(updatedChats)
  );


  window.dispatchEvent(
    new CustomEvent("delete-chat", {
      detail: chatId,
    })
  );
};

  const filteredChats =
    chatHistory.filter((chat) =>
      chat.title
        ?.toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )
    );

  return (
    <aside className="w-64 bg-[#171717] border-r border-white/10 flex flex-col">

      {/* Logo Area */}
      <div className="px-5 py-5 border-b border-white/10">

        <button
  onClick={handleNewChat}
  className="w-full flex items-center justify-center gap-2 bg-[#F26A3D] hover:bg-[#e65f31] text-white py-3 rounded-xl font-medium transition-all cursor-pointer hover:scale-[1.02]"
>
          <Plus size={18} />
          New Chats
        </button>

      </div>

      {/* Search */}
      <div className="p-4">

        <div className="flex items-center gap-3 bg-[#222222] border border-white/10 rounded-xl px-3 py-3">

          <Search
            size={16}
            className="text-gray-500"
          />

          <input
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
            placeholder="Search chats..."
            className="bg-transparent text-sm text-white outline-none w-full placeholder:text-gray-500"
          />

        </div>

      </div>

      {/* Chats */}
      <div className="flex-1 overflow-y-auto px-3">

        <p className="text-[11px] uppercase tracking-widest text-gray-500 px-2 mb-3">
          Recent Chats
        </p>

        {filteredChats.length === 0 ? (

          <div className="text-center text-gray-500 text-sm mt-12">
            No chats found
          </div>

        ) : (

          filteredChats.map((chat) => (

            <div
              key={chat.id}
              onClick={() =>
                setActiveChat?.(
                  chat.id
                )
              }
              className={`group flex items-center justify-between rounded-xl px-3 py-3 mb-2 cursor-pointer border transition-all duration-200 ${
                activeChat === chat.id
                  ? "bg-[#2a2a2a] border-[#F26A3D]"
                  : "border-transparent hover:bg-[#232323] hover:border-[#F26A3D]/40"
              }`}
            >

              <div className="flex items-center gap-3 overflow-hidden">

                <MessageSquare
                  size={16}
                  className={`${
                    activeChat ===
                    chat.id
                      ? "text-[#F26A3D]"
                      : "text-gray-500 group-hover:text-[#F26A3D]"
                  } transition`}
                />

                <span className="truncate text-sm text-gray-300 group-hover:text-white transition">
                  {chat.title}
                </span>

              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(
                    chat.id
                  );
                }}
                className="opacity-0 group-hover:opacity-100 transition"
              >
                <Trash2
                  size={15}
                  className="text-gray-500 hover:text-red-400"
                />
              </button>

            </div>

          ))

        )}

      </div>

      {/* Footer */}
      <div className="border-t border-white/10 p-4">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#F26A3D] to-[#ff8c66] flex items-center justify-center text-white">

            <User size={18} />

          </div>

          <div>

            <p className="text-sm font-medium text-white">
              KUN Admin
            </p>

            <p className="text-xs text-gray-500">
              Sports AI Dashboard
            </p>

          </div>

        </div>

      </div>

    </aside>
  );
}