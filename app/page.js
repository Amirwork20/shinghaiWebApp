'use client'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Mousewheel, EffectCreative } from 'swiper/modules';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { FaWhatsapp, FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-creative';
import Navbar from './components/mainpage/Navbar';
import Footer from './components/mainpage/Footer';

export default function Home() {
  const router = useRouter();
  const [media, setMedia] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoControls, setVideoControls] = useState({
    playing: true,
    muted: true
  });
  const videoRefs = useRef({});

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/web/landing-images`);
        const data = await response.json();
        if (data.success) {
          // Check if media array is available in the response
          if (data.media && Array.isArray(data.media)) {
            console.log('Found media data:', data.media);
            setMedia(data.media);
          } 
          // Fallback to images array for backward compatibility
          else if (data.images && Array.isArray(data.images)) {
            console.log('Found legacy image data:', data.images);
            setMedia(data.images.map(url => ({ url, type: 'image' })));
          } else {
            console.log('No media found in response');
            setMedia([]);
          }
        }
      } catch (error) {
        console.error('Error fetching landing media:', error);
      }
    };

    fetchMedia();
  }, []);

  // Handle slide change to control videos
  const handleSlideChange = (swiper) => {
    const index = swiper.activeIndex;
    setActiveIndex(index);
    
    // Pause all videos first
    Object.keys(videoRefs.current).forEach(key => {
      const video = videoRefs.current[key];
      if (video) {
        video.pause();
      }
    });
    
    // Play the active video if it's a video slide
    const currentItem = media[index];
    if (currentItem && currentItem.type === 'video') {
      const video = videoRefs.current[index];
      if (video && videoControls.playing) {
        video.play().catch(e => console.error('Error playing video:', e));
      }
    }
  };

  const handleWhatsAppClick = () => {
    // Replace with your WhatsApp number
    const phoneNumber = '923001234567';
    const message = 'Hello! I have a question about your products.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const togglePlay = (videoIndex) => {
    const video = videoRefs.current[videoIndex];
    if (!video) return;
    
    if (videoControls.playing) {
      video.pause();
    } else {
      video.play().catch(e => console.error('Error playing video:', e));
    }
    
    setVideoControls(prev => ({
      ...prev,
      playing: !prev.playing
    }));
  };

  const toggleMute = (videoIndex) => {
    const video = videoRefs.current[videoIndex];
    if (!video) return;
    
    video.muted = !videoControls.muted;
    setVideoControls(prev => ({
      ...prev,
      muted: !prev.muted
    }));
  };

  const renderMediaSlide = (item, index) => {
    if (item.type === 'video') {
      return (
        <SwiperSlide key={index}>
          <div 
            className="relative w-full h-full cursor-pointer"
            onClick={() => router.push('/collections')}
          >
            <video
              ref={el => videoRefs.current[index] = el}
              src={item.url}
              autoPlay={index === activeIndex && videoControls.playing}
              muted={videoControls.muted}
              loop
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Video Controls - Only shown on active slide */}
            {index === activeIndex && (
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay(index);
                  }}
                  className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                >
                  {videoControls.playing ? <FaPause /> : <FaPlay />}
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute(index);
                  }}
                  className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                >
                  {videoControls.muted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
              </div>
            )}
          </div>
        </SwiperSlide>
      );
    }

    // Image slide
    return (
      <SwiperSlide 
        key={index}
        onClick={() => router.push('/collections')}
        style={{
          backgroundImage: `url("${item.url}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          cursor: 'pointer'
        }}
      />
    );
  };

  return (
    <>
      <Navbar/>
      
      {/* Mobile Swiper with EffectCreative */}
      <div className="mobile-swiper">
        <Swiper
          direction={'vertical'}
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet',
          }}
          mousewheel={true}
          speed={1000}
          modules={[Pagination, Mousewheel, EffectCreative]}
          effect={'creative'}
          creativeEffect={{
            prev: {
              shadow: true,
              translate: [0, 0, -400],
            },
            next: {
              translate: [0, '100%', 0],
            },
          }}
          className="mySwiper"
          onSlideChange={handleSlideChange}
        >
          {media.map((item, index) => renderMediaSlide(item, index))}
          <SwiperSlide>
            <Footer/>
          </SwiperSlide>
        </Swiper>
      </div>
      
      {/* Desktop Swiper without EffectCreative */}
      <div className="desktop-swiper">
        <Swiper
          direction={'vertical'}
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet',
          }}
          mousewheel={true}
          speed={1000}
          modules={[Pagination, Mousewheel]}
          className="mySwiper"
          onSlideChange={handleSlideChange}
        >
          {media.map((item, index) => renderMediaSlide(item, index))}
          <SwiperSlide>
            <Footer/>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* WhatsApp Floating Button */}
      <button
        onClick={handleWhatsAppClick}
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
        aria-label="Contact us on WhatsApp"
      >
        <FaWhatsapp className="w-6 h-6" />
      </button>

      <style jsx global>{`
        .swiper-pagination-bullet {
          background-color: black !important;
          width: 12px !important;
          height: 12px !important;
        }
        .swiper-pagination-bullet-active {
          background-color: black !important;
          width: 12px !important;
          height: 12px !important;
        }
        
        /* Media queries for responsive Swiper components */
        .mobile-swiper {
          display: block;
        }
        
        .desktop-swiper {
          display: none;
        }
        
        @media (min-width: 768px) {
          .mobile-swiper {
            display: none;
          }
          
          .desktop-swiper {
            display: block;
          }
        }
      `}</style>
    </>
  );
}

