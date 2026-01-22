export interface Education {
    institution: string;
    degree: string;
    graduationDate: string;
    location?: string;
}

export interface Experience {
    company: string;
    role: string;
    duration: string;
    location?: string;
    bullets: string[];
}

export interface Project {
    title: string;
    description: string;
    bullets: string[];
    technologies: string[];
    link?: string;
}

export interface ResumeData {
    title?: string;
    fullName: string;
    email: string;
    summary?: string;
    phone?: string;
    location?: string;
    linkedIn?: string;
    website?: string;
    education: Education[];
    experience?: Experience[];
    skills: {
        technical: string[];
        soft: string[];
    };
    projects?: Project[];
    certifications?: string[];
    targetJobDescription?: string;
}
