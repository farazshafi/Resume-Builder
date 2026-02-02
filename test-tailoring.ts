import { LlmService } from './server/src/services/LlmService';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from server directory
dotenv.config({ path: path.resolve(__dirname, 'server/.env') });

async function testTailoring() {
    const llmService = new LlmService();

    const mockResume = {
        fullName: 'John Doe',
        experience: [
            {
                company: 'Tech Corp',
                role: 'Software Engineer',
                bullets: ['Developed web apps using React and Node.js', 'Managed SQL databases']
            }
        ],
        projects: [
            {
                title: 'E-commerce Platform',
                description: 'A full stack e-commerce site',
                bullets: ['Built with Next.js and Stripe']
            },
            {
                title: 'Personal Gardening Blog',
                description: 'A blog about urban gardening',
                bullets: ['Static site using Jekyll']
            }
        ],
        skills: {
            technical: {
                "Web Development": ["React", "Node.js", "HTML", "CSS"],
                "Gardening": ["Soil pH Testing", "Pruning"]
            },
            soft: ["Communication", "Problem Solving", "Plant Care"]
        }
    };

    const jobDescription = `
        We are looking for a Senior Frontend Developer expert in React and Next.js. 
        Experience with e-commerce systems and Stripe integration is a plus.
        The candidate should have strong communication skills.
    `;

    console.log('--- Original Resume Content (Relevant parts) ---');
    console.log('Projects:', mockResume.projects.map(p => p.title));
    console.log('Skills:', JSON.stringify(mockResume.skills, null, 2));

    console.log('\n--- Generating Tailored Resume ---');
    try {
        const tailored = await llmService.tailorResume(mockResume, jobDescription);
        console.log('\n--- Tailored Resume Results ---');
        console.log('Projects kept:', tailored.projects.map((p: any) => p.title));
        console.log('Skills kept:', JSON.stringify(tailored.skills, null, 2));

        const gardeningProjectKept = tailored.projects.some((p: any) => p.title.toLowerCase().includes('gardening'));
        const gardeningSkillKept = JSON.stringify(tailored.skills).toLowerCase().includes('gardening') || JSON.stringify(tailored.skills).toLowerCase().includes('plant care');

        if (gardeningProjectKept || gardeningSkillKept) {
            console.error('\nFAILURE: Irrelevant gardening content was NOT removed.');
        } else {
            console.log('\nSUCCESS: Irrelevant gardening content was REMOVED.');
        }
    } catch (error) {
        console.error('Test failed:', error);
    }
}

testTailoring();
