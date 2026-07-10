export const galleryImages = [
  {
    id: 'appreciation',
    src: '/assets/images/profile/vera-appreciation-moment-01.jpg',
    defaultLikes: 164,
  },
  {
    id: 'bremen',
    src: '/assets/images/profile/vera-bremen-city-moment-01.jpg',
    defaultLikes: 218,
  },
  {
    id: 'career',
    src: '/assets/images/profile/vera-career-language-training-01.jpg',
    defaultLikes: 247,
  },
  {
    id: 'classroom',
    src: '/assets/images/profile/vera-classroom-training-moment-01.jpg',
    defaultLikes: 136,
  },
  {
    id: 'communication',
    src: '/assets/images/profile/vera-communication-red-phone-box-01.jpg',
    defaultLikes: 201,
  },
  {
    id: 'travel',
    src: '/assets/images/profile/vera-travel-intercultural-moment-01.jpg',
    defaultLikes: 189,
  },
] as const

export type GalleryImageId = (typeof galleryImages)[number]['id']
