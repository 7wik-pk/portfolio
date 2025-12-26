import finderIcon from '../assets/icons/finder-2021-09-10.webp'
import launchpadIcon from '../assets/icons/launchpad.webp'
import githubIcon from '../assets/icons/github2.png'
import linkedinIcon from '../assets/icons/linkedin-app-icon.webp'
import eduIcon from '../assets/icons/edu.png'
import photosIcon from '../assets/icons/photos-2021-05-28.png'
import hobbiesIcon from '../assets/icons/GarageBand_2025.webp'
import vsCodeIcon from '../assets/icons/vscode.png'
import steamIcon from '../assets/icons/steam.webp'
import youtubeIcon from '../assets/icons/youtube.jpg'
import discordIcon from '../assets/icons/discord_macos_bigsur_icon_190238.png'
import resumeIcon from '../assets/icons/resume2.png'

export const apps = [
    {
        id: 'finder',
        name: 'Finder',
        image: finderIcon,
        emoji: '📁',
        showInDock: true,
        showInDrawer: true,
        actionType: 'command',
        actionPayload: 'open-finder',
        hideOnMobile: true
    },
    {
        id: 'launchpad',
        name: 'Launchpad',
        image: launchpadIcon,
        emoji: '📱',
        showInDock: true,
        showInDrawer: false,
        actionType: 'command',
        actionPayload: 'toggle-drawer',
        hideOnMobile: false
    },
    {
        id: 'techstack',
        name: 'Tech Stack Familiarity',
        image: vsCodeIcon,
        emoji: '📺',
        showInDock: true,
        showInDrawer: true,
        actionType: 'command',
        actionPayload: 'open-techstack',
        hideOnMobile: false
    },
    {
        id: 'github',
        name: 'GitHub',
        image: githubIcon,
        emoji: '🐙',
        showInDock: true,
        showInDrawer: true,
        actionType: 'link',
        actionPayload: 'https://github.com/7wik-pk',
        hideOnMobile: false
    },
    {
        id: 'resume',
        name: 'Resume',
        image: resumeIcon,
        emoji: '📄',
        showInDock: true,
        showInDrawer: true,
        actionType: 'command',
        actionPayload: 'open-resume',
        hideOnMobile: false
    },
    {
        id: 'linkedin',
        name: 'LinkedIn',
        image: linkedinIcon,
        emoji: '🔗',
        showInDock: true,
        showInDrawer: true,
        actionType: 'link',
        actionPayload: 'https://www.linkedin.com/in/sathwik-k-77b58b140/',
        hideOnMobile: false
    },
    {
        id: 'education',
        name: 'Education',
        image: eduIcon,
        emoji: '🎓',
        showInDock: true,
        showInDrawer: true,
        actionType: 'command',
        actionPayload: 'open-education',
        hideOnMobile: true
    },
    {
        id: 'hobbies',
        name: 'Hobbies',
        image: hobbiesIcon,
        emoji: '🎵',
        showInDock: true,
        showInDrawer: true,
        actionType: 'command',
        actionPayload: 'open-hobbies',
        hideOnMobile: true
    },
    // {
    //     id: 'discord',
    //     name: 'Discord',
    //     image: discordIcon,
    //     emoji: '💬',
    //     url: '#',
    //     showInDock: true,
    //     showInDrawer: true
    // },
    {
        id: 'steam',
        name: 'Steam',
        image: steamIcon,
        emoji: '🎮',
        showInDock: true,
        showInDrawer: true,
        actionType: 'link',
        actionPayload: 'https://steamcommunity.com/id/7wik_pk',
        hideOnMobile: true
    },
    {
        id: 'youtube',
        name: 'YouTube',
        image: youtubeIcon,
        emoji: '📺',
        showInDock: false,
        showInDrawer: true,
        actionType: 'link',
        actionPayload: 'https://www.youtube.com/watch?v=klfT41uZniI',
        hideOnMobile: false
    }
]
