import React, { useState, useEffect, useRef, useCallback } from "react";
import useAxios from "../../../hooks/use-axios";
import { authAxios } from "../../../config/axios-config";
import api from "../../../api";
import { toast } from 'react-hot-toast';
import { useSocket } from '../../../context/socket-context';
import moment from 'moment';
import { FaPaperPlane, FaSearch, FaBug, FaExclamationCircle, FaSpinner, FaArrowLeft } from 'react-icons/fa';

const BugMessages = () => {
    const socket = useSocket();
    const [reports, setReports] = useState([]);
    const [selectedReportId, setSelectedReportId] = useState(null);
    const [reportDetails, setReportDetails] = useState(null);
    const [newMessage, setNewMessage] = useState("");

    // Disable body scroll when component is mounted
    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);
    const [isSending, setIsSending] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterBy, setFilterBy] = useState("ALL"); // ALL, PENDING, IN_PROGRESS
    
    const messagesEndRef = useRef(null);
    const { run: runReports, isLoading: isLoadingReports } = useAxios([]);
    const { run: runDetails, isLoading: isDetailsLoading } = useAxios([]);

    const scrollToBottom = (behavior = "auto") => {
        if (messagesEndRef.current) {
            // Use a small timeout to ensure the DOM has finished updating
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior });
            }, 50);
        }
    };

    const fetchReports = useCallback(() => {
        runReports(
            authAxios.get(api.app.getBugReports)
                .then((res) => {
                    setReports(res?.data?.data || []);
                })
        );
    }, [runReports]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    // WebSocket implementation for real-time thread updates
    useEffect(() => {
        if (!socket) return;

        const handleNewMessageGlobal = (data) => {
            setReports(prev => {
                const reportIdx = prev.findIndex(r => r.id === data.reportId);
                if (reportIdx !== -1) {
                    const report = prev[reportIdx];
                    const otherReports = prev.filter(r => r.id !== data.reportId);
                    
                    // Increment unread count if not currently selected
                    const isSelected = data.reportId === selectedReportId;
                    const newUnreadCount = isSelected ? 0 : (report.unreadCount || 0) + 1;

                    return [{
                        ...report,
                        unreadCount: newUnreadCount,
                        lastMessageAt: new Date().toISOString()
                    }, ...otherReports];
                } else {
                    fetchReports();
                    return prev;
                }
            });
        };

        socket.on("new_bug_report_message_global", handleNewMessageGlobal);
        socket.on("new_bug_report", (data) => fetchReports());

        return () => {
            socket.off("new_bug_report_message", handleNewMessageGlobal);
            socket.off("new_bug_report");
        };
    }, [socket, fetchReports, selectedReportId]);

    // Room management for active chat
    useEffect(() => {
        if (!socket || !selectedReportId) return;

        const room = `bug_report:${selectedReportId}`;
        socket.emit("room:join", room);

        const handleChatUpdate = (data) => {
            if (data.reportId === selectedReportId) {
                setReportDetails(prev => {
                    if (!prev) return prev;
                    if (prev.messages.some(m => m.id === data.message.id)) return prev;
                    return { ...prev, messages: [...prev.messages, data.message] };
                });
            }
        };

        socket.on("new_bug_report_message", handleChatUpdate);

        return () => {
            socket.emit("room:leave", room);
            socket.off("new_bug_report_message", handleChatUpdate);
        };
    }, [socket, selectedReportId]);

    const fetchDetails = useCallback((id) => {
        // Reset unread count locally when opened
        setReports(prev => prev.map(r => r.id === id ? { ...r, unreadCount: 0 } : r));
        
        runDetails(
            authAxios.get(api.app.getBugReportDetails(id))
                .then((res) => {
                    setReportDetails(res.data.data);
                })
        );
    }, [runDetails]);

    useEffect(() => {
        if (selectedReportId) {
            fetchDetails(selectedReportId);
        } else {
            setReportDetails(null);
        }
    }, [selectedReportId, fetchDetails]);

    useEffect(() => {
        if (reportDetails?.messages?.length > 0) {
            scrollToBottom();
        }
    }, [reportDetails?.messages]);

    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedReportId) return;
        setIsSending(true);
        authAxios
            .post(api.app.addBugReportMessage(selectedReportId), { message: newMessage })
            .then((res) => {
                setNewMessage("");
                // Immediate scroll after state clear
                scrollToBottom("smooth");
            })
            .catch(() => toast.error("Sending failed"))
            .finally(() => setIsSending(false));
    };

    const handleStatusUpdate = (newStatus) => {
        if (!selectedReportId) return;
        authAxios.patch(api.app.updateBugReportStatus(selectedReportId), { status: newStatus })
            .then(() => {
                setReports(prev => prev.map(r => r.id === selectedReportId ? { ...r, status: newStatus } : r));
                setReportDetails(prev => ({ ...prev, status: newStatus }));
                toast.success(`Status updated to ${newStatus}`);
            });
    };

    const filteredReports = reports
        .filter(r => {
            const matchesSearch = (r.user?.userName || r.user?.email || r.description || r.email || "").toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = filterBy === "ALL" || r.status === filterBy;
            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => new Date(b.updatedAt || b.lastMessageAt || 0) - new Date(a.updatedAt || a.lastMessageAt || 0));

    return (
        <div className={`flex flex-col pt-24 md:flex-row h-[calc(100vh-20px)] mt-4 md:mt-8 bg-[#0f172a] rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 relative`}>
            {/* Thread Sidebar - Brand Navy Dark */}
            <div className={`${selectedReportId ? 'hidden md:flex' : 'flex'} w-full md:w-[320px] bg-[#1e293b] flex flex-col relative z-10 shadow-2xl h-full border-r border-white/5`}>
                <div className="p-5 border-b border-white/5">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-[#d4af37] flex items-center justify-center shadow-lg shadow-[#d4af37]/20 ring-1 ring-white/10 flex-shrink-0">
                            <FaBug className="text-[#1e293b] text-lg" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white tracking-tight leading-none">Support Hub</h3>
                            <p className="text-[9px] font-black text-[#d4af37] uppercase tracking-[0.2em] mt-1.5">Executive Portal</p>
                        </div>
                    </div>
                    
                    <div className="relative group">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7484a0]/50 group-focus-within:text-[#d4af37] transition-colors text-xs" />
                        <input 
                            type="text" 
                            placeholder="Find..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-3 py-2.5 bg-white/5 rounded-xl border border-white/10 focus:border-[#d4af37]/50 focus:ring-2 focus:ring-[#d4af37]/10 text-[13px] font-semibold text-white transition-all placeholder:text-[#4d5f7c] shadow-inner"
                        />
                    </div>

                    <div className="flex p-0.5 bg-white/5 rounded-xl gap-0.5 mt-4 border border-white/5">
                        {['ALL', 'PENDING', 'IN_PROGRESS'].map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setFilterBy(tab)}
                                className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${
                                    filterBy === tab ? 'bg-[#d4af37] text-[#1e293b]' : 'text-[#7484a0] hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                    {isLoadingReports ? (
                        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                            <div className="w-12 h-12 bg-gray-200 rounded-full mb-4" />
                            <div className="h-4 w-32 bg-gray-200 rounded-xl" />
                        </div>
                    ) : filteredReports.length > 0 ? filteredReports.map(report => (
                        <div 
                            key={report.id}
                            onClick={() => setSelectedReportId(report.id)}
                            className={`p-3 rounded-xl cursor-pointer transition-all duration-300 border relative group ${
                                selectedReportId === report.id 
                                    ? 'bg-white/10 border-white/10 shadow-lg' 
                                    : 'bg-transparent border-transparent hover:bg-white/[0.03]'
                            }`}
                        >
                            {selectedReportId === report.id && (
                                <div className="absolute left-1 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full bg-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                            )}
                            
                            <div className="flex justify-between items-start mb-1.5">
                                <div className="flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] transition-colors shadow-inner flex-shrink-0 ${
                                        selectedReportId === report.id ? 'bg-[#d4af37] text-[#1e293b]' : 'bg-white/5 text-[#7484a0] group-hover:bg-white/10'
                                    }`}>
                                        {(report.user?.userName || report.email || "G")[0].toUpperCase()}
                                    </div>
                                    <div className="font-black text-[13px] text-white/90 tracking-tight leading-tight">
                                        {report.user?.userName || report.email || "Guest User"}
                                        <div className="text-[8px] text-[#4d5f7c] font-black tracking-tighter">#{report.id}</div>
                                    </div>
                                </div>
                                <div className="text-[8px] font-black text-[#4d5f7c] bg-white/3 px-1.5 py-0.5 rounded uppercase tracking-tighter group-hover:text-[#d4af37] transition-colors">
                                    {moment(report.updatedAt).fromNow(true)}
                                </div>
                            </div>

                            <p className="text-[11px] text-[#7484a0] line-clamp-1 font-medium px-0.5 mb-2 group-hover:text-gray-400">
                                {report.description}
                            </p>

                            <div className="flex justify-between items-center px-1">
                                <div className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-[0.1em] border ${
                                    report.status === 'SOLVED' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                    report.status === 'IN_PROGRESS' ? 'bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/20' :
                                    'bg-red-500/10 text-red-500 border-red-500/20'
                                }`}>
                                    {report.status}
                                </div>
                                
                                {report.unreadCount > 0 && (
                                    <div className="bg-[#d4af37] text-[#1e293b] text-[9px] font-black px-2 py-1 rounded-md shadow-lg shadow-[#d4af37]/20 animate-bounce">
                                        {report.unreadCount} NEW
                                    </div>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div className="py-20 text-center opacity-10">
                            <FaBug className="mx-auto text-6xl mb-4 text-white" />
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area - Brand Dark Canvas */}
            <div className={`${!selectedReportId ? 'hidden md:flex' : 'flex'} flex-1 flex flex-col bg-[#111827] h-full`}>
                {selectedReportId ? (
                    <>
                        {/* Chat Header */}
                        <div className="px-6 py-4 md:px-12 md:py-6 flex justify-between items-center bg-[#1e293b]/80 backdrop-blur-2xl sticky top-0 z-20 border-b border-white/5">
                            <div className="flex items-center gap-4 md:gap-6">
                                <button 
                                    onClick={() => setSelectedReportId(null)}
                                    className="md:hidden p-2 bg-white/5 rounded-xl text-[#d4af37]"
                                >
                                    <FaArrowLeft />
                                </button>
                                <div className="relative">
                                    <div className="w-10 h-10 md:w-16 md:h-16 rounded-[12px] md:rounded-[20px] bg-white/5 p-0.5 md:p-1 shadow-2xl ring-1 ring-white/10 overflow-hidden">
                                        {reportDetails?.user?.imageLink ? (
                                            <img 
                                                src={reportDetails.user.imageLink} 
                                                alt={reportDetails?.user?.userName} 
                                                className="w-full h-full object-cover rounded-[10px] md:rounded-[18px]"
                                            />
                                        ) : (
                                            <div className="w-full h-full rounded-[10px] md:rounded-[18px] bg-gradient-to-br from-[#1e293b] to-[#2a3a54] flex items-center justify-center text-white font-black text-lg md:text-2xl capitalize">
                                                {(reportDetails?.user?.userName || reportDetails?.email || "G")[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-4 border-[#1e293b] shadow-xl" />
                                </div>
                                <div>
                                    <h4 className="font-black text-base md:text-2xl text-white tracking-tighter flex items-center gap-2">
                                        {reportDetails?.user?.userName || reportDetails?.email || "Guest User"}
                                        <div className="w-1 h-1 rounded-full bg-white/10" />
                                        <span className="text-[7px] md:text-[9px] font-black bg-[#d4af37]/10 text-[#d4af37] px-2 py-0.5 rounded-full uppercase tracking-widest leading-none">Premium</span>
                                    </h4>
                                    <p className="text-[9px] md:text-[12px] font-bold text-[#7484a0] mt-0.5 md:mt-1 flex items-center flex-wrap gap-2 md:gap-4 overflow-hidden">
                                        <span className="truncate">ID: <span className="text-white">#{reportDetails?.user?.id || reportDetails?.userId || 'GUEST'}</span></span>
                                        <span className="opacity-20 hidden md:inline">•</span>
                                        <span className="text-white truncate">{reportDetails?.user?.email || reportDetails?.email || "No email"}</span>
                                        {reportDetails?.user?.phone && (
                                            <>
                                                <span className="opacity-20 hidden md:inline">•</span>
                                                <span className="text-white">{reportDetails.user.phone}</span>
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="hidden lg:flex bg-white/5 p-1 rounded-full border border-white/5">
                                {['PENDING', 'IN_PROGRESS', 'SOLVED'].map(st => (
                                    <button
                                        key={st}
                                        onClick={() => handleStatusUpdate(st)}
                                        className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-all duration-300 ${
                                            reportDetails?.status === st 
                                                ? (st === 'SOLVED' ? 'bg-green-600 text-white' : 
                                                   st === 'IN_PROGRESS' ? 'bg-[#d4af37] text-[#1e293b]' : 
                                                   'bg-red-600 text-white')
                                                : 'text-[#7484a0] hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        {st}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Issue Context Bar - Dark Premium */}
                        <div className="px-6 py-3 md:px-10 md:py-3.5 bg-white/3 border-b border-white/5 flex items-center justify-between backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#d4af37]/10 flex items-center justify-center">
                                    <FaExclamationCircle className="text-[#d4af37] text-xs" />
                                </div>
                                <div>
                                    <p className="text-[8px] uppercase font-black text-[#4d5f7c] tracking-[0.2em] mb-0.5">Context</p>
                                    <p className="text-[12px] text-white font-bold italic leading-none line-clamp-1">"{reportDetails?.description}"</p>
                                </div>
                            </div>
                            <div className="text-[9px] font-black text-[#7484a0]/30 uppercase tracking-widest hidden lg:block">
                                {moment(reportDetails?.createdAt).format('hh:mm A, MMM D')}
                            </div>
                        </div>

                        {/* Messages Feed */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 md:px-10 md:py-6 flex flex-col gap-2 md:gap-3 custom-scrollbar bg-[#111827]">
                            {isDetailsLoading && reportDetails?.messages?.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center py-10 md:py-20 grayscale opacity-40">
                                    <FaSpinner className="animate-spin text-3xl md:text-5xl mb-4 md:mb-6 text-white" />
                                    <p className="font-black text-sm md:text-lg tracking-widest uppercase text-white">Synchronizing...</p>
                                </div>
                            ) : reportDetails?.messages?.map((msg, i) => {
                                const isMe = !!msg.adminId;
                                return (
                                    <div key={msg.id} className={`flex flex-col group ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-[85%] md:max-w-[70%] py-2 px-5 rounded-[1rem] md:rounded-[1.8rem] text-[12px] md:text-[13px] font-semibold leading-snug shadow-sm transition-all duration-300 hover:shadow-2xl ${
                                            isMe 
                                                ? 'bg-[#1e293b] text-white rounded-tr-none shadow-black/20 border-r-4 border-[#d4af37]' 
                                                : 'bg-[#334155] text-white rounded-tl-none border border-white/5'
                                        }`}>
                                            {msg.message}
                                        </div>
                                        <div className={`flex items-center gap-2 mt-1 px-1 transition-opacity duration-300 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <span className="text-[9px] font-black text-[#7484a0] uppercase tracking-widest">
                                                {isMe ? 'EXECUTIVE SUPPORT' : (msg.user?.userName || 'Client')}
                                            </span>
                                            <span className="text-[9px] text-[#4d5f7c] font-black">•</span>
                                            <span className="text-[9px] font-black text-[#7484a0] capitalize bg-white/5 px-2 py-0.5 rounded-md">
                                                {moment(msg.createdAt).format('hh:mm A')}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Minimalist Message Input Area */}
                        <div className="px-6 py-4 md:px-10 md:py-3 bg-[#1e293b]/50 border-t border-white/5 backdrop-blur-lg">
                            <div className="relative group flex items-center gap-3 md:gap-4">
                                <div className="flex-1 relative">
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-6 py-2 pr-12 text-sm font-semibold text-white focus:bg-white/10 focus:border-[#d4af37]/30 focus:ring-4 focus:ring-[#d4af37]/5 transition-all shadow-inner min-h-[44px] max-h-[120px] resize-none overflow-hidden flex items-center"
                                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                                    />
                                </div>
                                <button
                                    onClick={handleSendMessage}
                                    disabled={isSending || !newMessage.trim()}
                                    className="w-11 h-11 bg-[#1e293b] text-[#d4af37] rounded-xl flex items-center justify-center shadow-2xl shadow-black/50 hover:bg-[#d4af37] hover:text-[#1e293b] hover:scale-105 active:scale-95 transition-all duration-300 disabled:grayscale disabled:opacity-30 flex-shrink-0 group"
                                >
                                    {isSending ? <FaSpinner className="animate-spin text-lg" /> : <FaPaperPlane className="text-sm group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-20 bg-[#0f172a] relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-[#111827] to-[#0f172a]" />
                        <div className="relative z-10 scale-110">
                            <div className="w-64 h-64 bg-[#1e293b] rounded-[50px] shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex items-center justify-center mb-12 transform -rotate-12 transition-transform duration-1000 hover:rotate-0 border-r-8 border-[#d4af37]">
                                <FaBug className="text-[120px] text-[#d4af37]/40 animate-pulse" />
                            </div>
                            <h4 className="text-5xl font-black text-white mb-4 tracking-tighter uppercase">Support Hub</h4>
                            <p className="text-lg font-bold text-[#7484a0] max-w-xs mx-auto leading-relaxed">
                                Select a conversation thread to experience our premium <span className="text-[#d4af37] italic">executive support line</span>.
                            </p>
                        </div>
                    </div>
                )}
            </div>
            
            <style jsx="true">{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 20px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
                
                @keyframes bounce-in {
                    0% { transform: scale(0.3) rotate(-20deg); opacity: 0; }
                    50% { transform: scale(1.05) rotate(5deg); }
                    70% { transform: scale(0.9) rotate(-3deg); }
                    100% { transform: scale(1) rotate(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default BugMessages;
