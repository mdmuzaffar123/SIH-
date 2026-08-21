import { useState, useRef, useEffect, useCallback } from 'react';
import { useLang } from '../context/LanguageContext';
import './ChatBot.css';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const CHAT_LANGS = [
  { code: 'en', label: 'English',      speechLang: 'en-IN',  voicePriority: ['en-IN','en-GB','en-US'] },
  { code: 'hi', label: 'हिंदी',        speechLang: 'hi-IN',  voicePriority: ['hi-IN','hi'] },
  { code: 'cg', label: 'छत्तीसगढ़ी',   speechLang: 'hi-IN',  voicePriority: ['hi-IN','hi'] },
  { code: 'ta', label: 'தமிழ்',        speechLang: 'ta-IN',  voicePriority: ['ta-IN','ta'] },
  { code: 'te', label: 'తెలుగు',       speechLang: 'te-IN',  voicePriority: ['te-IN','te'] },
  { code: 'mr', label: 'मराठी',        speechLang: 'mr-IN',  voicePriority: ['mr-IN','mr'] },
  { code: 'bn', label: 'বাংলা',        speechLang: 'bn-IN',  voicePriority: ['bn-IN','bn-BD','bn'] },
];

const QUICK_PROMPTS = [
  { icon: '☀️', text: 'How does solar energy work?' },
  { icon: '💧', text: 'What is a solar water pump?' },
  { icon: '🏫', text: 'How to get solar for schools?' },
  { icon: '💰', text: 'Cost of solar installation?' },
  { icon: '🌱', text: 'CO2 savings from solar?' },
  { icon: '🗺️', text: 'Which areas need solar most?' },
];

const SYSTEM_PROMPT = `You are UrjaDhara AI Assistant — a friendly, knowledgeable expert on:
- Renewable energy (solar, wind, hybrid) for rural India
- Solar-powered water pumping systems
- Planning tools for government officials
- Cost-benefit analysis of solar projects
- Chhattisgarh and other Indian state energy data
- Government schemes like PM-KUSUM, MNRE programs
Keep answers concise, practical, and easy to understand. Use bullet points when listing items.
IMPORTANT: Always reply in the EXACT same language the user is speaking or the language specified in the instruction. Do not switch languages.`;

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Pick best available voice for the language
function getBestVoice(voicePriority) {
  const voices = window.speechSynthesis?.getVoices() || [];
  for (const pref of voicePriority) {
    const exact = voices.find(v => v.lang === pref);
    if (exact) return exact;
    const partial = voices.find(v => v.lang.startsWith(pref.split('-')[0]));
    if (partial) return partial;
  }
  return null;
}

// Speak text using Web Speech API in the correct regional language
function speakText(text, langConfig, onStart, onEnd) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  // Strip markdown symbols, limit to 500 chars for TTS
  const clean = text.replace(/[*_#`•]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 500);
  const utter = new SpeechSynthesisUtterance(clean);
  utter.lang = langConfig.speechLang;
  utter.rate = 0.88;
  utter.pitch = 1.05;
  utter.volume = 1;

  // Try to assign best matching voice
  const bestVoice = getBestVoice(langConfig.voicePriority);
  if (bestVoice) utter.voice = bestVoice;

  utter.onstart = onStart;
  utter.onend = onEnd;
  utter.onerror = onEnd;
  window.speechSynthesis.speak(utter);
}

export default function ChatBot() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [speakingId, setSpeakingId] = useState(null);
  const [chatLang, setChatLang] = useState('en');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [copied, setCopied] = useState(null);
  const [interimText, setInterimText] = useState('');
  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  // Welcome message on open
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: 'bot', id: 0,
        text: '👋 Hello! I am **UrjaDhara Assistant**.\n\nI can help you with:\n• Solar energy planning\n• Water pump systems\n• Government schemes\n• Cost estimates\n\nAsk me anything or tap a quick question below!',
        time: new Date(),
      }]);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Load voices — Chrome loads them async, must wait for voiceschanged
  useEffect(() => {
    const load = () => window.speechSynthesis?.getVoices();
    load();
    window.speechSynthesis?.addEventListener('voiceschanged', load);
    return () => window.speechSynthesis?.removeEventListener('voiceschanged', load);
  }, []);

  const getLangConfig = () => CHAT_LANGS.find(l => l.code === chatLang) || CHAT_LANGS[0];

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || loading) return;
    const msgId = Date.now();
    setMessages(prev => [...prev, { role: 'user', id: msgId, text, time: new Date() }]);
    setInput('');
    setInterimText('');
    setLoading(true);

    const langConfig = getLangConfig();
    const langInstruction = chatLang === 'cg'
      ? `IMPORTANT: You MUST respond entirely in Chhattisgarhi (छत्तीसगढ़ी) — a dialect of Hindi spoken in Chhattisgarh. Use simple Chhattisgarhi words.`
      : `IMPORTANT: You MUST respond entirely in ${langConfig.label}. Do not use any other language.`;

    try {
      const res = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: `${SYSTEM_PROMPT}\n\n${langInstruction}` }]
          },
          contents: [{ role: 'user', parts: [{ text }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 600 }
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
        || 'Sorry, I could not get a response. Please try again.';

      const botId = Date.now() + 1;
      setMessages(prev => [...prev, { role: 'bot', id: botId, text: reply, time: new Date(), langConfig }]);
      setLoading(false);

      // Auto-speak reply in the same language the user selected
      if (voiceEnabled) {
        setSpeakingId(botId);
        setSpeaking(true);
        speakText(reply, langConfig,
          () => { setSpeaking(true); setSpeakingId(botId); },
          () => { setSpeaking(false); setSpeakingId(null); }
        );
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'bot', id: Date.now() + 1,
        text: `⚠️ Error: ${err.message || 'Connection failed. Please check your internet connection.'}`,
        time: new Date(),
      }]);
      setLoading(false);
    }
  }, [loading, chatLang, voiceEnabled]);

  const startMic = () => {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Try Chrome.');
      return;
    }
    window.speechSynthesis?.cancel();
    const recognition = new SpeechRecognition();
    const langConfig = getLangConfig();
    recognition.lang = langConfig.speechLang;
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => { setListening(false); setInterimText(''); };
    recognition.onerror = () => { setListening(false); setInterimText(''); };

    recognition.onresult = (e) => {
      let interim = '';
      let final = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setInterimText(interim);
      if (final) {
        setInput(final);
        sendMessage(final);
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setSpeakingId(null);
  };

  const speakMessage = (msg) => {
    if (speakingId === msg.id && speaking) {
      stopSpeaking();
      return;
    }
    // Use the language the message was generated in, fall back to current selection
    const msgLangConfig = msg.langConfig || getLangConfig();
    setSpeakingId(msg.id);
    setSpeaking(true);
    speakText(msg.text, msgLangConfig,
      () => { setSpeaking(true); setSpeakingId(msg.id); },
      () => { setSpeaking(false); setSpeakingId(null); }
    );
  };

  const copyMessage = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // Render markdown-lite: bold, bullets
  const renderText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^• /gm, '• ')
      .split('\n')
      .map((line, i) => <span key={i}>{line.startsWith('•') ? <span className="bullet-line">{line}</span> : line}<br /></span>);
  };

  const toggleOpen = () => {
    if (open && !minimized) { setOpen(false); stopSpeaking(); }
    else { setOpen(true); setMinimized(false); }
  };

  return (
    <>
      {/* FAB */}
      <div className="chat-fab-wrap">
        {!open && <div className="chat-fab-label">Ask UrjaDhara AI</div>}
        <button className={`chat-fab ${open ? 'open' : ''}`} onClick={toggleOpen} aria-label="Open chat">
          {open ? '✕' : (
            <span className="fab-inner">
              <span className="fab-icon">🤖</span>
              <span className="fab-ping" />
            </span>
          )}
        </button>
      </div>

      {open && !minimized && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-left">
              <div className="bot-avatar">
                <span>🤖</span>
                <span className={`bot-status ${loading ? 'thinking' : 'online'}`} />
              </div>
              <div>
                <div className="bot-name">UrjaDhara AI</div>
                <div className="bot-status-text">{loading ? 'Thinking...' : speaking ? `🔊 Speaking in ${CHAT_LANGS.find(l=>l.code===chatLang)?.label || 'English'}...` : 'Online'}</div>
              </div>
            </div>
            <div className="chat-header-right">
              <select value={chatLang} onChange={e => { setChatLang(e.target.value); stopSpeaking(); }} className="chat-lang-select">
                {CHAT_LANGS.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
              </select>
              <button
                className={`voice-toggle ${voiceEnabled ? 'on' : 'off'}`}
                onClick={() => { setVoiceEnabled(!voiceEnabled); stopSpeaking(); }}
                title={voiceEnabled ? 'Voice ON — click to mute' : 'Voice OFF — click to enable'}
              >
                {voiceEnabled ? '🔊' : '🔇'}
              </button>
              <button className="chat-minimize" onClick={() => setMinimized(true)} title="Minimize">—</button>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((m) => (
              <div key={m.id} className={`chat-msg ${m.role}`}>
                {m.role === 'bot' && (
                  <div className="bot-msg-avatar">🤖</div>
                )}
                <div className="msg-wrap">
                  <div className={`msg-bubble ${m.role === 'bot' && speakingId === m.id ? 'speaking-bubble' : ''}`}>
                    <div className="msg-text">{renderText(m.text)}</div>
                    {m.role === 'bot' && speakingId === m.id && (
                      <div className="sound-wave">
                        {[...Array(5)].map((_, i) => <span key={i} style={{ animationDelay: `${i * 0.1}s` }} />)}
                      </div>
                    )}
                  </div>
                  <div className="msg-actions">
                    <span className="msg-time">{m.time ? formatTime(m.time) : ''}</span>
                    {m.role === 'bot' && (
                      <>
                        <button
                          className={`msg-action-btn ${speakingId === m.id && speaking ? 'active-speak' : ''}`}
                          onClick={() => speakMessage(m)}
                          title={speakingId === m.id && speaking ? 'Stop speaking' : 'Read aloud'}
                        >
                          {speakingId === m.id && speaking ? '⏹' : '🔊'}
                        </button>
                        <button
                          className="msg-action-btn"
                          onClick={() => copyMessage(m.text, m.id)}
                          title="Copy"
                        >
                          {copied === m.id ? '✅' : '📋'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-msg bot">
                <div className="bot-msg-avatar">🤖</div>
                <div className="msg-wrap">
                  <div className="msg-bubble typing">
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          {messages.length <= 1 && (
            <div className="quick-prompts">
              {QUICK_PROMPTS.map((q, i) => (
                <button key={i} className="quick-prompt-btn" onClick={() => sendMessage(q.text)}>
                  {q.icon} {q.text}
                </button>
              ))}
            </div>
          )}

          {/* Listening overlay */}
          {listening && (
            <div className="listening-overlay">
              <div className="mic-waves">
                <span /><span /><span /><span />
              </div>
              <p>{interimText || 'Listening... speak now'}</p>
              <button onClick={() => recognitionRef.current?.stop()}>Stop</button>
            </div>
          )}

          {/* Input */}
          <div className="chat-input-area">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={listening ? 'Listening...' : 'Type or use mic...'}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
              disabled={listening}
            />
            <button
              className={`mic-btn ${listening ? 'listening' : ''}`}
              onClick={startMic}
              title={listening ? 'Stop listening' : 'Speak your question'}
            >
              {listening ? '⏹' : '🎤'}
            </button>
            <button
              className="send-btn"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Minimized bar */}
      {open && minimized && (
        <div className="chat-minimized" onClick={() => setMinimized(false)}>
          <span>🤖 UrjaDhara AI</span>
          <span className="min-ping" />
          <span>▲</span>
        </div>
      )}
    </>
  );
}
