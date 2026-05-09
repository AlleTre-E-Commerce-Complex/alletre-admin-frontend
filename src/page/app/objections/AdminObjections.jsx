import React, { useEffect, useState } from "react";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import useAxios from "../../../hooks/use-axios";
import { Dimmer } from "semantic-ui-react";
import routes from "../../../routes";
import { useHistory } from "react-router-dom";
import { authAxios } from "../../../config/axios-config";
import api from "../../../api";
import LoadingTestAllatre from "../../../components/shared/lotties-file/loding-test-allatre";
import localizationKeys from "../../../localization/localization-keys";
import { formatCurrency } from "../../../utils/format-currency";
import moment from "moment";

const AdminObjections = () => {
  const language = useLanguage();
  const lang = (language && language[0]) || "en";
  const selectedContent = content[lang] || content["en"] || {};
  const history = useHistory();
  const [objections, setObjections] = useState([]);
  const { run, isLoading } = useAxios([]);

  const [selectedObjection, setSelectedObjection] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active"); // "active" or "solved"

  useEffect(() => {
    if (api?.app?.admin?.getObjections) {
      run(
        authAxios.get(api.app.admin.getObjections).then((res) => {
          setObjections(res?.data?.data || []);
        })
      );
    }
  }, [run]);

  const handleStatusChange = (id, newStatus) => {
    authAxios
      .patch(api.app.admin.updateObjectionStatus(id), { status: newStatus })
      .then(() => {
        setObjections((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: newStatus } : item
          )
        );
        if (selectedObjection?.id === id) {
          setSelectedObjection(prev => ({ ...prev, status: newStatus }));
        }
      })
      .catch((err) => {
        console.error("Error updating status:", err);
      });
  };

  const openModal = (objection) => {
    setSelectedObjection(objection);
    setIsModalOpen(true);
  };

  const filteredObjections = objections.filter((item) => {
    if (activeTab === "active") {
      return item.status === "PENDING" || item.status === "IN_PROGRESS";
    }
    return item.status === "SOLVED" || item.status === "RESOLVED";
  });

  return (
    <div className="mx-4 sm:mx-0 sm:ltr:ml-4 sm:rtl:mr-4 animate-in relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -left-24 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <Dimmer
        className="fixed w-full h-full top-0 bg-white"
        active={isLoading}
        inverted
      >
        <LoadingTestAllatre />
      </Dimmer>

      <div className="flex flex-col gap-6 p-4 md:p-6 min-h-[calc(100vh-140px)]">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedContent[localizationKeys.adminObjections]}
            </h1>
          </div>

          <div className="flex gap-2 p-1 bg-gray-100 dark:bg-white/5 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab("active")}
              className={`px-6 py-2.5 rounded-lg text-sm font-black transition-all duration-300 ${
                activeTab === "active"
                  ? "bg-white dark:bg-primary text-primary dark:text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              ACTIVE DISPUTES
            </button>
            <button
              onClick={() => setActiveTab("solved")}
              className={`px-6 py-2.5 rounded-lg text-sm font-black transition-all duration-300 ${
                activeTab === "solved"
                  ? "bg-white dark:bg-primary text-primary dark:text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              SOLVED
            </button>
          </div>
        </div>

        {filteredObjections.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 bg-white dark:bg-[#151A23] border border-gray-100 dark:border-gray-800 rounded-2xl p-8 shadow-sm">
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {activeTab === "active" 
                ? "No active disputes found" 
                : "No solved disputes found"}
            </p>
          </div>
        ) : (
          <div className="flex-1">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto bg-white/80 dark:bg-[#151A23]/80 backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none pb-20">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-black/10 text-sm uppercase text-gray-500 font-bold border-b border-gray-100 dark:border-gray-800">
                    <th className="px-6 py-4">{selectedContent[localizationKeys.product]}</th>
                    <th className="px-6 py-4">{selectedContent[localizationKeys.objectionBy]}</th>
                    <th className="px-6 py-4">{selectedContent[localizationKeys.reason]}</th>
                    <th className="px-6 py-4">{selectedContent[localizationKeys.documents]}</th>
                    <th className="px-6 py-4">{selectedContent[localizationKeys.status]}</th>
                    <th className="px-6 py-4">{selectedContent[localizationKeys.date]}</th>
                    <th className="px-6 py-4">{selectedContent[localizationKeys.actions]}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/50 dark:divide-gray-800/50">
                {filteredObjections.map((item) => (
                  <tr key={item.id} className="group hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300">
                    <td className="px-6 py-5 transition-transform duration-300 group-hover:translate-x-1">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.product?.images?.[0]?.imageLink} 
                          alt="" 
                          className="w-10 h-10 rounded object-cover border border-gray-200"
                        />
                        <div className="min-w-0">
                          <p className="text-base font-bold text-gray-900 dark:text-white truncate max-w-[150px]">
                            {item.product?.title}
                          </p>
                          <p className="text-xs text-gray-500">ID: {item.productId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-base">
                      <p className="font-bold text-gray-900 dark:text-white">{item.user?.userName}</p>
                      <p className="text-xs text-gray-500">{item.user?.email}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-base font-bold text-red-600 mb-0.5">{item.reason}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 max-w-[200px]">
                        {item.description}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {item.documents && item.documents.length > 0 ? (
                          item.documents.slice(0, 3).map((doc) => {
                            const isPdf = doc.imageLink?.toLowerCase().endsWith(".pdf") || doc.imagePath?.toLowerCase().endsWith(".pdf");
                            return (
                              <div 
                                key={doc.id}
                                className="relative w-8 h-8 group cursor-pointer"
                                onClick={() => window.open(doc.imageLink, '_blank')}
                              >
                                {isPdf ? (
                                  <div className="w-full h-full rounded bg-red-50 border border-red-100 flex flex-col items-center justify-center shadow-sm group-hover:bg-red-100 transition-colors">
                                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                                      <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                                    </svg>
                                  </div>
                                ) : (
                                  <img 
                                    src={doc.imageLink} 
                                    alt="" 
                                    className="w-full h-full rounded object-cover border border-gray-100 shadow-sm group-hover:opacity-75 transition-opacity"
                                  />
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <span className="text-[10px] text-gray-400 italic">{selectedContent[localizationKeys.noFiles]}</span>
                        )}
                        {item.documents?.length > 3 && (
                          <span className="text-[10px] text-gray-400 font-bold">+{item.documents.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className={`text-xs font-bold uppercase rounded-lg border-none focus:ring-0 cursor-pointer ${
                          item.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : 
                          item.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700" :
                          "bg-green-100 text-green-700"
                        }`}
                      >
                        <option value="PENDING">{selectedContent[localizationKeys.pending]}</option>
                        <option value="IN_PROGRESS">{selectedContent[localizationKeys.inProgress]}</option>
                        <option value="SOLVED">{selectedContent[localizationKeys.solved]}</option>
                      </select>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-500">
                      <div className="flex flex-col gap-1">
                        <span>{moment(item.createdAt).format("MMM DD, YYYY")}</span>
                        {(() => {
                          const isLate = item.repliedAt && moment(item.repliedAt).isAfter(moment(item.createdAt).add(2, 'days'));
                          const isExpiredNoReply = !item.repliedAt && moment().isAfter(moment(item.createdAt).add(2, 'days'));
                          
                          if (isLate) {
                            return (
                              <span className="text-[10px] font-black text-red-500 bg-red-50 dark:bg-red-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider w-fit">
                                Late Reply
                              </span>
                            );
                          }
                          if (isExpiredNoReply) {
                            return (
                              <span className="text-[10px] font-black text-red-500 bg-red-50 dark:bg-red-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider w-fit">
                                Expired
                              </span>
                            );
                          }
                          if (item.repliedAt) {
                            return (
                              <span className="text-[10px] font-black text-green-500 bg-green-50 dark:bg-green-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider w-fit">
                                Replied
                              </span>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm">
                      <button 
                        onClick={() => openModal(item)}
                        className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-white/5 text-primary hover:bg-primary hover:text-white font-bold transition-all duration-300"
                      >
                        {selectedContent[localizationKeys.viewDetails]}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

            {/* Mobile Card View */}
          <div className="lg:hidden flex flex-col gap-4">
            {filteredObjections.map((item) => (
              <div key={item.id} className="bg-white/80 dark:bg-[#151A23]/80 backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.product?.images?.[0]?.imageLink} 
                      alt="" 
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                    />
                    <div>
                      <p className="text-base font-bold text-gray-900 dark:text-white truncate max-w-[150px]">
                        {item.product?.title}
                      </p>
                      <p className="text-xs text-gray-500">ID: {item.productId}</p>
                    </div>
                  </div>
                  <div className={`text-xs font-black uppercase px-2 py-1 rounded-md ${
                    item.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : 
                    item.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {item.status}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Objection By</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.user?.userName}</p>
                    <p className="text-xs text-gray-500">{item.user?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Reason</p>
                    <p className="text-sm font-bold text-red-600 line-clamp-1">{item.reason}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{item.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-400 font-medium">
                      {moment(item.createdAt).format("MMM DD, HH:mm")}
                    </p>
                    {(() => {
                      const isLate = item.repliedAt && moment(item.repliedAt).isAfter(moment(item.createdAt).add(2, 'days'));
                      const isExpiredNoReply = !item.repliedAt && moment().isAfter(moment(item.createdAt).add(2, 'days'));
                      
                      if (isLate) {
                        return (
                          <span className="text-[9px] font-black text-red-500 bg-red-50 dark:bg-red-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider w-fit">
                            Late Reply
                          </span>
                        );
                      }
                      if (isExpiredNoReply) {
                        return (
                          <span className="text-[9px] font-black text-red-500 bg-red-50 dark:bg-red-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider w-fit">
                            Reply Window Expired
                          </span>
                        );
                      }
                      if (item.repliedAt) {
                        return (
                          <span className="text-[9px] font-black text-green-500 bg-green-50 dark:bg-green-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider w-fit">
                            Replied
                          </span>
                        );
                      }
                      return null;
                    })()}
                  </div>
                  <button 
                    onClick={() => openModal(item)}
                    className="px-4 py-2 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-lg"
                  >
                    {selectedContent[localizationKeys.viewDetails]}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

      {/* Details Modal */}
      {isModalOpen && selectedObjection && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-500">
          <div className="bg-white dark:bg-[#151A23] w-full max-w-5xl h-[85vh] flex flex-col rounded-3xl shadow-2xl animate-in zoom-in duration-300 border border-gray-100 dark:border-gray-800 overflow-hidden">
            {/* Header */}
            <div className="px-4 md:px-8 py-4 md:py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-[#151A23] z-10">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                  {selectedContent[localizationKeys.objectionDetails]}
                </h2>
                <p className="text-xs md:text-sm text-gray-500 mt-1">ID: #{selectedObjection.id} • {moment(selectedObjection.createdAt).format("MMM DD, YYYY")}</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Side: Product & Status */}
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-black/20 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 flex gap-4">
                    <img 
                      src={selectedObjection.product?.images?.[0]?.imageLink} 
                      className="w-24 h-24 rounded-xl object-cover shadow-sm"
                      alt=""
                    />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-1">{selectedObjection.product?.title}</h3>
                      <p className="text-sm text-gray-500 mb-3">Product ID: {selectedObjection.productId}</p>
                      <button 
                        onClick={() => window.open(`https://www.3arbon.com/my-product/${selectedObjection.productId}/details`, '_blank')}
                        className="text-xs font-black text-primary hover:underline"
                      >
                        VIEW ON SITE →
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">{selectedContent[localizationKeys.status]}</h4>
                    <select
                      value={selectedObjection.status}
                      onChange={(e) => handleStatusChange(selectedObjection.id, e.target.value)}
                      className={`w-full p-4 rounded-2xl font-bold uppercase border-2 transition-all cursor-pointer outline-none focus:ring-0 ${
                        selectedObjection.status === "PENDING" ? "bg-yellow-50 border-yellow-200 text-yellow-700" : 
                        selectedObjection.status === "IN_PROGRESS" ? "bg-blue-50 border-blue-200 text-blue-700" :
                        "bg-green-50 border-green-200 text-green-700"
                      }`}
                    >
                      <option value="PENDING">{selectedContent[localizationKeys.pending]}</option>
                      <option value="IN_PROGRESS">{selectedContent[localizationKeys.inProgress]}</option>
                      <option value="SOLVED">{selectedContent[localizationKeys.solved]}</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">RAISED BY</h4>
                    <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-gray-800">
                      <p className="text-base font-bold text-gray-900 dark:text-white">{selectedObjection.user?.userName}</p>
                      <p className="text-sm text-gray-500">{selectedObjection.user?.email}</p>
                      <p className="text-sm text-gray-500">{selectedObjection.user?.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Right Side: Objection & Reply */}
                <div className="space-y-8">
                  {/* The Objection */}
                  <div className="relative pl-6 border-l-2 border-red-200 dark:border-red-900/50">
                    <div className="absolute -left-1.5 top-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-[#151A23]"></div>
                    <h4 className="text-sm font-black text-red-600 uppercase tracking-widest mb-3">ORIGINAL OBJECTION</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-base font-bold text-gray-900 dark:text-white mb-1">{selectedObjection.reason}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{selectedObjection.description}</p>
                        <p className="text-xs text-gray-400 mt-2 italic">Registered on: {moment(selectedObjection.createdAt).format("MMM DD, YYYY HH:mm")}</p>
                      </div>
                      
                      {selectedObjection.documents?.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {selectedObjection.documents.map((doc) => {
                            const isPdf = doc.imageLink?.toLowerCase().endsWith(".pdf") || doc.imagePath?.toLowerCase().endsWith(".pdf");
                            return (
                              <div 
                                key={doc.id}
                                className="relative w-14 h-14 group cursor-pointer"
                                onClick={() => window.open(doc.imageLink, '_blank')}
                              >
                                {isPdf ? (
                                  <div className="w-full h-full rounded-xl bg-red-50 border border-red-100 flex flex-col items-center justify-center shadow-sm">
                                    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                                    </svg>
                                    <span className="text-[7px] font-bold text-red-600 mt-0.5">PDF</span>
                                  </div>
                                ) : (
                                  <img 
                                    src={doc.imageLink} 
                                    alt="" 
                                    className="w-full h-full rounded-xl object-cover border border-gray-100 shadow-sm"
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* The Reply */}
                  <div className="relative pl-6 border-l-2 border-green-200 dark:border-green-900/50">
                    <div className="absolute -left-1.5 top-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-[#151A23]"></div>
                    <h4 className="text-sm font-black text-green-600 uppercase tracking-widest mb-3">BUYER'S REPLY</h4>
                    {selectedObjection.repliedAt ? (
                      <div className="space-y-4">
                        <div>
                          <p className="text-base font-bold text-gray-900 dark:text-white mb-1">{selectedObjection.replyReason}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{selectedObjection.replyDescription}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <p className="text-xs text-gray-400 italic">Replied on: {moment(selectedObjection.repliedAt).format("MMM DD, YYYY HH:mm")}</p>
                            {moment(selectedObjection.repliedAt).isAfter(moment(selectedObjection.createdAt).add(2, 'days')) && (
                              <span className="text-[10px] font-black text-red-500 bg-red-50 dark:bg-red-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                LATE REPLY
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {selectedObjection.replyDocuments?.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {selectedObjection.replyDocuments.map((doc) => {
                              const isPdf = doc.imageLink?.toLowerCase().endsWith(".pdf") || doc.imagePath?.toLowerCase().endsWith(".pdf");
                              return (
                                <div 
                                  key={doc.id}
                                  className="relative w-14 h-14 group cursor-pointer"
                                  onClick={() => window.open(doc.imageLink, '_blank')}
                                >
                                  {isPdf ? (
                                    <div className="w-full h-full rounded-xl bg-red-50 border border-red-100 flex flex-col items-center justify-center shadow-sm">
                                      <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                                      </svg>
                                      <span className="text-[7px] font-bold text-red-600 mt-0.5">PDF</span>
                                    </div>
                                  ) : (
                                    <img 
                                      src={doc.imageLink} 
                                      alt="" 
                                      className="w-full h-full rounded-xl object-cover border border-gray-100 shadow-sm"
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                        <p className="text-xs text-gray-400 italic">No reply has been submitted yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 md:px-8 py-4 md:py-6 bg-gray-50/50 dark:bg-black/10 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full md:w-auto px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-black font-black text-sm uppercase tracking-widest rounded-xl hover:opacity-80 transition-opacity"
              >
                {selectedContent[localizationKeys.close]}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminObjections;
