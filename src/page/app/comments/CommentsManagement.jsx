import React, { useState, useEffect } from 'react';
import { authAxios } from "../../../config/axios-config";
import api from '../../../api';
import { 
  FaSearch, 
  FaTrashAlt, 
  FaCommentAlt, 
  FaBoxOpen, 
  FaUser, 
  FaClock,
  FaArrowRight
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { Modal } from 'semantic-ui-react';

const CommentsManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [expandedThreads, setExpandedThreads] = useState(new Set());
  const [commentToDelete, setCommentToDelete] = useState(null);

  const toggleThread = (commentId) => {
    setExpandedThreads(prev => {
      const next = new Set(prev);
      if (next.has(commentId)) next.delete(commentId);
      else next.add(commentId);
      return next;
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const response = await authAxios.get(api.app.admin.searchProducts(searchQuery));
      if (response.data.success) {
        setSearchResults(response.data.data);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search products');
    } finally {
      setSearching(false);
    }
  };

  const fetchComments = async (productId) => {
    setLoading(true);
    try {
      const response = await authAxios.get(api.app.admin.getComments(productId));
      if (response.data.success) {
        setComments(response.data.data);
      }
    } catch (error) {
      console.error('Fetch comments error:', error);
      toast.error('Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  };

  const selectProduct = (product) => {
    setSelectedProduct(product);
    setSearchResults([]);
    setSearchQuery('');
    fetchComments(product.id);
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;

    try {
      const response = await authAxios.delete(api.app.admin.deleteComment(commentToDelete));
      if (response.data.success) {
        toast.success('Comment deleted successfully');
        // Recursive remove: filter main comments and their replies
        setComments(currentComments => 
          currentComments
            .filter(c => c.id !== commentToDelete)
            .map(c => ({
              ...c,
              replies: c.replies?.filter(r => r.id !== commentToDelete) || []
            }))
        );
        setCommentToDelete(null);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 mx-auto max-w-7xl animate-in fade-in duration-500 bg-[#2a3a54] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 bg-[#d4af37] rounded-full shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
            <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">Comments <span className="text-[#d4af37]">Moderation</span></h1>
          </div>
          <p className="text-gray-300 font-medium text-sm ml-5">Sanitize and manage user discussions across the platform.</p>
        </div>
        
        <form onSubmit={handleSearch} className="relative w-full md:w-[450px] group">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-24 py-4 rounded-2xl border-2 border-white/10 focus:border-[#d4af37] focus:ring-8 focus:ring-[#d4af37]/5 outline-none transition-all bg-[#1a2638] text-white placeholder:text-gray-400 shadow-2xl group-hover:border-white/20"
          />
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-100/40 group-focus-within:text-[#d4af37] transition-colors text-xl" />
          <button 
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#002147] text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#003366] transition-all shadow-lg active:scale-95"
          >
            {searching ? '...' : (
              <span className="flex items-center gap-2">
                Search <FaArrowRight className="text-[10px] text-[#d4af37]" />
              </span>
            )}
          </button>
        </form>
      </div>

      {/* Search Results Dropdown-like List */}
      {searchResults.length > 0 && (
        <div className="mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-top-4 duration-500">
          {searchResults.map((product) => (
            <div 
              key={product.id}
              onClick={() => selectProduct(product)}
              className="flex items-center gap-5 p-5 bg-[#1a2638] rounded-2xl border-2 border-white/5 shadow-xl hover:shadow-2xl hover:border-[#d4af37]/30 cursor-pointer transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 -mr-10 -mt-10 rounded-full group-hover:bg-[#d4af37]/5 transition-colors" />
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#2a3a54] flex-shrink-0 border-2 border-white/5 shadow-inner">
                {product.images?.[0] ? (
                  <img src={product.images[0].imageLink} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <FaBoxOpen size={30} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 relative">
                <h3 className="font-black text-[#d4af37] truncate group-hover:text-white transition-colors text-lg uppercase tracking-tight">{product.title}</h3>
                <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-2 font-bold uppercase tracking-wider">
                  <FaUser className="text-[#d4af37]" /> <span className="text-blue-100/70">{product.user?.userName || 'Anonymous'}</span>
                </p>
                <p className="text-[10px] text-blue-200/40 font-mono mt-1 bg-white/5 inline-block px-2 py-0.5 rounded border border-white/10 italic">ID: #{product.id}</p>
              </div>
              <FaArrowRight className="text-gray-500 group-hover:text-[#d4af37] group-hover:translate-x-1 transition-all text-xl" />
            </div>
          ))}
        </div>
      )}

      {selectedProduct ? (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="bg-[#1a2638] rounded-[2.5rem] shadow-2xl border-2 border-white/5 overflow-hidden mb-12">
            <div className="p-8 md:p-10 bg-[#002147]/50 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 -mr-32 -mt-32 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center gap-8 relative">
                <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-2xl border-4 border-white isolate">
                   <img src={selectedProduct.images?.[0]?.imageLink} className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tight leading-none mb-3">{selectedProduct.title}</h2>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[10px] px-3 py-1 bg-[#d4af37] text-white rounded-full font-black uppercase tracking-widest shadow-lg shadow-black/20">
                      ID #{selectedProduct.id}
                    </span>
                    <span className="text-sm text-gray-300 font-bold flex items-center gap-2">
                      <FaUser className="text-[#d4af37]" /> {selectedProduct.user?.userName}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all border border-white/20 isolate shadow-lg"
              >
                Change Product
              </button>
            </div>

            <div className="p-8 md:p-12">
              <div className="flex items-center justify-between mb-10 pb-6 border-b-2 border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#002147] flex items-center justify-center text-[#d4af37] shadow-xl shadow-[#002147]/10 border border-white/10">
                    <FaCommentAlt size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Active Discussions</h3>
                    <p className="text-blue-100/40 text-[10px] font-black uppercase tracking-[0.2em] mt-1">{comments.length} Comments Found</p>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 border-8 border-white/5 border-t-[#d4af37] rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-[#d4af37]">
                      <FaCommentAlt className="animate-pulse" />
                    </div>
                  </div>
                  <p className="text-[#d4af37] font-black uppercase tracking-[0.2em] text-xs">Syncing Repository...</p>
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-24 bg-white/5 rounded-[2rem] border-4 border-dashed border-white/5">
                  <div className="w-24 h-24 bg-[#1a2638] rounded-full shadow-lg flex items-center justify-center mx-auto mb-6 text-gray-500">
                    <FaCommentAlt size={40} />
                  </div>
                  <h4 className="text-white/80 font-black uppercase tracking-tight text-xl">Silence on all fronts</h4>
                  <p className="text-blue-100/40 text-sm mt-3 font-medium max-w-xs mx-auto">This product currently has no user interactions or comments to moderate.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div 
                      key={comment.id}
                      className="group p-6 md:p-8 bg-white/5 rounded-[2rem] border-2 border-white/5 hover:border-[#d4af37]/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all flex flex-col md:flex-row gap-6 relative"
                    >
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#2a3a54] border-2 border-white/10 flex-shrink-0 shadow-xl group-hover:scale-105 transition-transform duration-300 ring-4 ring-white/5">
                        {comment.user?.imageLink ? (
                          <img src={comment.user.imageLink} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#d4af37] bg-[#1a2638]">
                            <FaUser size={24} />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <span className="font-black text-lg text-[#d4af37] hover:text-[#002147] cursor-pointer transition-colors uppercase tracking-tight">
                              {comment.user?.userName || 'Anonymous User'}
                            </span>
                            <div className="mt-1 flex items-center gap-3">
                              <span className="text-[10px] text-blue-100/40 font-black flex items-center gap-1.5 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
                                <FaClock className="text-[#d4af37]" /> {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                              <span className="text-[10px] text-[#d4af37] font-black uppercase tracking-widest border border-[#d4af37]/20 px-2 py-0.5 rounded bg-[#d4af37]/5">
                                AUTHORIZED USER
                              </span>
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => setCommentToDelete(comment.id)}
                            className="md:opacity-0 group-hover:opacity-100 p-4 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all shadow-sm hover:shadow-md"
                            title="Delete Comment"
                          >
                            <FaTrashAlt size={20} />
                          </button>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-10 top-0 text-white/5 text-6xl font-serif pointer-events-none opacity-50 group-hover:text-[#d4af37]/5 transition-colors">"</div>
                          <p className="text-white/90 leading-relaxed text-base md:text-lg pr-8 relative isolate font-medium">
                            {comment.content}
                          </p>
                        </div>
                        
                        <div className="mt-6 flex flex-col gap-4 border-t border-white/5 pt-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                  {[1, 2, 3].map(i => (
                                    <div key={i} className="w-6 h-6 rounded-full bg-[#1a2638] border-2 border-[#2a3a54]" />
                                  ))}
                                </div>
                                <span className="text-[10px] font-black text-blue-100/40 uppercase tracking-widest">
                                  {comment.likesCount || 0} Approvals
                                </span>
                              </div>
                              <div className="h-1 w-1 bg-white/10 rounded-full" />
                              <span className="text-[10px] font-black text-blue-100/40 uppercase tracking-widest">
                                {comment.replies?.length || 0} Replies
                              </span>
                            </div>
                            
                            {comment.replies?.length > 0 && (
                              <button 
                                onClick={() => toggleThread(comment.id)}
                                className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest hover:text-white transition-all flex items-center gap-2 group/btn"
                              >
                                {expandedThreads.has(comment.id) ? 'Hide Thread' : 'View Thread'}
                                <FaArrowRight className={`text-[10px] transition-transform duration-300 ${expandedThreads.has(comment.id) ? '-rotate-90' : 'rotate-90'}`} />
                              </button>
                            )}
                          </div>

                          {/* Threaded Replies */}
                          {expandedThreads.has(comment.id) && comment.replies?.length > 0 && (
                            <div className="mt-4 space-y-4 ml-6 pl-6 border-l-2 border-white/5 relative">
                              <div className="absolute top-0 bottom-0 -left-[2px] w-0.5 bg-gradient-to-b from-[#d4af37]/30 to-transparent rounded-full" />
                              {comment.replies.map((reply) => (
                                <div 
                                  key={reply.id}
                                  className="group/reply p-4 bg-white/5 rounded-2xl border border-transparent hover:border-white/10 transition-all flex gap-4 relative"
                                >
                                  {/* Connector dot */}
                                  <div className="absolute -left-[30px] top-8 w-2 h-2 rounded-full bg-[#d4af37]/30 border-2 border-[#2a3a54] z-10" />
                                  
                                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#2a3a54] border border-white/10 flex-shrink-0 shadow-sm">
                                    {reply.user?.imageLink ? (
                                      <img src={reply.user.imageLink} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-[#d4af37] bg-white/5">
                                        <FaUser size={16} />
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-2">
                                      <div>
                                        <span className="font-black text-sm text-white/80 hover:text-[#d4af37] cursor-pointer transition-colors uppercase tracking-tight">
                                          {reply.user?.userName || 'Anonymous User'}
                                        </span>
                                        <div className="mt-1 flex items-center gap-2">
                                          <span className="text-[8px] text-blue-100/40 font-black uppercase tracking-widest">
                                            {new Date(reply.createdAt).toLocaleDateString()}
                                          </span>
                                        </div>
                                      </div>
                                      <button 
                                        onClick={() => setCommentToDelete(reply.id)}
                                        className="opacity-0 group-hover/reply:opacity-100 p-2 text-gray-500 hover:text-red-500 rounded-lg transition-all"
                                      >
                                        <FaTrashAlt size={14} />
                                      </button>
                                    </div>
                                    <p className="text-white/70 text-sm leading-relaxed pr-4 font-medium italic">
                                      {reply.content}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : !searching && searchQuery === '' && (
        <div className="flex flex-col items-center justify-center py-40 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-[#002147]/10 rounded-full blur-[100px] animate-pulse"></div>
            <div className="w-48 h-48 bg-white/5 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] flex items-center justify-center text-[#d4af37] relative border-4 border-white/10 isolate overflow-hidden group backdrop-blur-xl">
               <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent group-hover:scale-110 transition-transform duration-700" />
               <FaSearch size={80} className="animate-bounce-slow relative z-10 text-[#d4af37]" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">Standing by to <span className="text-[#d4af37]">Moderate</span></h2>
          <p className="text-blue-100/40 text-center max-w-lg mt-6 leading-relaxed font-medium text-lg italic">
            "Maintaining the integrity of the Alletre community, one discussion at a time."
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!commentToDelete}
        onClose={() => setCommentToDelete(null)}
        size="mini"
        className="!rounded-[2rem] overflow-hidden !bg-[#1a2638] border-2 border-white/10"
      >
        <div className="p-8 md:p-10 text-center bg-[#1a2638]">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 shadow-inner">
            <FaTrashAlt size={32} />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Are you sure?</h2>
          <p className="text-blue-100/60 font-medium mb-8">This action cannot be undone. The comment will be permanently removed from the platform.</p>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setCommentToDelete(null)}
              className="flex-1 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] text-blue-100/40 hover:bg-white/5 transition-all border-2 border-white/5"
            >
              Cancel
            </button>
            <button 
              onClick={handleDeleteComment}
              className="flex-1 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] text-white bg-red-500 hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      <style jsx>{`
        .animate-bounce-slow {
          animation: bounce 3s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default CommentsManagement;
