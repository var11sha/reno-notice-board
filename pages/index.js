import { useEffect, useState } from 'react';
   import Link from 'next/link';
   import { useRouter } from 'next/router';

   export default function Home() {
     const [notices, setNotices] = useState([]);
     const router = useRouter();

     const fetchNotices = async () => {
       const res = await fetch('/api/notices');
       const data = await res.json();
       setNotices(data);
     };

     useEffect(() => { fetchNotices(); }, []);

     const handleDelete = async (id) => {
       // Hard Rule: Must confirm deletion first
       if (window.confirm("Are you sure you want to delete this notice?")) {
         await fetch(`/api/notices/${id}`, { method: 'DELETE' });
         fetchNotices();
       }
     };

     const handleEditRedirect = (notice) => {
       router.push({
         pathname: '/form',
         query: {
           id: notice.id, editTitle: notice.title, editBody: notice.body,
           editCategory: notice.category, editPriority: notice.priority, editDate: notice.publishDate
         }
       });
     };

     return (
       <div className="max-w-5xl mx-auto p-4">
         <div className="flex justify-between items-center mb-6">
           <h1 className="text-3xl font-bold">Notice Board</h1>
           <Link href="/form" className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700">
             + Add Notice
           </Link>
         </div>

         {/* Grid layout changes dynamically based on screen width */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {notices.map((notice) => (
             <div key={notice.id} className="border p-4 rounded-lg shadow bg-white relative flex flex-col justify-between">
               <div>
                 <div className="flex justify-between items-start mb-2">
                   <h2 className="text-xl font-bold">{notice.title}</h2>
                   {/* Urgent Badge condition */}
                   {notice.priority === 'Urgent' && (
                     <span className="bg-red-600 text-white text-xs px-2 py-1 rounded font-bold uppercase animate-pulse">Urgent</span>
                   )}
                 </div>
                 <p className="text-gray-700 mb-4">{notice.body}</p>
                 <div className="text-xs text-gray-500 space-y-1">
                   <div>Category: <span className="font-semibold">{notice.category}</span></div>
                   <div>Published: {new Date(notice.publishDate).toLocaleDateString()}</div>
                 </div>
               </div>

               <div className="mt-4 flex space-x-2 border-t pt-2">
                 <button onClick={() => handleEditRedirect(notice)} className="text-blue-600 hover:underline text-sm font-semibold">Edit</button>
                 <button onClick={() => handleDelete(notice.id)} className="text-red-600 hover:underline text-sm font-semibold">Delete</button>
               </div>
             </div>
           ))}
         </div>
       </div>
     );
   }