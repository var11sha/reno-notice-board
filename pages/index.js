import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Home() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const router = useRouter();

  const fetchNotices = async () => {
    try {
      setError(null);
      const res = await fetch('/api/notices');
      
      if (!res.ok) {
        const text = await res.text();
        let errorMsg = `Server returned status ${res.status}`;
        try {
          const parsed = JSON.parse(text);
          errorMsg = parsed.message || parsed.error || errorMsg;
        } catch (e) {
          if (text.includes('<!DOCTYPE html>')) {
            errorMsg = `Server error (500). Please check your database connection configuration or environment variables.`;
          } else {
            errorMsg = text.slice(0, 100) || errorMsg;
          }
        }
        throw new Error(errorMsg);
      }
      
      const data = await res.json();
      setNotices(data);
    } catch (err) {
      console.error("Failed to fetch notices", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const triggerDelete = (notice) => {
    setNoticeToDelete(notice);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!noticeToDelete) return;
    try {
      const res = await fetch(`/api/notices/${noticeToDelete.id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast("Announcement deleted successfully!", "success");
        fetchNotices();
      } else {
        showToast("Failed to delete notice.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("An error occurred while deleting the notice.", "error");
    } finally {
      setShowConfirmModal(false);
      setNoticeToDelete(null);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  const handleEditRedirect = (notice) => {
    router.push({
      pathname: '/form',
      query: {
        id: notice.id,
        editTitle: notice.title,
        editBody: notice.body,
        editCategory: notice.category,
        editPriority: notice.priority,
        editDate: notice.publishDate,
        editImage: notice.image
      }
    });
  };

  // Dynamic style helpers
  const getCategoryTheme = (category) => {
    switch (category) {
      case 'Exam':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200/60',
          accent: 'border-l-amber-500',
          iconColor: 'text-amber-500'
        };
      case 'Event':
        return {
          bg: 'bg-purple-50 text-purple-800 border-purple-200/60',
          accent: 'border-l-purple-500',
          iconColor: 'text-purple-500'
        };
      default:
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-200/60',
          accent: 'border-l-blue-500',
          iconColor: 'text-blue-500'
        };
    }
  };

  const urgentCount = notices.filter(n => n.priority === 'Urgent').length;
  const examCount = notices.filter(n => n.category === 'Exam').length;
  const eventCount = notices.filter(n => n.category === 'Event').length;

  return (
    <div className="space-y-10">
      {/* Premium Dashboard Welcome Panel */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-slate-950/20">
        {/* Glow Elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
              Campus Announcement Portal
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Stay ahead of class schedules, upcoming exams, and community events on your unified board.
            </p>
          </div>
          <Link 
            href="/form" 
            className="self-start md:self-auto inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-bold px-6 py-3.5 rounded-2xl transition duration-200 shadow-lg shadow-blue-900/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
            </svg>
            Publish Notice
          </Link>
        </div>

        {/* Dashboard Stats Row */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-800/80">
          <div className="bg-slate-950/40 backdrop-blur-sm border border-slate-800/50 p-4 rounded-2xl">
            <span className="block text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Notices</span>
            <span className="block text-2xl font-black mt-1 text-white">{notices.length}</span>
          </div>
          <div className="bg-slate-950/40 backdrop-blur-sm border border-slate-800/50 p-4 rounded-2xl">
            <span className="block text-slate-500 text-xs font-semibold uppercase tracking-wider">⚠️ Urgent</span>
            <span className={`block text-2xl font-black mt-1 ${urgentCount > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
              {urgentCount}
            </span>
          </div>
          <div className="bg-slate-950/40 backdrop-blur-sm border border-slate-800/50 p-4 rounded-2xl">
            <span className="block text-slate-500 text-xs font-semibold uppercase tracking-wider">📚 Exams</span>
            <span className="block text-2xl font-black mt-1 text-slate-300">{examCount}</span>
          </div>
          <div className="bg-slate-950/40 backdrop-blur-sm border border-slate-800/50 p-4 rounded-2xl">
            <span className="block text-slate-500 text-xs font-semibold uppercase tracking-wider">🎉 Events</span>
            <span className="block text-2xl font-black mt-1 text-slate-300">{eventCount}</span>
          </div>
        </div>
      </div>

      {/* Notices Feed */}
      <div>
        <div className="flex items-center space-x-2 mb-6">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Active Announcements</h3>
          <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full font-bold">
            {notices.length}
          </span>
        </div>

        {error ? (
          <div className="bg-rose-50/50 border border-rose-100 rounded-3xl p-8 max-w-xl mx-auto text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 border border-rose-100/60 shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"></path>
              </svg>
            </div>
            <h4 className="text-base font-bold text-slate-800">Connection Error</h4>
            <p className="text-xs text-rose-600 font-semibold leading-relaxed max-w-sm mx-auto bg-rose-50 p-3.5 rounded-xl border border-rose-100">
              {error}
            </p>
            <button 
              onClick={fetchNotices} 
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition duration-150 cursor-pointer shadow-sm"
            >
              Retry Connection
            </button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 text-sm font-medium">Retrieving active notices...</p>
          </div>
        ) : notices.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 p-8 shadow-sm">
            <div className="mx-auto w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-4 border border-slate-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"></path>
              </svg>
            </div>
            <p className="text-slate-500 font-semibold text-lg">No notices published yet</p>
            <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
              Get started by clicking the "Publish Notice" button to post your first announcement.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {notices.map((notice) => {
              const isUrgent = notice.priority === 'Urgent';
              const theme = getCategoryTheme(notice.category);

              return (
                <div 
                  key={notice.id} 
                  className={`group relative bg-white rounded-3xl border border-slate-100 p-6 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out border-l-4 ${theme.accent}
                    ${isUrgent ? 'ring-1 ring-red-200/50 bg-gradient-to-b from-white to-red-50/10' : ''}`}
                >
                  {/* Notice Image Cover */}
                  {notice.image && (
                    <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 mb-4 border border-slate-100/50">
                      <img 
                        src={notice.image} 
                        alt={notice.title} 
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                        onError={(e) => {
                          e.target.style.display = 'none'; // gracefully hide broken image URLs
                        }}
                      />
                    </div>
                  )}

                  <div>
                    {/* Top Meta Details */}
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <h4 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 leading-snug">
                        {notice.title}
                      </h4>
                      
                      {/* Urgent Badge */}
                      {isUrgent && (
                        <span className="flex-shrink-0 inline-flex items-center bg-red-50 text-red-700 text-xs font-black px-2.5 py-1 rounded-lg border border-red-200 uppercase tracking-wider animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>
                          Urgent
                        </span>
                      )}
                    </div>

                    {/* Notice Description Body */}
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 whitespace-pre-wrap line-clamp-4">
                      {notice.body}
                    </p>
                  </div>

                  {/* Card Footer Block */}
                  <div className="border-t border-slate-50 pt-4 mt-auto">
                    <div className="flex items-center justify-between gap-2 mb-4">
                      {/* Category Label */}
                      <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wide ${theme.bg}`}>
                        <svg className={`w-3 h-3 mr-1 ${theme.iconColor}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                        </svg>
                        {notice.category}
                      </span>
                      
                      {/* Date Indicator */}
                      <span className="text-[11px] font-semibold text-slate-400 flex items-center">
                        <svg className="w-3.5 h-3.5 mr-1 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"></path>
                        </svg>
                        {new Date(notice.publishDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    {/* Interactive Button Actions */}
                    <div className="flex items-center justify-end space-x-3 text-xs font-bold border-t border-slate-50/50 pt-3 opacity-80 group-hover:opacity-100 transition-opacity duration-200">
                      <button 
                        onClick={() => handleEditRedirect(notice)} 
                        className="inline-flex items-center text-slate-500 hover:text-blue-600 py-1 px-2.5 hover:bg-blue-50/50 rounded-lg transition duration-150 cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path>
                        </svg>
                        Edit
                      </button>
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                      <button 
                        onClick={() => triggerDelete(notice)} 
                        className="inline-flex items-center text-slate-400 hover:text-rose-600 py-1 px-2.5 hover:bg-rose-50 rounded-lg transition duration-150 cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path>
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Custom Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          {/* Backdrop */}
          <div 
            onClick={() => {
              setShowConfirmModal(false);
              setNoticeToDelete(null);
            }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
          ></div>
          
          {/* Card */}
          <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full border border-slate-100 shadow-2xl transform scale-100 transition-all duration-300 ease-out animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Warning Icon */}
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 border border-rose-100/60 shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"></path>
                </svg>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-slate-900">Delete Announcement?</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Are you sure you want to permanently delete <strong className="text-slate-800 font-semibold">"{noticeToDelete?.title}"</strong>? This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3 w-full pt-4">
                <button 
                  type="button"
                  onClick={() => {
                    setShowConfirmModal(false);
                    setNoticeToDelete(null);
                  }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-xs font-bold py-3 px-4 rounded-xl transition duration-150 cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={confirmDelete}
                  className="flex-1 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white text-xs font-bold py-3 px-4 rounded-xl transition duration-150 cursor-pointer text-center shadow-lg shadow-rose-900/10"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-[110] flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl shadow-slate-950/20 border border-slate-800 animate-in slide-in-from-bottom-5 fade-in duration-300">
          {toast.type === 'success' ? (
            <div className="w-5 h-5 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
              </svg>
            </div>
          ) : (
            <div className="w-5 h-5 bg-rose-500/10 text-rose-400 rounded-lg flex items-center justify-center">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"></path>
              </svg>
            </div>
          )}
          <span className="text-xs font-semibold tracking-wide">{toast.message}</span>
        </div>
      )}
    </div>
  );
}