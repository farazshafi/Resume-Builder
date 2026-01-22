import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    const resumes = [
        {
            title: 'Full Stack Developer',
            fullName: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1234567890',
            location: 'New York, USA',
            summary: 'Experienced developer with a passion for building scalable web applications.',
            education: [
                {
                    school: 'Tech University',
                    degree: 'B.S. in Computer Science',
                    year: '2020',
                },
            ],
            skills: {
                technical: ['React', 'Node.js', 'Prisma', 'TypeScript'],
                soft: ['Leadership', 'Communication'],
            },
            experience: [
                {
                    company: 'Software Solutions',
                    role: 'Junior Developer',
                    duration: '2020 - Present',
                    description: 'Working on various client projects.',
                },
            ],
        },
        {
            title: 'Backend Engineer',
            fullName: 'Jane Smith',
            email: 'jane.smith@example.com',
            phone: '+0987654321',
            location: 'San Francisco, USA',
            summary: 'Specialized in server-side logic and database architecture.',
            education: [
                {
                    school: 'State College',
                    degree: 'M.S. in Software Engineering',
                    year: '2018',
                },
            ],
            skills: {
                technical: ['PostgreSQL', 'Redis', 'Docker', 'Go'],
                soft: ['Problem Solving', 'Teamwork'],
            },
            experience: [
                {
                    company: 'Data Systems Inc.',
                    role: 'Backend Developer',
                    duration: '2018 - 2022',
                    description: 'Optimized database queries and built REST APIs.',
                },
            ],
        },
    ];

    for (const r of resumes) {
        const resume = await prisma.resume.create({
            data: r,
        });
        console.log(`Created resume with id: ${resume.id}`);
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
