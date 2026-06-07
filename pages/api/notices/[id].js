   import { prisma } from '../../../lib/prisma';

   export default async function handler(req, res) {
     const { id } = req.query;

     if (req.method === 'PUT') {
       const { title, body, category, priority, publishDate, image } = req.body;
       
       if (!title || !body) return res.status(400).json({ error: 'Required fields missing' });

       const updated = await prisma.notice.update({
         where: { id },
         data: { 
           title, 
           body, 
           category, 
           priority, 
           publishDate: new Date(publishDate),
           image: image || null
         }
       });
       return res.status(200).json(updated);
     }

     if (req.method === 'DELETE') {
       await prisma.notice.delete({ where: { id } });
       return res.status(200).json({ message: 'Deleted successfully' });
     }

     return res.status(405).end();
   }