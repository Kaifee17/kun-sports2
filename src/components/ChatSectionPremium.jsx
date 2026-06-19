import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
Send,
Paperclip,
Mic,
ChevronDown,
Sparkles,
} from "lucide-react";

export default function ChatSectionPremium({
chatHistory,
setChatHistory,
activeChat,
setActiveChat,
}) {
const [message, setMessage] = useState("");
const [messages, setMessages] = useState([]);
const [loading, setLoading] = useState(false);
const [uploadedFile, setUploadedFile] = useState(null);

const [selectedModel, setSelectedModel] =
useState("GPT-5");

const [showModels, setShowModels] =
useState(false);

const chatEndRef = useRef(null);
const fileInputRef = useRef(null);

const models = [
"GPT-5",
"GPT-4o",
"Claude Sonnet 4",
"Claude Opus 4",
"Gemini 2.5 Pro",
];

useEffect(() => {
chatEndRef.current?.scrollIntoView({
behavior: "smooth",
});
}, [messages, loading]);

useEffect(() => {
const currentChat = chatHistory.find(
(chat) => chat.id === activeChat
);


if (currentChat) {
  setMessages(currentChat.messages || []);
}


}, [activeChat, chatHistory]);

useEffect(() => {
const handleNewChat = () => {
setMessages([]);
setMessage("");
setUploadedFile(null);


  const newChatId = Date.now();

  const newChat = {
    id: newChatId,
    title: "New Chat",
    messages: [],
  };

  setChatHistory((prev) => [
    newChat,
    ...prev,
  ]);

  setActiveChat(newChatId);
};

window.addEventListener(
  "new-chat",
  handleNewChat
);

return () =>
  window.removeEventListener(
    "new-chat",
    handleNewChat
  );


}, [setChatHistory, setActiveChat]);

const handleFileUpload = (e) => {
const file = e.target.files[0];


if (file) {
  setUploadedFile(file);
}


};

const updateCurrentChat = (
updatedMessages,
title = null
) => {
setChatHistory((prev) =>
prev.map((chat) =>
chat.id === activeChat
? {
...chat,
title:
title || chat.title,
messages:
updatedMessages,
}
: chat
)
);
};

const sendMessage = async () => {
if (!message.trim()) return;


const currentMessage = message;

const userMessage = {
  type: "user",
  text: currentMessage,
};

const updatedMessages = [
  ...messages,
  userMessage,
];

setMessages(updatedMessages);

updateCurrentChat(
  updatedMessages,
  messages.length === 0
    ? currentMessage
    : null
);

setMessage("");
setLoading(true);

try {
  const response = await fetch(
    "https://studio.adonixai.cloud/webhook/kun-ai",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        model: selectedModel,
        message: currentMessage,
      }),
    }
  );

  const data =
    await response.json();

  const assistantMessage = {
    type: "assistant",
    text:
      data.text ||
      "No response received",
  };

  const finalMessages = [
    ...updatedMessages,
    assistantMessage,
  ];

  setMessages(finalMessages);

  updateCurrentChat(
    finalMessages
  );
} catch (error) {
  const errorMessage = {
    type: "assistant",
    text:
      "Connection failed. Please try again.",
  };

  const finalMessages = [
    ...updatedMessages,
    errorMessage,
  ];

  setMessages(finalMessages);

  updateCurrentChat(
    finalMessages
  );
}

setLoading(false);


};

return ( <section className="flex-1 flex flex-col bg-[#0f0f0f]">


  <div className="border-b border-white/10 bg-[#171717] px-6 py-4">

    <div className="flex justify-between items-center">

    

    

    </div>

  </div>

  <div className="flex-1 overflow-y-auto">

    <div className="max-w-4xl mx-auto px-6 py-8">

      {messages.length === 0 && (

        <div className="h-full flex flex-col items-center justify-center min-h-[70vh] text-center">

          <div className="w-20 h-20 rounded-3xl bg-[#171717] border border-white/10 flex items-center justify-center mb-4">

            <img
              src="/logo.png"
              alt="logo"
              className="w-12 h-12"
            />

          </div>

          <h1 className="text-4xl font-bold text-white">
            KUN Sports AI
          </h1>

          <p className="text-gray-400 mt-3">
            How can I help today?
          </p>

        </div>

      )}

      {messages.map(
        (msg, index) => (

          <div
            key={index}
            className={`mb-8 flex ${
              msg.type === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >

            {msg.type ===
            "user" ? (

              <div className="bg-[#2f2f2f] text-white px-5 py-4 rounded-3xl max-w-3xl">
                {msg.text}
              </div>

            ) : (

              <div className="max-w-3xl text-gray-100 leading-8">
                <ReactMarkdown>
                  {msg.text}
                </ReactMarkdown>
              </div>

            )}

          </div>
        )
      )}

      {loading && (
        <div className="text-gray-400">
          KUN Sports AI is thinking...
        </div>
      )}

      <div ref={chatEndRef}></div>

    </div>

  </div>

  <div className="border-t border-white/10 bg-[#171717] p-5">

    <div className="max-w-4xl mx-auto">

      {uploadedFile && (

        <div className="mb-3 bg-[#252525] border border-white/10 px-4 py-3 rounded-xl text-gray-300">

          📄 {uploadedFile.name}

        </div>

      )}

      <div className="bg-[#222222] border border-white/10 rounded-3xl p-2">

        <textarea
          value={message}
          onChange={(e) =>
            setMessage(
              e.target.value
            )
          }
          onKeyDown={(e) => {
            if (
              e.key ===
                "Enter" &&
              !e.shiftKey
            ) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Ask KUN Sports AI..."
          className="w-full bg-transparent text-white placeholder-gray-500 outline-none resize-none h-5px"
        />

        <div className="flex justify-between items-center mt-4">

          <div className="flex gap-2">

            <button
              onClick={() =>
                fileInputRef.current.click()
              }
              className="p-2 rounded-lg hover:bg-white/10"
            >
              <Paperclip size={18} />
            </button>

            <button className="p-2 rounded-lg hover:bg-white/10">
              <Mic size={18} />
            </button>

          </div>

          <button
            onClick={sendMessage}
            className="w-11 h-11 rounded-full bg-[#F26A3D] hover:bg-[#e65f31] flex items-center justify-center"
          >
            <Send size={18} />
          </button>

        </div>

      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={
          handleFileUpload
        }
      />

    </div>

  </div>

</section>


);
}
