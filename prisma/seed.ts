import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding IEEE CMRU Database...');

  // 1. Seed Default Admin User
  const adminEmail = 'yeshiit25@gmail.com';
  const existingAdmin = await prisma.admin.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('Admin@IEEE2026', 10);
    await prisma.admin.create({
      data: {
        email: adminEmail,
        passwordHash,
      },
    });
    console.log(`✅ Seeded Admin User: ${adminEmail} (password: Admin@IEEE2026)`);
  }

  // 2. Seed Initial Committee Contacts
  const contactsData = [
    { name: 'Dr. Sivananda', role: 'Counselor & Faculty Advisor', dept: 'SOET, CMR University', order: 1 },
    { name: 'Aditya Kumar', role: 'Chairperson', dept: 'BTech CSE · 4th Year', order: 2 },
    { name: 'Ananya Sharma', role: 'Vice Chairperson', dept: 'BTech ECE · 4th Year', order: 3 },
    { name: 'Rahul V', role: 'Secretary', dept: 'BTech CSE · 3rd Year', order: 4 },
    { name: 'Priya N', role: 'Treasurer', dept: 'BTech CSE · 3rd Year', order: 5 },
    { name: 'Kiran R', role: 'Webmaster & Technical Lead', dept: 'BTech CSE · 3rd Year', order: 6 },
    { name: 'Sneha P', role: 'Event Co-ordinator', dept: 'BTech AIML · 3rd Year', order: 7 },
    { name: 'Varun K', role: 'Membership Chair', dept: 'BTech CSE · 2nd Year', order: 8 },
    { name: 'Divya M', role: 'WIE Affinity Group Chair', dept: 'BTech ECE · 3rd Year', order: 9 },
    { name: 'Karthik S', role: 'ComSoc Chapter Chair', dept: 'BTech ECE · 3rd Year', order: 10 },
    { name: 'Megha B', role: 'Design & Media Lead', dept: 'BTech AIML · 2nd Year', order: 11 },
    { name: 'Nikhil T', role: 'Sponsorship & Outreach Lead', dept: 'BTech CSE · 3rd Year', order: 12 },
    { name: 'Tanvi H', role: 'Publicity Lead', dept: 'BTech AIML · 2nd Year', order: 13 },
    { name: 'Rohit P', role: 'Logistics Head', dept: 'BTech ECE · 2nd Year', order: 14 },
    { name: 'Yeshwanth Reddy P G', role: 'IEEE EXE-COM & Webmaster', email: 'yeshwanthreddy@cmr.edu.in', phone: '7795085899', dept: 'BTech CSE AIML · 2nd Year / 3rd Semester', order: 15 },
  ];

  for (const contact of contactsData) {
    const existing = await prisma.contact.findFirst({ where: { name: contact.name } });
    if (!existing) {
      await prisma.contact.create({ data: contact });
    }
  }
  console.log(`✅ Seeded ${contactsData.length} Committee Contacts.`);

  // 3. Seed Featured Initial Events
  const eventsData = [
    {
      title: '2-Days Workshop on AI Tools for Research Enhancement and High-Performance Computing',
      description: 'Hands-on training session in computing labs focusing on generative AI research tools, HPC clusters, and literature workflows.',
      date: new Date('2025-08-15T09:30:00Z'),
      venue: 'Lab 3 & Auditorium, SOET, CMR University',
      capacity: 120,
      category: 'Technical Workshop',
    },
    {
      title: 'IEEE CS 80th Celebration & STEM Outreach Program',
      description: 'Celebrating 80 years of IEEE Computer Society with STEM interactive workshops, computer lab demonstrations, and school student engagement.',
      date: new Date('2025-09-10T10:00:00Z'),
      venue: 'Main Seminar Hall, CMR University',
      capacity: 200,
      category: 'Celebration & STEM',
    },
    {
      title: 'NEXTGEN IT-IBM Cloud & AI Hackathon Summit',
      description: 'Industry keynote speaker session and 24-hour hackathon co-hosted with IBM Cloud & AI team.',
      date: new Date('2025-10-05T09:00:00Z'),
      venue: 'CMRU Innovation Center',
      capacity: 150,
      category: 'Hackathon',
    },
    {
      title: 'Seminar on Current Trends in AI featuring Ts. Dr. J. Emerson Raja',
      description: 'International guest lecture on computer vision, deep learning frameworks, and global AI career trajectories.',
      date: new Date('2025-11-20T11:00:00Z'),
      venue: 'Auditorium A, CMR University',
      capacity: 180,
      category: 'Technical Seminar',
    },
    {
      title: 'IEEE Xplore & EBSCO Research Training Workshop',
      description: 'Comprehensive guide for students and faculty on accessing IEEE Xplore Digital Library, searching journals, and publishing papers.',
      date: new Date('2025-12-02T14:00:00Z'),
      venue: 'Central Library Hall',
      capacity: 100,
      category: 'Academic Training',
    },
  ];

  for (const ev of eventsData) {
    const existing = await prisma.event.findFirst({ where: { title: ev.title } });
    if (!existing) {
      await prisma.event.create({ data: ev });
    }
  }
  console.log(`✅ Seeded ${eventsData.length} Featured Events.`);

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
