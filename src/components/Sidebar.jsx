import { useState } from "react";
import {
  Plus,
  MessageSquare,
  Search,
  Trash2,
  User,
  X,
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
    const updatedChats = chatHistory.filter((chat) => chat.id !== chatId);
    setChatHistory(updatedChats);

    if (activeChat === chatId) {
      setActiveChat(updatedChats[0]?.id || null);
    }
};

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredChats = chatHistory.filter((chat) => {
    if (!normalizedSearch) return true;

    const titleMatches = chat.title?.toLowerCase().includes(normalizedSearch);
    const messageMatches = chat.messages?.some((message) =>
      message.text?.toLowerCase().includes(normalizedSearch),
    );

    return titleMatches || messageMatches;
  });

  return (
    <aside className="hidden md:flex w-[280px] shrink-0 bg-[#0d0f12] border-r border-white/[0.07] flex-col">

      {/* Logo Area */}
      <div className="px-4 pt-5 pb-3">

        <button
  onClick={handleNewChat}
  className="w-full h-11 flex items-center justify-center gap-2 bg-gradient-to-r from-[#f26a3d] to-[#ee784f] hover:from-[#fb7548] hover:to-[#f0825d] text-white rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-lg shadow-[#F26A3D]/10 hover:shadow-[#F26A3D]/20 active:scale-[0.98]"
>
          <Plus size={18} />
          New chat
        </button>

      </div>

      {/* Search */}
      <div className="px-4 py-3">

        <div className="flex items-center gap-2.5 h-10 bg-white/[0.035] border border-white/[0.07] rounded-xl px-3 transition-all focus-within:border-white/[0.14] focus-within:bg-white/[0.05]">

          <Search
            size={16}
            className="text-gray-600"
          />

          <input
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
            placeholder="Search conversations"
            className="bg-transparent text-[13px] text-gray-200 outline-none w-full placeholder:text-gray-600"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="shrink-0 p-1 rounded-md text-gray-500 hover:text-white hover:bg-white/10 transition cursor-pointer"
              aria-label="Clear chat search"
            >
              <X size={14} />
            </button>
          )}

        </div>

      </div>

      {/* Chats */}
      <div className="flex-1 overflow-y-auto px-3 pt-2">

        <div className="flex items-center justify-between px-2 mb-2.5">
          <p className="text-[10px] uppercase tracking-[0.16em] font-semibold text-gray-600">Recent</p>
          <span className="text-[10px] text-gray-600 tabular-nums">{filteredChats.length}</span>
        </div>

        {filteredChats.length === 0 ? (

          <div className="mx-2 mt-8 rounded-xl border border-dashed border-white/[0.07] px-3 py-6 text-center text-gray-600 text-xs">
            {normalizedSearch ? "No matching chats" : "No chats yet"}
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
              className={`group relative flex items-center justify-between rounded-xl px-3 py-2.5 mb-1 cursor-pointer border transition-all duration-200 ${
                activeChat === chat.id
                  ? "bg-gradient-to-r from-[#F26A3D]/[0.11] to-transparent border-[#F26A3D]/20"
                  : "border-transparent hover:bg-white/[0.035] hover:border-white/[0.05]"
              }`}
            >

              {activeChat === chat.id && (
                <span className="absolute left-0 top-2.5 bottom-2.5 w-0.5 rounded-full bg-[#F26A3D] shadow-[0_0_8px_rgba(242,106,61,0.5)]" />
              )}

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

                <span className={`truncate text-[13px] transition ${activeChat === chat.id ? "text-gray-100" : "text-gray-400 group-hover:text-gray-200"}`}>
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
                className="opacity-0 group-hover:opacity-100 p-1.5 -mr-1.5 rounded-lg hover:bg-red-500/10 transition cursor-pointer focus:opacity-100"
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
      <div className="border-t border-white/[0.07] p-3.5">

        <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-white/[0.03] transition-colors">

          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F26A3D]/25 to-[#F26A3D]/10 border border-[#F26A3D]/20 flex items-center justify-center text-[#ff9876]">

            <User size={18} />

          </div>

          <div>

            <p className="text-[13px] font-medium text-gray-200">
              KUN Team
            </p>

            <p className="text-[11px] text-gray-600 mt-0.5">
              KUN Team Member
            </p>

          </div>

        </div>

      </div>

    </aside>
  );
}
