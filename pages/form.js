import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const IMAGE_PRESETS = [
  { label: 'None', url: '' },
  { label: '📚 Library Study Hall', url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80' },
  { label: '🎓 Graduation Day', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=80' },
  { label: '🏫 College Campus', url: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5c?w=600&auto=format&fit=crop&q=80' },
  { label: '⚽ Sports Fields', url: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=600&auto=format&fit=crop&q=80' }
];

export default function NoticeForm() {
  const router = useRouter();
  const { id, editTitle, editBody, editCategory, editPriority, editDate, editImage } = router.query;

  const [formData, setFormData] = useState({
    title: '',
    body: '',
    category: 'General',
    priority: 'Normal',
    publishDate: '',
    image: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      setFormData({
        title: editTitle || '',
        body: editBody || '',
        category: editCategory || 'General',
        priority: editPriority || 'Normal',
        publishDate: editDate ? editDate.split('T')[0] : '',
        image: editImage || ''
      });
    }
  }, [id, editTitle, editBody, editCategory, editPriority, editDate, editImage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const url = id ? `/api/notices/${id}` : '/api/notices';
    const method = id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        router.push('/');
      } else {
        alert('Failed to save notice. Please check all fields.');
      }
    } catch (err) {
      console.error("Error saving notice", err);
      alert('An error occurred while communicating with the server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Back Button Link */}
      <Link 
        href="/" 
        className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-800 mb-6 group transition duration-150"
      >
        <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition duration-150" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"></path>
        </svg>
        Back to Announcements
      </Link>

      {/* Main Form Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
        {/* Card Header Banner */}
        <div className="bg-slate-900 px-8 py-6 text-white relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
          <h1 className="text-xl font-bold tracking-tight relative z-10 flex items-center gap-2">
            {id ? '🔧 Modify Announcement' : '📝 Publish New Announcement'}
          </h1>
          <p className="text-slate-400 text-xs mt-1 relative z-10 font-medium">
            Fill in the information below to publish a notice on the Reno Platforms board.
          </p>
        </div>

        {/* Form Fields container */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Notice Title</label>
            <input 
              type="text" 
              placeholder="e.g. Schedule Update: Midterm Examinations 2026"
              className="w-full border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none p-3.5 rounded-2xl transition duration-150 placeholder-slate-300 font-medium"
              required 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Detailed Announcement Body</label>
            <textarea 
              rows="6"
              placeholder="Describe the announcement, dates, contacts, and any other helpful details here..."
              className="w-full border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none p-3.5 rounded-2xl transition duration-150 placeholder-slate-300 font-medium resize-y"
              required 
              value={formData.body} 
              onChange={e => setFormData({...formData, body: e.target.value})} 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Category</label>
              <div className="relative">
                <select 
                  className="w-full border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none p-3.5 rounded-2xl transition duration-150 font-semibold bg-white appearance-none cursor-pointer"
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option value="General">General Announcement</option>
                  <option value="Exam">Exam & Grading</option>
                  <option value="Event">Campus Event</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Priority Level</label>
              <div className="relative">
                <select 
                  className={`w-full border p-3.5 rounded-2xl outline-none transition duration-150 font-bold appearance-none cursor-pointer focus:ring-2
                    ${formData.priority === 'Urgent' 
                      ? 'border-red-200 bg-red-50 text-red-700 focus:border-red-500 focus:ring-red-100' 
                      : 'border-slate-200 bg-white text-slate-700 focus:border-blue-500 focus:ring-blue-100'}`}
                  value={formData.priority} 
                  onChange={e => setFormData({...formData, priority: e.target.value})}
                >
                  <option value="Normal">Normal Priority</option>
                  <option value="Urgent">⚠️ Urgent (Pin to Top)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Publish Date</label>
            <input 
              type="date" 
              className="w-full border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none p-3.5 rounded-2xl transition duration-150 font-semibold"
              required 
              value={formData.publishDate} 
              onChange={e => setFormData({...formData, publishDate: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Notice Image (Optional Bonus)</label>
            <input 
              type="url" 
              placeholder="https://example.com/image.png (or use presets below)"
              className="w-full border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none p-3.5 rounded-2xl transition duration-150 placeholder-slate-300 font-medium text-sm"
              value={formData.image} 
              onChange={e => setFormData({...formData, image: e.target.value})} 
            />
            
            {/* Quick Presets Selection */}
            <div className="mt-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Quick Campus Presets:</span>
              <div className="flex flex-wrap gap-2">
                {IMAGE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setFormData({ ...formData, image: preset.url })}
                    className={`text-xs py-1.5 px-3 rounded-lg border font-medium transition duration-150 cursor-pointer
                      ${formData.image === preset.url 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Thumbnail Preview */}
            {formData.image && (
              <div className="mt-4 border border-slate-200/80 rounded-2xl p-2 bg-slate-50 relative overflow-hidden">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Image Preview:</span>
                <div className="aspect-video w-full relative rounded-xl overflow-hidden bg-slate-200 border border-slate-200/50">
                  <img 
                    src={formData.image} 
                    alt="Notice preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=600&auto=format&fit=crop&q=80"; // fallback
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:bg-blue-300 text-white p-4 rounded-2xl font-bold tracking-wide shadow-lg shadow-blue-500/20 transition duration-150 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Publishing Announcement...
                </>
              ) : (
                id ? 'Save Changes' : 'Publish Announcement'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}