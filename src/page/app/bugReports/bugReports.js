import React, { useEffect, useState, useRef, useCallback } from 'react';
import useAxios from '../../../hooks/use-axios';
import { authAxios } from '../../../config/axios-config';
import api from '../../../api';
import { Dimmer } from 'semantic-ui-react';
import LodingTestAllatre from '../../../components/shared/lotties-file/loding-test-allatre';
import moment from 'moment';
import { FaPaperPlane } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useSocket } from '../../../context/socket-context';

const BugReports = () => {
    const socket = useSocket();
    const [reports, setReports] = useState([]);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [selectedReport, setSelectedReport] = useState(null);
    const [reportDetails, setReportDetails] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);

    const counts = {
        PENDING: reports.filter(r => r.status === 'PENDING').length,
        IN_PROGRESS: reports.filter(r => r.status === 'IN_PROGRESS').length,
        SOLVED: reports.filter(r => r.status === 'SOLVED').length,
        TOTAL: reports.length
    };

    const filteredReports = reports.filter(r => 
        filterStatus === 'ALL' || r.status === filterStatus
    );

    useEffect(() => {
        if (!socket) return;

        const handleNewMessageGlobal = (data) => {
            // Update the main list status/last message if needed
            setReports(prev => prev.map(report => {
                if (report.id === data.reportId) {
                    return {
                        ...report,
                        hasNewMessage: true, // Local flag for UI
                        lastMessage: data.message
                    };
                }
                return report;
            }));
        };

        socket.on("new_bug_report_message", handleNewMessageGlobal);
        return () => socket.off("new_bug_report_message", handleNewMessageGlobal);
    }, [socket]);

    useEffect(() => {
        if (!socket || !selectedReport || !reportDetails) return;

        const room = `bug_report:${selectedReport.id}`;
        socket.emit("room:join", room);

        const handleNewMessage = (data) => {
            if (data.reportId === selectedReport.id) {
                setReportDetails((prev) => {
                    if (!prev) return prev;
                    if (prev.messages.some((m) => m.id === data.message.id)) return prev;
                    return {
                        ...prev,
                        messages: [...prev.messages, data.message],
                    };
                });
                
                // Clear the new message flag for this report specifically if it's the open one
                setReports(prev => prev.map(r => r.id === data.reportId ? { ...r, hasNewMessage: false } : r));
            }
        };

        socket.on("new_bug_report_message", handleNewMessage);

        return () => {
            socket.emit("room:leave", room);
            socket.off("new_bug_report_message", handleNewMessage);
        };
    }, [socket, selectedReport, reportDetails]);

    const problemStatuses = ['PENDING', 'SOLVED', 'IN_PROGRESS'];

    const { run, isLoading } = useAxios([]);
    const { run: runDetails, isLoading: isDetailsLoading } = useAxios([]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        run(
            authAxios.get(api.app.getBugReports)
                .then((res) => {
                    setReports(res?.data?.data || []);
                })
                .catch((err) => {
                    console.error("Error fetching bug reports:", err);
                })
        );
    }, [run]);

    const fetchDetails = useCallback((id) => {
        // Clear flag when opening
        setReports(prev => prev.map(r => r.id === id ? { ...r, hasNewMessage: false } : r));
        
        runDetails(
            authAxios.get(api.app.getBugReportDetails(id))
                .then((res) => {
                    setReportDetails(res.data.data);
                })
                .catch((err) => {
                    toast.error("Failed to fetch report details");
                })
        );
    }, [runDetails]);

    useEffect(() => {
        if (selectedReport) {
            fetchDetails(selectedReport.id);
        } else {
            setReportDetails(null);
        }
    }, [selectedReport, fetchDetails]);

    useEffect(() => {
        scrollToBottom();
    }, [reportDetails?.messages]);

    const handleStatusChange = (reportId, newStatus) => {
        run(
            authAxios
                .patch(api.app.updateBugReportStatus(reportId), {
                    status: newStatus,
                })
                .then(() => {
                    setReports((prevReports) =>
                        prevReports.map((req) =>
                            req.id === reportId ? { ...req, status: newStatus } : req
                        )
                    );
                    if (reportDetails && reportDetails.id === reportId) {
                        setReportDetails(prev => ({ ...prev, status: newStatus }));
                    }
                })
                .catch((err) => {
                    console.error("Error updating status:", err);
                })
        );
    };

    const handleSendMessage = () => {
        if (!newMessage.trim() || !reportDetails) return;

        setIsSending(true);
        authAxios
            .post(api.app.addBugReportMessage(reportDetails.id), { message: newMessage })
            .then((res) => {
                setReportDetails((prev) => ({
                    ...prev,
                    messages: [...prev.messages, res.data.data],
                }));
                setNewMessage("");
            })
            .catch((err) => {
                toast.error("Failed to send message");
            })
            .finally(() => {
                setIsSending(false);
            });
    };

    return (
        <div className="p-6">
            <Dimmer
                className="fixed w-full h-full top-0 bg-white/50"
                active={isLoading}
                inverted
            >
                <LodingTestAllatre />
            </Dimmer>
            
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Bug Reports</h2>
                <div className="flex gap-2">
                    {['ALL', 'PENDING', 'IN_PROGRESS', 'SOLVED'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                                filterStatus === status 
                                    ? 'bg-primary text-white scale-105' 
                                    : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
                            }`}
                        >
                            {status}
                            {status !== 'ALL' && <span className="ml-2 opacity-60">({counts[status]})</span>}
                        </button>
                    ))}
                </div>
            </div>

            {/* Status Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Reports', count: counts.TOTAL, color: 'blue', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
                    { label: 'Pending', count: counts.PENDING, color: 'red', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                    { label: 'In Progress', count: counts.IN_PROGRESS, color: 'yellow', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                    { label: 'Solved', count: counts.SOLVED, color: 'green', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }
                ].map((card, i) => (
                    <div key={i} className={`bg-white p-5 rounded-2xl shadow-sm border-l-4 border-${card.color}-500 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer`}
                        onClick={() => setFilterStatus(card.label === 'Total Reports' ? 'ALL' : card.label.replace(' ', '_').toUpperCase())}>
                        <div className={`p-3 rounded-xl bg-${card.color}-50 text-${card.color}-600`}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={card.icon} />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{card.label}</p>
                            <p className="text-2xl font-black text-gray-800">{card.count}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="table-auto w-full border-collapse">
                    <thead className="bg-gray-50/50 text-left text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                        <tr>
                            <th className="px-6 py-5 border-b border-gray-100">Date & Time</th>
                            <th className="px-6 py-5 border-b border-gray-100">User / Email</th>
                            <th className="px-6 py-5 border-b border-gray-100 w-1/3">Description</th>
                            <th className="px-6 py-5 border-b border-gray-100 text-center">Status</th>
                            <th className="px-6 py-5 border-b border-gray-100 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredReports.length > 0 ? filteredReports.map((report) => (
                            <tr key={report.id} className={`hover:bg-primary/5 transition-colors group ${report.hasNewMessage ? 'bg-primary/[0.02]' : ''}`}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-bold text-gray-800">{new Date(report.createdAt).toLocaleDateString()}</div>
                                    <div className="text-[10px] text-gray-400 font-medium">{new Date(report.createdAt).toLocaleTimeString()}</div>
                                </td>
                                <td className="px-6 py-4">
                                    {report.user ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                {report.user.userName[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-primary-dark">{report.user.userName}</div>
                                                <div className="text-[10px] text-gray-400 font-medium">{report.user.email}</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xs uppercase">
                                                G
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-gray-800 italic">{report.email || "Guest"}</div>
                                                <div className="text-[10px] text-gray-400 font-medium">No account</div>
                                            </div>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-start gap-2">
                                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{report.description}</p>
                                        {report.images?.length > 0 && (
                                            <span className="flex-shrink-0 bg-blue-50 text-blue-500 p-1 rounded-md">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <select
                                            value={report.status}
                                            onChange={(e) => handleStatusChange(report.id, e.target.value)}
                                            className={`text-[10px] font-black rounded-lg px-3 py-1.5 border-none cursor-pointer shadow-sm transition-all focus:ring-2 focus:ring-primary ${
                                                report.status === 'SOLVED' ? 'bg-green-100 text-green-700' : 
                                                report.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700' : 
                                                'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {problemStatuses.map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                        {report.hasNewMessage && (
                                            <span className="flex items-center gap-1 text-[9px] font-bold text-primary animate-pulse uppercase tracking-tighter">
                                                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                                                New Reply
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() => setSelectedReport(report)}
                                        className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-xl font-bold text-xs transition-all duration-300 transform group-hover:scale-105 active:scale-95 shadow-sm"
                                    >
                                        Open Details
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center opacity-30">
                                        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-lg font-bold">No {filterStatus !== 'ALL' ? filterStatus.toLowerCase() : ''} reports found.</p>
                                        <p className="text-sm ">Clear filters to see all reports</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Detailed View Modal */}
            {selectedReport && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col scale-in">
                        <div className="px-8 py-5 border-b flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Bug Report Details</h3>
                                <p className="text-xs text-gray-500 mt-1">Ticket ID: #{selectedReport.id}</p>
                            </div>
                            <button 
                                onClick={() => setSelectedReport(null)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="flex-grow overflow-hidden flex flex-col lg:flex-row">
                            {/* Left Panel: Report Info */}
                            <div className="lg:w-1/2 p-6 overflow-y-auto border-b lg:border-b-0 lg:border-r bg-white custom-scrollbar">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Reporter</h4>
                                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <p className="text-sm font-semibold text-primary">{selectedReport.user?.userName || "Guest"}</p>
                                                <p className="text-xs text-gray-500 truncate">{selectedReport.user?.email || selectedReport.email || "N/A"}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</h4>
                                            <select
                                                value={selectedReport.status}
                                                onChange={(e) => handleStatusChange(selectedReport.id, e.target.value)}
                                                className={`w-full text-xs font-bold rounded-lg px-3 py-2.5 border uppercase ${
                                                    selectedReport.status === 'SOLVED' ? 'bg-green-50 text-green-700 border-green-200' : 
                                                    selectedReport.status === 'IN_PROGRESS' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                                                    'bg-red-50 text-red-700 border-red-200'
                                                }`}
                                            >
                                                {problemStatuses.map((status) => (
                                                    <option key={status} value={status}>{status}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Description</h4>
                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 min-h-[100px]">
                                            <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                                                {selectedReport.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Evidence ({selectedReport.images?.length || 0})</h4>
                                        {selectedReport.images && selectedReport.images.length > 0 ? (
                                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                                {selectedReport.images.map((img, index) => (
                                                    <div 
                                                        key={index} 
                                                        className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 cursor-zoom-in group shadow-sm hover:shadow-md transition-all"
                                                        onClick={() => window.open(img.imageLink, '_blank')}
                                                    >
                                                        <img 
                                                            src={img.imageLink} 
                                                            alt="Bug content"
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-400 italic">No media attached.</p>
                                        )}
                                    </div>
                                    <div className="text-[10px] text-gray-400 border-t pt-4">
                                        Reported on: {new Date(selectedReport.createdAt).toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            {/* Right Panel: Conversation */}
                            <div className="lg:w-1/2 flex flex-col bg-gray-50 overflow-hidden">
                                <div className="p-4 border-b bg-white flex justify-between items-center">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Conversation History</h4>
                                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                                        {reportDetails?.messages?.length || 0} Messages
                                    </span>
                                </div>

                                <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
                                    {isDetailsLoading && !reportDetails ? (
                                        <div className="flex flex-col items-center justify-center h-full opacity-40 italic text-sm">
                                            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-2" />
                                            Loading conversation...
                                        </div>
                                    ) : reportDetails?.messages?.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400 italic text-sm py-10">
                                            <svg className="w-12 h-12 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                            No messages exchanged yet.
                                        </div>
                                    ) : (
                                        <>
                                            {reportDetails?.messages?.map((msg, index) => {
                                                const isMine = !!msg.adminId;
                                                return (
                                                    <div key={index} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                                                        <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${
                                                            isMine 
                                                                ? "bg-primary text-white rounded-tr-none" 
                                                                : "bg-white text-gray-800 rounded-tl-none border border-gray-200"
                                                        }`}>
                                                            {!isMine && (
                                                                <p className="text-[9px] font-black uppercase mb-1.5 opacity-60">
                                                                    User: {reportDetails.user?.userName || "Guest"}
                                                                </p>
                                                            )}
                                                            <p className="text-sm leading-relaxed">{msg.message}</p>
                                                            <p className={`text-[8px] mt-1.5 opacity-50 font-mono ${isMine ? "text-right" : "text-left"}`}>
                                                                {moment(msg.createdAt).format("LT")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <div ref={messagesEndRef} />
                                        </>
                                    )}
                                </div>

                                {/* Reply Input Area */}
                                <div className="p-4 bg-white border-t border-gray-200">
                                    <div className="flex gap-2 items-center bg-gray-50 border border-gray-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all rounded-xl px-3 py-1.5 shadow-inner">
                                        <input
                                            type="text"
                                            className="flex-1 bg-transparent border-none outline-none text-gray-800 py-2 text-sm placeholder:text-gray-400"
                                            placeholder="Write a message as Admin..."
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                                            disabled={isSending || isDetailsLoading}
                                        />
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={isSending || isDetailsLoading || !newMessage.trim()}
                                            className={`${
                                                isSending || !newMessage.trim() 
                                                    ? "opacity-30 cursor-not-allowed text-gray-400" 
                                                    : "text-primary hover:text-primary-dark hover:scale-110 active:scale-95"
                                            } transition-all duration-200 p-2`}
                                        >
                                            <FaPaperPlane size={18} />
                                        </button>
                                    </div>
                                    <p className="text-[9px] text-gray-400 mt-2 ml-1 italic text-center">
                                        Replies sent here will notify the user.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BugReports;
