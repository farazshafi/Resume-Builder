export const resumeTemplate = (data: any) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.fullName} - Resume</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Poppins', sans-serif; 
            line-height: 1.5; 
            color: #1a1a1a; 
            padding: 40px 50px;
            background: white;
            font-size: 11pt;
        }
        h1 { 
            font-size: 28pt; 
            font-weight: 700; 
            text-align: center; 
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }
        .contact-info { 
            text-align: center; 
            margin-bottom: 30px; 
            font-size: 9.5pt; 
            color: #4b5563;
        }
        .section { margin-bottom: 25px; }
        .section-title { 
            font-size: 12pt;
            font-weight: 600;
            text-transform: uppercase; 
            margin-bottom: 12px; 
            border-bottom: 1.5px solid #1a1a1a;
            padding-bottom: 4px;
            letter-spacing: 1px;
        }
        .item { margin-bottom: 15px; }
        .item-header { 
            display: flex; 
            justify-content: space-between; 
            font-weight: 600; 
            margin-bottom: 2px;
            font-size: 11pt;
        }
        .item-sub {
            display: flex;
            justify-content: space-between;
            font-style: italic;
            color: #4b5563;
            font-size: 10pt;
            margin-bottom: 6px;
        }
        .bullets { 
            margin-top: 5px; 
            padding-left: 18px; 
            list-style-type: disc;
        }
        .bullets li { 
            margin-bottom: 4px; 
            color: #374151;
            padding-left: 4px;
        }
        .skills-container {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .skill-group {
            display: flex;
            gap: 8px;
            font-size: 10pt;
        }
        .skill-category {
            font-weight: 600;
            min-width: 120px;
        }
        .skill-list {
            color: #374151;
        }
    </style>
</head>
<body>
    <h1>${data.fullName}</h1>
    <div class="contact-info">
        ${data.location ? `${data.location} | ` : ''}
        ${data.phone ? `${data.phone} | ` : ''}
        ${data.email}
        ${data.linkedIn ? ` | ${data.linkedIn}` : ''}
        ${data.website ? ` | ${data.website}` : ''}
    </div>

    ${data.summary ? `
    <div class="section">
        <div class="section-title">Summary</div>
        <div style="text-align: justify; color: #374151;">${data.summary}</div>
    </div>
    ` : ''}

    ${data.experience && data.experience.length > 0 ? `
    <div class="section">
        <div class="section-title">Experience</div>
        ${data.experience.map((exp: any) => `
            <div class="item">
                <div class="item-header">
                    <span>${exp.role}</span>
                    <span>${exp.duration}</span>
                </div>
                <div class="item-sub">
                    <span>${exp.company}</span>
                    <span>${exp.location || ''}</span>
                </div>
                <ul class="bullets">
                    ${exp.bullets.map((bullet: string) => `<li>${bullet}</li>`).join('')}
                </ul>
            </div>
        `).join('')}
    </div>
    ` : ''}

    <div class="section">
        <div class="section-title">Skills</div>
        <div class="skills-container">
            ${(data.skills.technical && typeof data.skills.technical === 'object' && !Array.isArray(data.skills.technical)) ?
        Object.entries(data.skills.technical).map(([category, skills]: [string, any]) => `
                <div class="skill-group">
                    <span class="skill-category">${category}:</span>
                    <span class="skill-list">${Array.isArray(skills) ? skills.join(', ') : skills}</span>
                </div>
                `).join('') :
        `<div class="skill-group">
                    <span class="skill-category">Technical:</span>
                    <span class="skill-list">${Array.isArray(data.skills.technical) ? data.skills.technical.join(', ') : data.skills.technical}</span>
                </div>`
    }
            ${data.skills.soft && data.skills.soft.length > 0 ? `
            <div class="skill-group">
                <span class="skill-category">Soft Skills:</span>
                <span class="skill-list">${data.skills.soft.join(', ')}</span>
            </div>
            ` : ''}
        </div>
    </div>

    ${data.projects && data.projects.length > 0 ? `
    <div class="section">
        <div class="section-title">Projects</div>
        ${data.projects.map((proj: any) => `
            <div class="item">
                <div class="item-header">
                    <span>${proj.title}</span>
                </div>
                <div style="font-size: 10pt; color: #4b5563; font-weight: 500; margin-bottom: 4px;">${proj.technologies.join(', ')}</div>
                <ul class="bullets">
                    ${proj.bullets.map((desc: string) => `<li>${desc}</li>`).join('')}
                </ul>
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${data.education && data.education.length > 0 ? `
    <div class="section" style="page-break-inside: avoid;">
        <div class="section-title">Education</div>
        ${data.education.map((edu: any) => `
            <div class="item">
                <div class="item-header">
                    <span>${edu.institution}</span>
                    <span>${edu.graduationDate}</span>
                </div>
                <div style="font-size: 10pt; color: #374151;">${edu.degree} ${edu.location ? `| ${edu.location}` : ''}</div>
            </div>
        `).join('')}
    </div>
    ` : ''}
</body>
</html>
`;
