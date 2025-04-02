// Array of image URLs to be used randomly for users and posts
const userAvatars = [
    'https://randomuser.me/api/portraits/men/1.jpg',
    'https://randomuser.me/api/portraits/women/2.jpg',
    'https://randomuser.me/api/portraits/men/3.jpg',
    'https://randomuser.me/api/portraits/women/4.jpg',
    'https://randomuser.me/api/portraits/men/5.jpg',
    'https://randomuser.me/api/portraits/women/6.jpg',
  ];
  
  const postImages = [
    'https://source.unsplash.com/random/800x600?nature',
    'https://source.unsplash.com/random/800x600?city',
    'https://source.unsplash.com/random/800x600?technology',
    'https://source.unsplash.com/random/800x600?food',
    'https://source.unsplash.com/random/800x600?animals',
    'https://source.unsplash.com/random/800x600?architecture',
  ];
  
  // Get a random image URL from the array
  export const getRandomUserAvatar = () => {
    const randomIndex = Math.floor(Math.random() * userAvatars.length);
    return userAvatars[randomIndex];
  };
  
  export const getRandomPostImage = () => {
    const randomIndex = Math.floor(Math.random() * postImages.length);
    return postImages[randomIndex];
  };
  
  // Use ID as a seed to consistently get the same image for the same user/post
  export const getUserAvatarById = (id) => {
    const numericId = parseInt(id) || 0;
    const index = numericId % userAvatars.length;
    return userAvatars[index];
  };
  
  export const getPostImageById = (id) => {
    const numericId = parseInt(id) || 0;
    const index = numericId % postImages.length;
    return postImages[index];
  };
  