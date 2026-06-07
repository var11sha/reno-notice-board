# Reno Platforms Notice Board

A responsive and feature-rich central Notice Board application built for the **Reno Platforms Web Development Internship Assignment**. The application supports full CRUD operations (Create, Read, Update, Delete) and establishes a connection using Prisma 7 and a PostgreSQL database.

## Tech Stack
- **Framework**: Next.js (Pages Router)
- **Database ORM**: Prisma v7.8.0
- **Driver Adapter**: `@prisma/adapter-pg` + `pg` (PostgreSQL)
- **Styling**: Tailwind CSS v4

---

## Getting Started

### 1. Prerequisites
Ensure you have Node.js (v18+) and npm installed on your system.

### 2. Install Dependencies
Clone this repository and run the following command in the project root to install the packages:
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the project root and add your database connection string:
```env
DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database>"
```

### 4. Sync Database Schema & Generate Prisma Client
Since this project utilizes Prisma 7's new query engine, compile the schema and generate the client code:
```bash
npx prisma generate
```

### 5. Start the Development Server
Launch the local development environment:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## Bonus Feature: Optional Notice Cover Images
We implemented the bonus optional image support:
- Users can input any custom image URL or quickly select from high-quality preset campus photography options (Library, Graduation Day, Campus, Sports Fields) in the form.
- Notice cards dynamically adjust to show a cropped cover image when provided, and stay compact when omitted.

---

## AI Usage Disclosure
In accordance with the assignment guidelines, the following is an honest description of how AI was utilized during this project:
- **Architecture Assistance**: Utilized AI to resolve structural configuration conflicts around the upgrade to **Prisma 7**. Specifically, AI helped map the new `prisma-client` configuration block and resolve the `PrismaClientInitializationError` by structuring the `@prisma/adapter-pg` driver adapter.
- **Aesthetic Refinement**: AI assisted in translating the custom designs into utility classes matching Reno Platforms' branding.
- **Code Generation**: AI was used to write code for server-side validation routines, layout grids, and preset structures.

---

## Future Improvements
If given more time, the following features would be implemented:
1. **Direct File Uploads**: Integrate with AWS S3 or Cloudinary so users can drag-and-drop or select local images from their device, rather than inputting image URLs.
2. **Search and Tag Filters**: Add a client-side search bar and category pills filter (All, Exam, Event, General) to let institutional users quickly locate announcements.
3. **Optimistic UI Updates**: Improve the user experience of deleting notices by immediately hiding the card from the UI before the API request completes, with an automatic rollback if the request fails.
