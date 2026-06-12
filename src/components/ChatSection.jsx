import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  Send,
  ChevronDown,
  Sparkles,
} from "lucide-react";

export default function ChatSection() {
  const [selectedModel, setSelectedModel] = useState("ChatGPT");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
  {
    type: "assistant",
    text: "Welcome to KUN Sports AI Assistant. How can I help you today?",
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  },
]);

  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);
  const dropdownRef = useRef(null);
  const textareaRef = useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);
  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setDropdownOpen(false);
    }
  };

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };
}, []);

const getTime = () => {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

  const models = ["ChatGPT", "Claude", "Gemini"];

  const suggestions = [
    "Membership Plans",
    "Training Programs",
    "Gym Locations",
    "Upcoming Events",
  ];

const sendMessage = async () => {
  if (!message.trim()) return;

  const currentMessage = message;

  const userMessage = {
    type: "user",
    text: currentMessage,
    time: getTime(),
  };

  setMessages((prev) => [...prev, userMessage]);

  setMessage("");

  setTimeout(() => {
    textareaRef.current?.focus();
  }, 0);

  setLoading(true);

  try {
    const response = await fetch(
      "https://studio.adonixai.cloud/webhook/kun-ai",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: selectedModel,
          message: currentMessage,
        }),
      }
    );

    const data = await response.json();
    setMessages((prev) => [
      ...prev,
      {
        type: "assistant",
        text: data.text,
        time: getTime(),
      },
    ]);
  } catch (error) {
    console.error(error);

    setMessages((prev) => [
      ...prev,
      {
        type: "assistant",
        text: "Connection failed.",
        time: getTime(),
      },
    ]);
  }

  setLoading(false);
};

  const fillPrompt = (prompt) => {
    setMessage(prompt);
  };

  return (
    <section className="pb-24 max-w-5xl mx-auto px-6">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-[24px] border border-slate-200 shadow-xl overflow-hidden"
      >

        <div className="border-b border-slate-100 p-5">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <h2 className="text-xl font-semibold text-[#0B2239]">
                KUN Sports AI Assistant
              </h2>

              <p className="text-sm text-slate-500">
                Secure AI environment for KUN Sports
              </p>
            </div>

            <div 
            className="relative"
            ref={dropdownRef}
            >

              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3 transition"
              >
                <Sparkles size={16} />
                {selectedModel}
                <ChevronDown size={16} />
              </button>

              <AnimatePresence>

                {dropdownOpen && (

                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute right-0 mt-3 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 min-w-[220px]"
                  >

                    {models.map((model) => (

                      <button
                        key={model}
                        onClick={() => {
                          setSelectedModel(model);
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-5 py-4 hover:bg-orange-50 transition"
                      >
                        {model}
                      </button>

                    ))}

                  </motion.div>

                )}

              </AnimatePresence>

            </div>

          </div>

        </div>

        <div className="h-[350px] overflow-y-auto p-5 bg-[#FAFAFA]">

          <div className="space-y-4">

            {messages.map((msg, index) => (

              <div
                key={index}
                className={`flex ${
                  msg.type === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <div
                  className={`max-w-[70%] rounded-3xl px-5 py-3 ${
                    msg.type === "user"
                      ? "bg-[#F26A3D] text-white"
                      : "bg-white border border-slate-200 text-slate-700"
                  }`}
                >
                  <div>
<ReactMarkdown
  components={{
    p: ({ children }) => (
      <p className="mb-2 leading-8">{children}</p>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-[#0B2239]">
        {children}
      </strong>
    ),
    ul: ({ children }) => (
      <ul className="list-disc pl-5 space-y-1">
        {children}
      </ul>
    ),
    li: ({ children }) => <li>{children}</li>,
  }}
>
  {msg.text}
</ReactMarkdown>

  <p
    className={`text-[11px] mt-2 ${
      msg.type === "user"
        ? "text-orange-100"
        : "text-slate-400"
    }`}
  >
    {msg.time}
  </p>
</div>
                </div>

              </div>

            ))}

            {loading && (

              <div className="flex justify-start">

                <div className="bg-white border border-slate-200 rounded-3xl px-5 py-4">

                  <div className="flex gap-2">

                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>

                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>

                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>

                  </div>

                </div>

              </div>

            )}

            <div ref={chatEndRef}></div>

          </div>

        </div>

        <div className="border-t border-slate-100 p-5">

          <div className="flex flex-wrap gap-3 mb-5">

            {suggestions.map((item) => (

              <button
                key={item}
                onClick={() => fillPrompt(item)}
                className="bg-slate-100 hover:bg-[#F26A3D] hover:text-white px-4 py-2 rounded-full text-sm transition"
              >
                {item}
              </button>

            ))}

          </div>

          <div className="border border-slate-200 rounded-3xl p-4">

            <textarea
                ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask anything about KUN Sports..."
              className="w-full outline-none resize-none min-h-[80px]"
            />

            <div className="flex justify-between items-center mt-4">

              <p className="text-xs text-slate-400">
                Enter to send • Shift + Enter for new line
              </p>

              <button
                onClick={sendMessage}
                className="bg-[#F26A3D] hover:bg-[#e55d2f] text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition"
              >
                <Send size={18} />
                Ask KUN AI
              </button>

            </div>

          </div>

        </div>

      </motion.div>

    </section>
  );
}