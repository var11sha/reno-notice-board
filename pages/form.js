import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function NoticeForm() {
  const router = useRouter();
  const { id, editTitle, editBody, editCategory, editPriority, editDate } = router.query;

  const [formData, setFormData] = useState({
    title: '', body: '', category: 'General', priority: 'Normal', publishDate: ''
  });

  useEffect(() => {
    if (id) { // If an ID exists, we are editing
      setFormData({
        title: editTitle || '', body: editBody || '',
        category: editCategory || 'General', priority: editPriority || 'Normal',
        publishDate: editDate ? editDate.split('T')[0] : ''
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = id ? `/api/notices/${id}` : '/api/notices';
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) router.push('/');
    else alert('Failed to save notice');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Notice' : 'Add New Notice'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input type="text" className="w-full border p-2 rounded" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
        </div>
        <div>
          <label className="block font-medium">Body</label>
          <textarea className="w-full border p-2 rounded" required value={formData.body} onChange={e => setFormData({...formData, body: e.target.value})} />
        </div>
        <div>
          <label className="block font-medium">Category</label>
          <select className="w-full border p-2 rounded" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
            <option value="General">General</option>
            <option value="Exam">Exam</option>
            <option value="Event">Event</option>
          </select>
        </div>
        <div>
          <label className="block font-medium">Priority</label>
          <select className="w-full border p-2 rounded" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
            <option value="Normal">Normal</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
        <div>
          <label className="block font-medium">Publish Date</label>
          <input type="date" className="w-full border p-2 rounded" required value={formData.publishDate} onChange={e => setFormData({...formData, publishDate: e.target.value})} />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-700">Save Notice</button>
      </form>
    </div>
  );
}