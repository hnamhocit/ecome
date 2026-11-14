export interface SocialApp {
  id: string;
  title: string;
  url: string;
  photoUrl: string;
}

export const SOCIAL_APPS: SocialApp[] = [
  {
    id: 'facebook',
    title: 'Facebook',
    url: 'https://facebook.com',
    photoUrl: '/images/facebook.webp',
  },
  {
    id: 'github',
    title: 'GitHub',
    url: 'https://github.com',
    photoUrl: '/images/github.svg',
  },
  {
    id: 'google',
    title: 'Google',
    url: 'https://google.com',
    photoUrl: '/images/google.webp',
  },
  {
    id: 'instagram',
    title: 'Instagram',
    url: 'https://instagram.com',
    photoUrl: '/images/insta.webp',
  },
  {
    id: 'threads',
    title: 'Threads',
    url: 'https://threads.net',
    photoUrl: '/images/thread.webp',
  },
  {
    id: 'tiktok',
    title: 'TikTok',
    url: 'https://tiktok.com',
    photoUrl: '/images/tiktok.png',
  },
];
