
import React, { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import { cn } from "@/lib/utils";
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mic, Send, Smile, Image as ImageIcon } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';

// Types for our message data
type Message = {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  isOwn: boolean;
};

type Contact = {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline';
  lastSeen?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unread?: number;
  group?: boolean;
  members?: string[];
};

const MessagesPage = () => {
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'groups' | 'people'>('groups');
  const { currentUser } = useAuthContext();
  
  const messageEndRef = React.useRef<HTMLDivElement>(null);

  // Mock data initialization
  useEffect(() => {
    // Initialize contacts data
    const mockGroups: Contact[] = [
      { 
        id: '1', 
        name: 'Friends Forever', 
        status: 'online', 
        lastMessageTime: 'Today, 5:52pm',
        unread: 1,
        group: true,
        members: ['You', 'John', 'Mary']
      },
      { 
        id: '2', 
        name: 'Mera Gang', 
        status: 'offline', 
        lastMessageTime: 'Yesterday, 7:30',
        unread: 0,
        group: true,
        members: ['You', 'Rajuuuuu777']
      },
      { 
        id: '3', 
        name: 'Hiking', 
        status: 'offline', 
        lastMessageTime: 'Wednesday, 4:12am',
        unread: 0,
        group: true,
        members: ["It's not so big to happen"]
      },
    ];
    
    const mockPeople: Contact[] = [
      { 
        id: '4', 
        name: 'Anil', 
        status: 'online', 
        lastSeen: 'Last seen: 2:02pm',
        lastMessageTime: 'Today, 2:52pm',
        unread: 0
      },
      { 
        id: '5', 
        name: 'Chuthiya', 
        status: 'offline', 
        lastMessageTime: '10/02, 12:18m',
        unread: 1
      },
      { 
        id: '6', 
        name: 'Mary ma\'am', 
        status: 'online', 
        lastMessageTime: 'Today, 7:40pm',
        unread: 1
      },
      { 
        id: '7', 
        name: 'Bill Gates', 
        status: 'offline', 
        lastMessageTime: 'Yesterday, 12:21pm',
        unread: 0
      },
      { 
        id: '8', 
        name: 'Victoria H', 
        status: 'offline', 
        lastMessageTime: 'Wednesday, 11:12am',
        unread: 0
      },
    ];
    
    setContacts([...mockGroups, ...mockPeople]);
    
    // Set default active contact
    const defaultContact = mockPeople.find(c => c.id === '4');
    setActiveContact(defaultContact || null);
    
    // Initialize messages for the default contact
    if (defaultContact) {
      const mockMessages: Message[] = [
        {
          id: '1',
          text: 'Hey There!',
          sender: defaultContact.id,
          timestamp: new Date(new Date().setHours(new Date().getHours() - 2)),
          isOwn: false
        },
        {
          id: '2',
          text: 'How are you?',
          sender: defaultContact.id,
          timestamp: new Date(new Date().setHours(new Date().getHours() - 1)),
          isOwn: false
        },
        {
          id: '3',
          text: 'Hello!',
          sender: 'me',
          timestamp: new Date(new Date().setMinutes(new Date().getMinutes() - 45)),
          isOwn: true
        },
        {
          id: '4',
          text: 'I am fine and how are you?',
          sender: 'me',
          timestamp: new Date(new Date().setMinutes(new Date().getMinutes() - 44)),
          isOwn: true
        },
        {
          id: '5',
          text: 'I am doing well, Can we meet tomorrow?',
          sender: defaultContact.id,
          timestamp: new Date(new Date().setMinutes(new Date().getMinutes() - 30)),
          isOwn: false
        },
        {
          id: '6',
          text: 'Yes Sure!',
          sender: 'me',
          timestamp: new Date(new Date().setMinutes(new Date().getMinutes() - 20)),
          isOwn: true
        },
      ];
      
      setMessages(mockMessages);
    }
  }, []);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Filter contacts based on search term and active tab
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'groups' ? contact.group : !contact.group;
    return matchesSearch && matchesTab;
  });
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !activeContact) return;
    
    const newMsg: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'me',
      timestamp: new Date(),
      isOwn: true
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    // Simulate reply after 1 second
    setTimeout(() => {
      const replyMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: `Thanks for your message: "${newMessage}"`,
        sender: activeContact.id,
        timestamp: new Date(),
        isOwn: false
      };
      setMessages(prev => [...prev, replyMsg]);
    }, 1000);
  };
  
  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <PageLayout>
      <div className="flex h-[calc(100vh-72px)]">
        {/* Left sidebar - Contact list */}
        <div className="w-full max-w-xs border-r border-gray-200 bg-gray-50 flex flex-col">
          {/* Search bar */}
          <div className="p-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 bg-white"
              />
              <svg className="absolute left-3 top-3 h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button 
              className={cn(
                "flex-1 py-2 font-medium text-sm",
                activeTab === 'groups' 
                  ? "border-b-2 border-agri-primary text-agri-primary" 
                  : "text-gray-500"
              )}
              onClick={() => setActiveTab('groups')}
            >
              Groups
            </button>
            <button 
              className={cn(
                "flex-1 py-2 font-medium text-sm",
                activeTab === 'people' 
                  ? "border-b-2 border-agri-primary text-agri-primary" 
                  : "text-gray-500"
              )}
              onClick={() => setActiveTab('people')}
            >
              People
            </button>
          </div>
          
          {/* Contact list */}
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.map(contact => (
              <div 
                key={contact.id}
                className={cn(
                  "flex items-center p-4 hover:bg-gray-100 cursor-pointer relative",
                  activeContact?.id === contact.id ? "bg-gray-100" : ""
                )}
                onClick={() => setActiveContact(contact)}
              >
                <Avatar className="h-10 w-10 mr-3">
                  <div className="bg-gray-300 h-full w-full flex items-center justify-center text-lg font-medium uppercase text-gray-600">
                    {contact.name.charAt(0)}
                  </div>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <p className="font-medium truncate">{contact.name}</p>
                    <span className="text-xs text-gray-500">{contact.lastMessageTime}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {contact.group ? contact.members?.[0] : "Alt - Tools dev"}
                  </p>
                </div>
                {contact.unread && contact.unread > 0 && (
                  <span className="absolute right-4 top-4 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                    {contact.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Right side - Chat area */}
        <div className="flex-1 flex flex-col bg-white">
          {activeContact ? (
            <>
              {/* Chat header */}
              <div className="border-b border-gray-200 p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-3">
                    <div className="bg-gray-300 h-full w-full flex items-center justify-center text-lg font-medium uppercase text-gray-600">
                      {activeContact.name.charAt(0)}
                    </div>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{activeContact.name}</h3>
                    <p className="text-xs text-gray-500">
                      {activeContact.status === 'online' ? 'Online' : activeContact.lastSeen}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-gray-500">
                  <button className="hover:text-agri-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </button>
                  <button className="hover:text-agri-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </button>
                  <button className="hover:text-agri-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="1"></circle>
                      <circle cx="19" cy="12" r="1"></circle>
                      <circle cx="5" cy="12" r="1"></circle>
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={cn(
                      "flex",
                      message.isOwn ? "justify-end" : "justify-start"
                    )}
                  >
                    <div 
                      className={cn(
                        "rounded-lg px-4 py-2 max-w-[75%] break-words",
                        message.isOwn 
                          ? "bg-agri-primary text-white rounded-br-none" 
                          : "bg-gray-200 text-gray-800 rounded-bl-none"
                      )}
                    >
                      <p>{message.text}</p>
                      <p className={cn(
                        "text-xs mt-1 text-right",
                        message.isOwn ? "text-white/80" : "text-gray-500"
                      )}>
                        {formatMessageTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messageEndRef} />
              </div>
              
              {/* Message input */}
              <div className="border-t border-gray-200 p-4 bg-white">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="text-gray-500 hover:text-agri-primary"
                  >
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    className="text-gray-500 hover:text-agri-primary"
                  >
                    <ImageIcon className="h-5 w-5" />
                  </Button>
                  <Input
                    type="text"
                    placeholder="Type your message here..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    className="text-gray-500 hover:text-agri-primary"
                  >
                    <Mic className="h-5 w-5" />
                  </Button>
                  <Button 
                    type="submit"
                    size="icon"
                    className="bg-agri-primary hover:bg-agri-primary-dark"
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <h3 className="font-medium text-lg mb-1">No conversation selected</h3>
                <p>Choose a contact to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default MessagesPage;
