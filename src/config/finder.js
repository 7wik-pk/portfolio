import resumePdf from '../assets/docs/sathwik_general_resume.pdf'
import projectsIcon from '../assets/icons/Folder_GitHub.png'
import pdfDocument from '../assets/icons/Pdf_Document.png'
import resumeIcon from '../assets/icons/resume2.png'
import applicationsIcon from '../assets/icons/apps.png'
import desktopIcon from '../assets/icons/Folder_Desktop.png'
import googleContactIcon from '../assets/icons/google_contact.png'
import selfPortrait from '../assets/img/portrait.jpg'
import eduIcon from '../assets/icons/edu.png'
import { apps } from './apps'

// Sidebar Icons
import sidebarAppsIcon from '../assets/icons/finder_sidebar/Applications.ico'
import sidebarProjectsIcon from '../assets/icons/finder_sidebar/3D.ico'
import sidebarDesktopIcon from '../assets/icons/finder_sidebar/Desktop.ico'
import projectsData from '../data/projects.json'
import educationData from '../data/education.json'

// project icons
// (Individual project icons are now handled dynamically via projects.json paths)

// Common content objects for reuse (DRY)
export const aboutMe = {
    id: 'about-me',
    name: 'About Me',
    type: 'Information',
    image: googleContactIcon,
    size: '4 KB',
    kind: 'Info',
    lastModified: 'Dec 28, 2025 at 6:45 PM',
    emoji: '👤',
    infoProps: {
        image: selfPortrait,
        title: 'Sathwik',
        subtitle: 'Software Engineer / Developer / Designer',
        details: [
            { label: 'Role(s)', value: 'Full Stack Developer, Systems Developer, Cloud Engineer' },
            { label: 'Based in', value: 'Australia (Melbourne, VIC) / India (Bengaluru, Karnataka)' },
            { label: 'Expertise', value: 'Golang, Backend Web Development, PostGreSQL, Geospatial Data Processing (PostGIS), VueJS, Containerisation (Docker & Kubernetes), Python & Reinforcement Learning' },
        ],
        buttons: [
            { text: 'My Resume', action: 'resume', type: 'secondary' },
            { text: 'Email Me', action: 'email', type: 'secondary' }
        ],
        email: 'satpk17@gmail.com'
    }
}

export const resume = {
    id: 'resume',
    name: 'My Resume.pdf',
    type: 'PDF Document',
    image: resumeIcon,
    size: '1.2 MB',
    kind: 'PDF',
    srcPath: resumePdf,
    lastModified: 'Dec 26, 2025 at 5:23 PM',
    emoji: '📄'
}

export const applicationsFolder = {
    id: 'apps',
    name: 'Applications',
    type: 'Folder',
    size: '--',
    image: applicationsIcon,
    kind: 'Folder',
    lastModified: 'Dec 26, 2025 at 12:00 PM',
    emoji: '🚀',
    children: apps
        .filter(app => app.id !== 'launchpad' && app.id !== 'finder' && app.id !== 'resume' && app.id !== 'about-me')
        .map(app => ({
            ...app,
            id: `app-${app.id}`,
            type: 'Application',
            kind: 'App',
            size: '--',
            lastModified: 'Dec 26, 2025 at 12:00 PM',
        }))
}
// Load all project icons eagerly so Vite bundles them correctly
const projectIcons = import.meta.glob('../assets/icons/projects/*.png', { eager: true })
const eduIcons = import.meta.glob('../assets/icons/edu/*.png', { eager: true })

export const projectsFolder = {
    id: 'projects',
    name: 'My Projects',
    type: 'Folder',
    size: '--',
    image: projectsIcon,
    kind: 'Folder',
    lastModified: 'Oct 10, 2025 at 9:00 AM',
    emoji: '📁',
    children: projectsData.map(p => ({
        ...p,
        // Match the static path from JSON against the globbed imports
        image: projectIcons[p.image]?.default || p.image
    }))
}

export const desktopFolder = {
    id: 'desktop',
    name: 'Desktop',
    type: 'Folder',
    size: '--',
    image: desktopIcon,
    kind: 'Folder',
    lastModified: 'Dec 28, 2025 at 4:00 PM',
    emoji: '🖥️',
    children: [
        projectsFolder,
        resume
    ]
}

export const education = {
    id: 'education',
    name: 'Education',
    type: 'System Settings',
    image: eduIcon,
    size: '--',
    kind: 'Settings',
    lastModified: 'Jan 3, 2026',
    emoji: '🎓',
    settingsProps: {
        title: 'Education',
        initialSectionId: 'masters',
        sections: educationData.map(sec => ({
            ...sec,
            icon: eduIcons[sec.image]?.default || sec.image
        }))
    }
}


export const finderFiles = [
    aboutMe,
    desktopFolder,
    education,
    applicationsFolder,
]

// Helper to recursively find the path to a folder by ID
const findPath = (targetId, tree, path = []) => {
    for (const item of tree) {
        if (item.id === targetId) return [...path, item]
        if (item.children && Array.isArray(item.children)) {
            const result = findPath(targetId, item.children, [...path, item])
            if (result) return result
        }
    }
    return null
}

export const sourceCodeLink = {
    id: 'source-code',
    name: 'Portfolio Source Code',
    kind: 'Link',
    actionType: 'link',
    actionPayload: 'https://github.com/7wik-pk/portfolio',
    emoji: '📂'
}

export const sidebarFavorites = [
    {
        id: 'apps',
        name: 'Applications',
        icon: sidebarAppsIcon
    },
    {
        id: 'desktop',
        name: 'Desktop',
        icon: sidebarDesktopIcon
    },
    {
        id: 'projects',
        name: 'My Projects',
        icon: sidebarProjectsIcon
    }
].map(fav => ({
    ...fav,
    // Automatically infer the path from the finderFiles tree!
    path: findPath(fav.id, [
        { id: 'root', name: 'Home', children: finderFiles }
    ])?.slice(1) || []
    // .slice(1) removes the virtual 'root' from the breadcrumbs
}))

// Unified Content Map for stable window IDs and direct access
export const contentMap = {
    'about-me': aboutMe,
    'resume': resume,
    'projects': projectsFolder,
    'apps': applicationsFolder,
    'desktop': desktopFolder,
    'source-code': sourceCodeLink,
    'education': education,
    // 'my-life': myLife
}
