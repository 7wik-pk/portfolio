import resumePdf from '../assets/docs/sathwik_general_resume.pdf'
import githubIcon from '../assets/icons/github2.png'
import projectsIcon from '../assets/icons/Folder_GitHub.png'
import pdfDocument from '../assets/icons/Pdf_Document.png'

export const finderFiles = [
    {
        id: '1',
        name: 'About Me.pdf',
        type: 'PDF Document',
        image: pdfDocument,
        size: '12 KB',
        kind: 'PDF',
        srcPath: null,
        lastModified: 'Dec 24, 2025 at 11:30 AM',
        emoji: '📄'
    },
    {
        id: '2',
        name: 'Resume.pdf',
        type: 'PDF Document',
        image: pdfDocument,
        size: '1.2 MB',
        kind: 'PDF',
        srcPath: resumePdf,
        lastModified: 'Dec 26, 2025 at 5:23 PM',
        emoji: '📄'
    },
    {
        id: '4',
        name: 'Portrait.png',
        type: 'PNG Image',
        size: '800 KB',
        kind: 'Image',
        srcPath: githubIcon,
        lastModified: 'Nov 15, 2025 at 2:15 PM',
        emoji: '🖼️'
    },
    {
        id: '5',
        name: 'Projects',
        type: 'Folder',
        size: '--',
        image: projectsIcon,
        kind: 'Folder',
        lastModified: 'Oct 10, 2025 at 9:00 AM',
        emoji: '📁',
        children: [
            {
                id: 'p1',
                name: 'Racing Line Mapper',
                type: 'GitHub Repository',
                image: githubIcon,
                size: '--',
                kind: 'Link',
                url: 'https://github.com/7wik-pk/racing-line-mapper',
                lastModified: 'Dec 20, 2025 at 10:00 AM',
                emoji: '�'
            },
            {
                id: 'p2',
                name: 'Portfolio Site',
                type: 'GitHub Repository',
                image: githubIcon,
                size: '--',
                kind: 'Link',
                url: 'https://github.com/7wik-pk/portfolio',
                lastModified: 'Dec 26, 2025 at 7:30 PM',
                emoji: '�'
            },
            {
                id: 'p3',
                name: 'SafeTrek',
                type: 'GitHub Repository',
                image: githubIcon,
                size: '--',
                kind: 'Link',
                url: 'https://github.com/7wik-pk/safetrek',
                lastModified: 'Dec 26, 2025 at 5:23 PM',
                emoji: '�'
            },
            {
                id: '99',
                name: 'Source Code',
                type: 'Folder',
                size: '--',
                image: projectsIcon,
                kind: 'Folder',
                lastModified: 'Oct 10, 2025 at 9:00 AM',
                emoji: '📁',
                children: []
            }
        ]
    }
]
