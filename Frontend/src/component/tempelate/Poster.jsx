import React, { useState, useEffect } from 'react';
import PosterCSS from '../css/Poster.module.css'
import poster1 from '../images/poster1.jpeg';
import poster2 from '../images/poster2.jpeg';
import poster3 from '../images/poster3.jpeg';
import poster4 from '../images/poster4.jpeg';

const Poster = () => {
  const [currentImage, setCurrentImage] = useState(poster1);
  const images = [poster1, poster2, poster3, poster4];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => {
        const nextIndex = (images.indexOf(prevImage) + 1) % images.length;
        return images[nextIndex];
      });
    }, 3000); 

    return () => clearInterval(interval); 
  }, [images]);

  return (
    <div className={PosterCSS.body}
       
      style={{ 
        backgroundImage: `url(${currentImage})`,
        backgroundSize: 'cover', 
        height: '60vh', 
        width: '100vw' 
      }}
    >
      
    </div>
  );
};

export default Poster;
