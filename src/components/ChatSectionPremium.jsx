import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  BarChart3,
  FileSpreadsheet,
  FileText,
  LoaderCircle,
  Mic,
  Paperclip,
  Send,
  Sparkles,
  Square,
  X,
} from "lucide-react";

const WEBHOOK_URL = "https://studio.adonixai.cloud/webhook/kun-ai";
const TEXT_EXTENSIONS = new Set([
  "txt",
  "md",
  "csv",
  "tsv",
  "json",
  "xml",
  "html",
  "htm",
  "log",
  "rtf",
]);
const STARTER_PROMPTS = [
  {
    icon: FileSpreadsheet,
    label: "Analyze a spreadsheet",
    detail: "Find trends, totals, and anomalies",
    prompt: "Analyze my spreadsheet and summarize the most important trends.",
  },
  {
    icon: FileText,
    label: "Summarize a document",
    detail: "Extract decisions and key points",
    prompt: "Summarize my document and highlight the key decisions and action items.",
  },
  {
    icon: BarChart3,
    label: "Create a performance report",
    detail: "Turn sports data into insight",
    prompt: "Create a clear performance report from my sports data.",
  },
  {
    icon: Sparkles,
    label: "Ask KUN Sports AI",
    detail: "Get a focused expert answer",
    prompt: "Help me understand this sports data and recommend the next steps.",
  },
];

function getExtension(fileName) {
  return fileName.split(".").pop()?.toLowerCase() || "";
}

async function extractBrowserReadableText(file) {
  const extension = getExtension(file.name);
  const isReadable =
    file.type.startsWith("text/") ||
    TEXT_EXTENSIONS.has(extension) ||
    file.type === "application/json" ||
    file.type === "application/xml";

  if (!isReadable) return "";

  const text = await file.text();
  if (extension === "html" || extension === "htm") {
    return new DOMParser().parseFromString(text, "text/html").body.textContent || "";
  }

  return text;
}

function getResponseText(data) {
  const result = Array.isArray(data) ? data[0] : data;
  return (
    result?.text ||
    result?.output ||
    result?.response ||
    result?.message ||
    "No response received"
  );
}

export default function ChatSectionPremium({
  chatHistory,
  setChatHistory,
  activeChat,
  setActiveChat,
}) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [documentText, setDocumentText] = useState("");
  const [fileStatus, setFileStatus] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [voiceRecording, setVoiceRecording] = useState(null);
  const [voiceStatus, setVoiceStatus] = useState("");
  const [selectedModel] = useState("GPT-5");

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const messages = useMemo(
    () => chatHistory.find((chat) => chat.id === activeChat)?.messages || [],
    [activeChat, chatHistory],
  );

  useEffect(() => {
    if (messages.length > 0 || loading) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, loading]);

  useEffect(() => {
    const handleNewChat = () => {
      mediaRecorderRef.current?.stop();
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      setMessage("");
      setUploadedFile(null);
      setDocumentText("");
      setFileStatus("");
      setVoiceRecording(null);
      setVoiceStatus("");

      const newChatId = Date.now();
      setChatHistory((previous) => [
        { id: newChatId, title: "New Chat", messages: [] },
        ...previous,
      ]);
      setActiveChat(newChatId);
    };

    window.addEventListener("new-chat", handleNewChat);
    return () => {
      window.removeEventListener("new-chat", handleNewChat);
      mediaRecorderRef.current?.stop();
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [setActiveChat, setChatHistory]);

  const saveChat = (chatId, updatedMessages, title = null) => {
    setChatHistory((previous) => {
      const exists = previous.some((chat) => chat.id === chatId);
      if (!exists) {
        return [
          {
            id: chatId,
            title: title || "New Chat",
            messages: updatedMessages,
          },
          ...previous,
        ];
      }

      return previous.map((chat) =>
        chat.id === chatId
          ? { ...chat, title: title || chat.title, messages: updatedMessages }
          : chat,
      );
    });
  };

  const clearAttachment = () => {
    setUploadedFile(null);
    setDocumentText("");
    setFileStatus("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setDocumentText("");
    setFileStatus("Preparing document…");

    try {
      const extractedText = await extractBrowserReadableText(file);
      setDocumentText(extractedText);
      setFileStatus(
        extractedText
          ? "Text extracted and ready"
          : "Ready — n8n will extract this document",
      );
    } catch {
      setFileStatus("Ready — n8n will extract this document");
    }
  };

  const clearVoiceRecording = () => {
    setVoiceRecording(null);
    setVoiceStatus("");
  };

  const toggleVoiceInput = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setVoiceStatus("Voice recording is not supported in this browser. Try Chrome or Edge.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaStreamRef.current = stream;
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const type = recorder.mimeType || "audio/webm";
        const blob = new Blob(audioChunksRef.current, { type });
        const audioFile = new File([blob], `voice-${Date.now()}.webm`, { type });
        setVoiceRecording(audioFile);
        setVoiceStatus("Voice recording ready to send");
        setIsRecording(false);
        stream.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      };
      recorder.onerror = () => {
        setIsRecording(false);
        setVoiceStatus("Could not record audio. Please try again.");
        stream.getTracks().forEach((track) => track.stop());
      };

      clearVoiceRecording();
      recorder.start();
      setIsRecording(true);
      setVoiceStatus("Recording… click the mic again to stop");
    } catch (error) {
      console.error(error);
      setIsRecording(false);
      setVoiceStatus("Microphone access was blocked. Please allow microphone permission and try again.");
    }
  };

  const sendMessage = async () => {
    const currentMessage = message.trim();
    if ((!currentMessage && !uploadedFile && !voiceRecording) || loading || isRecording) return;

    const chatId = activeChat || Date.now();
    if (!activeChat) setActiveChat(chatId);

    const outgoingFile = uploadedFile;
    const outgoingVoice = voiceRecording;
    const outgoingDocumentText = documentText;
    const prompt =
      currentMessage ||
      (outgoingVoice
        ? "Please transcribe this voice message and reply to it."
        : `Please read and answer using the attached document: ${outgoingFile.name}`);
    const visibleMessage = currentMessage || (outgoingVoice ? "" : prompt);
    const userMessage = {
      type: "user",
      text: visibleMessage,
      attachment: outgoingFile || outgoingVoice
        ? {
            name: outgoingFile?.name || "Voice message",
            type: outgoingFile?.type || outgoingVoice.type,
            size: outgoingFile?.size || outgoingVoice.size,
          }
        : null,
    };
    const updatedMessages = [...messages, userMessage];

    saveChat(
      chatId,
      updatedMessages,
      messages.length === 0 ? (outgoingVoice ? "Voice message" : prompt) : null,
    );
    setMessage("");
    clearAttachment();
    clearVoiceRecording();
    setLoading(true);

    try {
      let body;
      let headers;
      const inputType = outgoingVoice ? "voice" : outgoingFile ? "document" : "text";

      if (outgoingFile || outgoingVoice) {
        body = new FormData();
        body.append("model", selectedModel);
        body.append("message", prompt);
        body.append("inputType", inputType);
        body.append("chatId", String(chatId));
        if (outgoingDocumentText) body.append("documentText", outgoingDocumentText);
        body.append(
          "fileMetadata",
          JSON.stringify({
            name: outgoingFile?.name || outgoingVoice.name,
            type: outgoingFile?.type || outgoingVoice.type,
            size: outgoingFile?.size || outgoingVoice.size,
          }),
        );
        if (outgoingFile) body.append("file", outgoingFile, outgoingFile.name);
        if (outgoingVoice) body.append("audio", outgoingVoice, outgoingVoice.name);
      } else {
        headers = { "Content-Type": "application/json" };
        body = JSON.stringify({
          model: selectedModel,
          message: prompt,
          inputType,
          chatId,
        });
      }

      const response = await fetch(WEBHOOK_URL, { method: "POST", headers, body });
      if (!response.ok) throw new Error(`Webhook returned ${response.status}`);

      const data = await response.json();
      const finalMessages = [
        ...updatedMessages,
        { type: "assistant", text: getResponseText(data) },
      ];
      saveChat(chatId, finalMessages);
    } catch (error) {
      console.error(error);
      const finalMessages = [
        ...updatedMessages,
        { type: "assistant", text: "Connection failed. Please try again." },
      ];
      saveChat(chatId, finalMessages);
    } finally {
      setLoading(false);
    }
  };

  const hasConversation = messages.length > 0 || loading;

  return (
    <section className="relative min-w-0 flex-1 flex flex-col bg-[#090b0e] overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(242,106,61,0.055),transparent_68%)] pointer-events-none" />

      <div className={`relative z-10 min-h-0 flex-1 ${hasConversation ? "overflow-y-auto" : "overflow-hidden"}`}>
        <div className={`max-w-5xl mx-auto px-5 sm:px-8 ${hasConversation ? "py-10" : "h-full"}`}>
          {!hasConversation && (
            <div className="h-full flex flex-col items-center justify-center text-center pb-2">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#F26A3D]/15 bg-[#F26A3D]/[0.06] px-3 py-1.5 text-[11px] font-medium text-[#ff9c7b]">
                <Sparkles size={13} />
                AI-powered sports intelligence
              </div>
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.025] border border-white/[0.09] flex items-center justify-center mb-5 shadow-2xl shadow-black/30">
                <div className="absolute -inset-4 rounded-full bg-[#F26A3D]/5 blur-2xl" />
                <img src="/logo.png" alt="KUN Sports AI" className="relative w-10 h-10" />
              </div>
              <h1 className="text-3xl sm:text-[38px] leading-tight font-semibold tracking-[-0.035em] text-white">
                Turn your data into decisions.
              </h1>
              <p className="text-sm sm:text-[15px] text-gray-500 mt-3 max-w-xl leading-6">
                Analyze sports performance, spreadsheets, PDFs, and reports with your KUN intelligence assistant.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-2xl mt-7 text-left">
                {STARTER_PROMPTS.map(({ icon: Icon, label, detail, prompt }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setMessage(prompt)}
                    className="group flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-left transition-all hover:-translate-y-0.5 hover:border-[#F26A3D]/25 hover:bg-[#F26A3D]/[0.045] cursor-pointer"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.045] text-gray-500 transition-colors group-hover:bg-[#F26A3D]/10 group-hover:text-[#ff8d67]">
                      <Icon size={17} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13px] font-medium text-gray-300 group-hover:text-white">{label}</span>
                      <span className="block text-[11px] text-gray-600 mt-0.5">{detail}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((item, index) => (
            <div
              key={`${item.type}-${index}`}
              className={`mb-7 flex ${item.type === "user" ? "justify-end" : "justify-start"}`}
            >
              {item.type === "user" ? (
                <div className="max-w-[78%] rounded-2xl rounded-br-md border border-white/[0.07] bg-gradient-to-br from-[#25282d] to-[#1d2024] px-4 py-3 text-[14px] leading-6 text-gray-100 shadow-lg shadow-black/10">
                  {item.attachment && (
                    <div className="mb-2 flex items-center gap-2 rounded-lg bg-black/15 px-2.5 py-2 text-xs text-[#ffad91]">
                      {item.attachment.type?.startsWith("audio/") ? "🎤" : "📄"} {item.attachment.name}
                    </div>
                  )}
                  {item.text && <div>{item.text}</div>}
                </div>
              ) : (
                <div className="flex max-w-[86%] items-start gap-3.5">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#F26A3D]/20 bg-[#F26A3D]/10 shadow-sm">
                    <img src="/logo.png" alt="" className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 pt-1 text-[14px] leading-7 text-gray-300">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="mb-3 list-disc space-y-1 pl-5">{children}</ul>,
                        ol: ({ children }) => <ol className="mb-3 list-decimal space-y-1 pl-5">{children}</ol>,
                        strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                      }}
                    >
                      {item.text}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3.5 text-gray-500">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#F26A3D]/20 bg-[#F26A3D]/10">
                <img src="/logo.png" alt="" className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3.5 py-3">
                <span className="h-1.5 w-1.5 rounded-full bg-gray-500 animate-bounce" />
                <span className="h-1.5 w-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:120ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:240ms]" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      <div className="relative z-20 shrink-0 border-t border-white/[0.065] bg-[#0d0f12]/95 backdrop-blur-2xl px-4 py-4 sm:px-6 sm:py-5 shadow-[0_-12px_40px_rgba(0,0,0,0.18)]">
        <div className="max-w-5xl mx-auto">
          {uploadedFile && (
            <div className="mb-3 flex items-center justify-between gap-3 bg-white/[0.035] border border-white/[0.07] px-4 py-3 rounded-xl text-gray-300">
              <div className="min-w-0">
                <div className="truncate">📄 {uploadedFile.name}</div>
                <div className="text-xs text-gray-500 mt-1">{fileStatus}</div>
              </div>
              <button onClick={clearAttachment} className="p-1 rounded-lg hover:bg-white/10" aria-label="Remove attachment">
                <X size={17} />
              </button>
            </div>
          )}

          {(voiceStatus || voiceRecording) && (
            <div className="mb-3 flex items-center justify-between gap-3 bg-white/[0.035] border border-white/[0.07] px-4 py-3 rounded-xl text-gray-300">
              <div className="min-w-0">
                <div>{isRecording ? "🎙️ Recording voice" : "🎤 Voice message"}</div>
                <div className={`text-xs mt-1 ${isRecording ? "text-red-400" : "text-gray-500"}`}>{voiceStatus}</div>
              </div>
              {voiceRecording && !isRecording && (
                <button onClick={clearVoiceRecording} className="p-1 rounded-lg hover:bg-white/10" aria-label="Remove voice recording">
                  <X size={17} />
                </button>
              )}
            </div>
          )}

          <div className="bg-gradient-to-b from-[#171a1f] to-[#14171b] border border-white/[0.085] rounded-2xl px-4 pt-4 pb-3 shadow-[0_18px_50px_rgba(0,0,0,0.25)] transition-all focus-within:border-[#F26A3D]/40 focus-within:ring-4 focus-within:ring-[#F26A3D]/[0.045]">
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={isRecording ? "Recording your voice…" : "Analyze Excel, PDF, or document data here…"}
              className="block w-full min-h-14 max-h-44 bg-transparent text-[14px] leading-6 text-gray-100 placeholder-gray-600 outline-none resize-none"
            />

            <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/[0.055]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="h-9 w-9 flex items-center justify-center rounded-lg border border-transparent hover:border-white/[0.06] hover:bg-white/[0.05] text-gray-500 hover:text-gray-200 transition-colors cursor-pointer"
                  aria-label="Attach a document"
                >
                  <Paperclip size={18} />
                </button>
                <button
                  onClick={toggleVoiceInput}
                  className={`h-9 flex items-center justify-center rounded-lg font-medium text-sm transition-all cursor-pointer ${isRecording ? "gap-2 px-3.5 bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600" : "w-9 border border-transparent hover:border-white/[0.06] hover:bg-white/[0.05] text-gray-500 hover:text-gray-200"}`}
                  aria-label={isRecording ? "Stop voice recording" : "Start voice recording"}
                  title={isRecording ? "Stop recording" : "Start voice recording"}
                >
                  {isRecording ? (
                    <>
                      <Square size={13} fill="currentColor" />
                      <span>Stop</span>
                    </>
                  ) : (
                    <Mic size={18} />
                  )}
                </button>
              </div>

              <button
                onClick={sendMessage}
                disabled={loading || isRecording || (!message.trim() && !uploadedFile && !voiceRecording)}
                className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#ff7a4e] to-[#e95b2e] hover:from-[#ff835a] hover:to-[#f16638] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer shadow-lg shadow-[#F26A3D]/15 active:scale-95"
                aria-label="Send message"
              >
                {loading ? <LoaderCircle size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </div>

          <p className="mt-2 text-center text-[10px] text-gray-700">
            Attach Excel, PDF, Word, CSV, or text files • Enter to send • Shift + Enter for a new line
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.pdf,.doc,.docx,.txt,.md,.csv,.tsv,.json,.xml,.html,.rtf"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>
    </section>
  );
}
