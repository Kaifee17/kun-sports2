import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
Send,
Paperclip,
Mic,
} from "lucide-react";

export default function ChatSectionNew() {
const [message, setMessage] = useState("");
const [messages, setMessages] = useState([]);
const [loading, setLoading] = useState(false);
const [uploadedFile, setUploadedFile] = useState(null);

const textareaRef = useRef(null);
const chatEndRef = useRef(null);
const fileInputRef = useRef(null);

useEffect(() => {
chatEndRef.current?.scrollIntoView({
behavior: "smooth",
});
}, [messages, loading]);

useEffect(() => {
const handleNewChat = () => {
setMessages([]);
setUploadedFile(null);
setMessage("");
};


window.addEventListener(
  "new-chat",
  handleNewChat
);

return () => {
  window.removeEventListener(
    "new-chat",
    handleNewChat
  );
};


}, []);

const getTime = () => {
return new Date().toLocaleTimeString([], {
hour: "2-digit",
minute: "2-digit",
});
};

const handleFileUpload = (e) => {
const file = e.target.files[0];


if (file) {
  setUploadedFile(file);
}


};

const sendMessage = async () => {
if (!message.trim()) return;


const currentMessage = message;

setMessages((prev) => [
  ...prev,
  {
    type: "user",
    text: currentMessage,
    time: getTime(),
  },
]);

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
        model: "Claude",
        message: currentMessage,
      }),
    }
  );

  const data = await response.json();

  setMessages((prev) => [
    ...prev,
    {
      type: "assistant",
      text:
        data.text ||
        "No response received.",
      time: getTime(),
    },
  ]);
} catch (error) {
  console.error(error);

  setMessages((prev) => [
    ...prev,
    {
      type: "assistant",
      text:
        "Connection failed. Please try again.",
      time: getTime(),
    },
  ]);
}

setLoading(false);


};

return ( <section className="flex-1 flex flex-col bg-[#0f0f0f] overflow-hidden">


  {/* Messages */}
  <div className="flex-1 overflow-y-auto">

    <div className="max-w-4xl mx-auto px-6 py-8">

      {messages.length === 0 && (

        <div className="h-full flex items-center justify-center mt-20">

          <div className="text-center">

            <img
              src="/logo.png"
              alt="KUN Sports"
              className="w-12 h-12 mx-auto mb-5"
            />

            <h1 className="text-4xl font-bold text-white">
              KUN Sports AI
            </h1>

            <p className="text-gray-400 mt-3">
              Ask anything about sports,
              memberships, facilities,
              events and training.
            </p>

          </div>

        </div>

      )}

      {messages.map((msg, index) => (

        <div
          key={index}
          className={`mb-8 flex ${
            msg.type === "user"
              ? "justify-end"
              : "justify-start"
          }`}
        >

          <div
            className={`max-w-3xl px-5 py-4 rounded-3xl ${
              msg.type === "user"
                ? "bg-[#2f2f2f] text-white"
                : "text-gray-100"
            }`}
          >

            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className="mb-3 leading-8">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-5 space-y-2">
                    {children}
                  </ul>
                ),
              }}
            >
              {msg.text}
            </ReactMarkdown>

          </div>

        </div>

      ))}

      {loading && (

        <div className="flex justify-start">

          <div className="flex gap-2">

            <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>

            <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>

            <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>

          </div>

        </div>

      )}

      <div ref={chatEndRef}></div>

    </div>

  </div>

  {/* Input Area */}
  <div className="border-t border-white/10 bg-[#171717] p-5">

    <div className="max-w-4xl mx-auto">

      {uploadedFile && (

        <div className="mb-3 bg-[#252525] border border-white/10 px-4 py-3 rounded-xl text-gray-300">

          📄 {uploadedFile.name}

        </div>

      )}

      <div className="bg-[#2a2a2a] border border-white/10 rounded-3xl p-4">

        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey
            ) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Ask KUN Sports AI..."
          className="w-full bg-transparent text-white placeholder-gray-500 outline-none resize-none min-h-[24px] max-h-[180px]"
        />

        <div className="flex items-center justify-between mt-4">

          <div className="flex items-center gap-2">

            <button
              onClick={() =>
                fileInputRef.current.click()
              }
              className="p-2 rounded-lg hover:bg-white/10 transition"
            >
              <Paperclip
                size={18}
                className="text-gray-300"
              />
            </button>

            <button
              className="p-2 rounded-lg hover:bg-white/10 transition"
            >
              <Mic
                size={18}
                className="text-gray-300"
              />
            </button>

          </div>

          <button
            onClick={sendMessage}
            className="w-11 h-11 rounded-full bg-[#F26A3D] hover:bg-[#e55d2f] flex items-center justify-center transition"
          >
            <Send
              size={18}
              className="text-white"
            />
          </button>

        </div>

      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileUpload}
      />

    </div>

  </div>

</section>


);
}
