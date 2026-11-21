/* Edit project copy and destinations here. No build step is required. */
window.ADITUSAN_PROJECTS = Object.freeze({
  phonecam: {
    title: 'PhoneCam Link', kicker: 'CAMERA · ANDROID + WINDOWS', status: 'In development',
    lede: 'The camera in your pocket. A whole new place to use it.',
    description: 'PhoneCam Link connects an Android phone camera to a Windows PC, opening up another way to use the camera you already have.',
    notes: ['Connect over a local Wi-Fi network, USB ADB, or Wi-Fi Direct.', 'Explore phone camera choices and a desktop companion built for the connection.', 'Find the project overview and setup information on the dedicated website.'],
    image: 'phonecam-website.webp', imageKind: 'website', imageAlt: 'PhoneCam Link website preview', color: '#f5f6fa',
    links: [{ label: 'Visit PhoneCam Link', href: 'https://phonecamlink.aditusan.dev/', primary: true }],
    disclaimer: 'An actively developed project. Device support and available features can vary.'
  },
  casting: {
    title: 'Screen Casting', kicker: 'CONNECTION · A BIGGER CANVAS', status: 'In the studio',
    lede: 'Small screen, meet big possibilities.',
    description: 'A screen casting project exploring the connection between a phone and a PC. A place to work on screen sharing, responsive interaction, and the details that make connected devices feel natural.',
    notes: ['A separate project from PhoneCam Link, focused on the screen itself.', 'Connection behaviour, streaming quality, and the everyday experience are part of the exploration.', 'A dedicated project page will be added here as the work takes shape.'],
    image: 'casting.svg', color: '#e5c7a4', links: [],
    disclaimer: 'Work in progress. The illustration is a concept, and a public download is not linked yet.'
  },
  multiplayer: {
    title: 'Multiplayer Game', kicker: 'PLAY · REAL-WORLD CONNECTIONS', status: 'In development',
    lede: 'Rivals in game. Friends in real life.',
    description: 'An in-person multiplayer project for people in the same organisation. The idea is simple: use a little competition to create a reason to meet, play, and get to know the people around you.',
    notes: ['One-on-one play is at the heart of the initial idea.', 'Local connectivity and account foundations are being developed.', 'The game content and the wider experience are still being explored.'],
    image: 'multiplayer.svg', color: '#274d50',
    links: [{ label: 'Explore the backend source', href: 'https://github.com/Sentinel-Android/multiplayer-backend', primary: true }],
    disclaimer: 'In development. This artwork represents the idea; it is not a screenshot of the game.'
  },
  controller: {
    title: 'Game Controller', kicker: 'PLAY · A NEW WAY TO CONNECT', status: 'Early exploration',
    lede: 'A different kind of control.',
    description: 'An early exploration of a game controller application, and how the device in your hand could become a more personal part of play.',
    notes: ['An idea being shaped in the studio.', 'Controls, supported devices, and the final experience are still being explored.', 'More details will live here when there is something ready to share.'],
    image: 'controller.svg', color: '#a0b0bc', links: [],
    disclaimer: 'Early concept. The controller illustration is conceptual; no public release is announced.'
  },
  cleanindia: {
    title: 'Clean India Go', kicker: 'CIVIC TECH · COMMUNITY', status: 'In development',
    lede: 'A little local action. A cleaner place for everyone.',
    description: 'A civic platform exploring how reporting local cleanliness issues can become more accessible, participatory, and rewarding. It brings the studio\'s curiosity into the places we share every day.',
    notes: ['Location and visual reporting are part of the project direction.', 'Gamification creates space for community participation.', 'Explore the application and backend work in the source repositories.'],
    image: 'cleanindia.svg', color: '#cbd0a7',
    links: [{ label: 'Explore the app source', href: 'https://github.com/Sentinel-Android/CleanIndiaGo', primary: true }, { label: 'Backend source', href: 'https://github.com/Sentinel-Android/Clean-India-Go-Backend' }],
    disclaimer: 'An actively developed project. The illustration is a concept rather than an application screenshot.'
  }
});
