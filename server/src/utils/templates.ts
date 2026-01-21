export const resumeTemplate = (data: any) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.fullName} - Resume</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 40px; }
        h1 { text-align: center; margin-bottom: 5px; }
        .contact-info { text-align: center; margin-bottom: 20px; font-size: 0.9em; }
        .section { margin-bottom: 20px; }
        .section-title { border-bottom: 2px solid #333; font-weight: bold; text-transform: uppercase; margin-bottom: 10px; }
        .item { margin-bottom: 10px; }
        .item-header { display: flex; justify-content: space-between; font-weight: bold; }
        .bullets { margin-top: 5px; padding-left: 20px; }
        .bullets li { margin-bottom: 3px; }
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
        <div>${data.summary}</div>
    </div>
    ` : ''}

    ${data.experience && data.experience.length > 0 ? `
    <div class="section">
        <div class="section-title">Experience</div>
        ${data.experience.map((exp: any) => `
            <div class="item">
                <div class="item-header">
                    <span>${exp.role} - ${exp.company}</span>
                    <span>${exp.duration}</span>
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
        <div><strong>Technical:</strong> ${data.skills.technical.join(', ')}</div>
        <div><strong>Soft Skills:</strong> ${data.skills.soft.join(', ')}</div>
    </div>

    ${data.projects && data.projects.length > 0 ? `
    <div class="section">
        <div class="section-title">Projects</div>
        ${data.projects.map((proj: any) => `
            <div class="item">
                <div class="item-header">
                    <span>${proj.title}</span>
                </div>
                <div style="font-size: 0.9em; margin-bottom: 5px;">${proj.technologies.join(', ')}</div>
                <div style="font-size: 0.95em; margin-bottom: 5px;">${proj.description}</div>
                <ul class="bullets">
                    ${proj.bullets.map((desc: string) => `<li>${desc}</li>`).join('')}
                </ul>
            </div>
        `).join('')}
    </div>
    ` : ''}

    <div class="section" style="page-break-inside: avoid;">
        <div class="section-title">Education</div>
        ${data.education.map((edu: any) => `
            <div class="item">
                <div class="item-header">
                    <span>${edu.institution}</span>
                    <span>${edu.graduationDate}</span>
                </div>
                <div>${edu.degree} ${edu.location ? `| ${edu.location}` : ''}</div>
            </div>
        `).join('')}
    </div>
</body>
</html>
`;
