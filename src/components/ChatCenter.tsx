import React, { useState, useEffect, useRef } from 'react';
import { 
  listenToUserChats, 
  listenToMessages, 
  sendMessage, 
  Chat, 
  Message 
} from '../firebase/dbService';
import { 
  MessageSquare, 
  Send, 
  User, 
  MessageCircle, 
  ArrowLeft, 
  ExternalLink 
} from 'lucide-react';

interface ChatCenterProps {
  currentUserId: string;
  userRole: 'customer' | 'professional';
}

export default function ChatCenter({ currentUserId, userRole }: ChatCenterProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingChats, setLoadingChats] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Subscribe to user's chat threads
  useEffect(() => {
    if (!currentUserId) return;
    setLoadingChats(true);
    const unsubscribe = listenToUserChats(currentUserId, userRole, (userChats) => {
      setChats(userChats);
      setLoadingChats(false);
      
      // If a chat is selected, update its reference in case there are new updates
      if (selectedChat) {
        const updatedSelected = userChats.find(c => c.id === selectedChat.id);
        if (updatedSelected) {
          setSelectedChat(updatedSelected);
        }
      }
    });
    return () => unsubscribe();
  }, [currentUserId, userRole]);

  // Subscribe to messages in the active chat
  useEffect(() => {
    if (!selectedChat) {
      setMessages([]);
      return;
    }
    const unsubscribe = listenToMessages(selectedChat.id, (chatMessages) => {
      setMessages(chatMessages);
      // Auto scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });
    return () => unsubscribe();
  }, [selectedChat]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChat || !newMessageText.trim() || !currentUserId) return;
    setSending(true);
    try {
      await sendMessage(selectedChat.id, currentUserId, newMessageText.trim());
      setNewMessageText('');
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setSending(false);
    }
  };

  const handleViewProfile = (proId: string) => {
    window.location.hash = `#profile?id=${proId}`;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-150 overflow-hidden flex flex-col md:flex-row h-[600px] shadow-sm">
      {/* Sidebar: Chat List */}
      <div className={`w-full md:w-80 border-r border-slate-100 flex flex-col shrink-0 ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-800 flex items-center space-x-1.5">
            <MessageSquare className="h-4.5 w-4.5 text-blue-600" />
            <span>My Conversations</span>
          </h3>
          <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
            {chats.length} active
          </span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
          {loadingChats ? (
            <div className="flex items-center justify-center py-24 space-y-2 flex-col">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-[11px] text-slate-400">Loading chats...</span>
            </div>
          ) : chats.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-2 mt-12">
              <MessageSquare className="h-8 w-8 text-slate-200 mx-auto" />
              <p className="text-xs font-semibold text-slate-500">No chats found</p>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Start a chat by visiting a professional profile and clicking "Chat In-App".
              </p>
            </div>
          ) : (
            chats.map((chat) => {
              const otherName = userRole === 'customer' ? chat.professionalName : chat.customerName;
              const otherPhoto = userRole === 'customer' ? chat.professionalPhoto : chat.customerPhoto;
              const isActive = selectedChat?.id === chat.id;

              return (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`w-full p-4 flex items-start space-x-3 text-left transition-colors cursor-pointer ${isActive ? 'bg-blue-50/50' : 'hover:bg-slate-50/60'}`}
                >
                  <img
                    src={otherPhoto}
                    alt={otherName}
                    className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="font-bold text-xs text-slate-800 truncate">{otherName}</h4>
                      <span className="text-[9px] text-slate-400 shrink-0">
                        {chat.lastMessageAt?.toDate ? chat.lastMessageAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {chat.lastMessageSenderId === currentUserId ? 'You: ' : ''}{chat.lastMessage}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main Panel: Active Conversation */}
      <div className={`flex-1 flex flex-col h-full ${!selectedChat ? 'hidden md:flex bg-slate-50' : 'flex bg-white'}`}>
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3 text-left">
                {/* Mobile Back Button */}
                <button 
                  onClick={() => setSelectedChat(null)}
                  className="md:hidden text-slate-400 hover:text-white mr-1 cursor-pointer focus:outline-hidden"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>

                <img
                  src={userRole === 'customer' ? selectedChat.professionalPhoto : selectedChat.customerPhoto}
                  alt={userRole === 'customer' ? selectedChat.professionalName : selectedChat.customerName}
                  className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-700"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-extrabold text-xs text-white">
                    {userRole === 'customer' ? selectedChat.professionalName : selectedChat.customerName}
                  </h4>
                  <span className="text-[10px] text-slate-400 block">
                    {userRole === 'customer' ? 'Service Professional' : 'FixKer Customer'}
                  </span>
                </div>
              </div>

              {userRole === 'customer' && (
                <button
                  onClick={() => handleViewProfile(selectedChat.professionalId)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <span>View Profile</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Message Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 flex flex-col">
              {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-2">
                  <MessageCircle className="h-8 w-8 text-slate-300" />
                  <p className="text-xs text-slate-400">No messages in this chat yet.</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.senderId === currentUserId;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[70%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
                    >
                      <div
                        className={`p-3 rounded-2xl text-xs leading-relaxed ${isMe ? 'bg-blue-600 text-white rounded-tr-none text-right shadow-xs' : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none text-left shadow-2xs'}`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1">
                        {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex items-center space-x-2 shrink-0">
              <input
                type="text"
                placeholder="Type your message here..."
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                className="flex-1 p-3 border border-slate-200 rounded-xl text-xs focus:outline-hidden text-slate-700 bg-slate-50 font-medium"
                required
              />
              <button
                type="submit"
                disabled={sending || !newMessageText.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white p-3 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-2 text-slate-400">
            <MessageSquare className="h-12 w-12 text-slate-200" />
            <h4 className="font-extrabold text-slate-800 text-sm">Select a Conversation</h4>
            <p className="text-xs max-w-xs leading-relaxed text-slate-400">
              Click any active conversation in the side panel to view messages and coordinate real-time details with the other party.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
