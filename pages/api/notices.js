import { prisma } from '../../lib/prisma';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Hard Rule: Sort Urgent priority to the top using Prisma's orderBy
      const notices = await prisma.notice.findMany({
        orderBy: [
          { priority: 'desc' }, // This ensures 'Urgent' appears before 'Normal'
          { createdAt: 'desc' }
        ]
      });
      return res.status(200).json(notices);
    }

    if (req.method === 'POST') {
      const { title, body, category, priority, publishDate, image } = req.body;

      // Hard Rule: Server-side text validation
      if (!title || !body || !category || !priority || !publishDate) {
        return res.status(400).json({ error: 'All fields are required.' });
      }

      const newNotice = await prisma.notice.create({
        data: { 
          title, 
          body, 
          category, 
          priority, 
          publishDate: new Date(publishDate),
          image: image || null
        }
      });
      return res.status(201).json(newNotice);
    }

    return res.status(405).end();
  } catch (error) {
    console.error("API error in /api/notices:", error);
    return res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message,
      details: error.stack
    });
  }
}