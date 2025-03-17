'use client'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Mousewheel, EffectCreative } from 'swiper/modules';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { FaWhatsapp, FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import Image from 'next/image';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-creative';
import Navbar from './components/mainpage/Navbar';
import Footer from './components/mainpage/Footer';

export default function Home() {
  const router = useRouter();
  const [media, setMedia] = useState([]);
  const [loadedMedia, setLoadedMedia] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoControls, setVideoControls] = useState({
    playing: true,
    muted: true
  });
  const videoRefs = useRef({});
  const mediaObserver = useRef(null);

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
            
            // Initialize loaded state for each media item
            const initialLoadState = {};
            data.media.forEach((item, index) => {
              initialLoadState[index] = false;
            });
            setLoadedMedia(initialLoadState);
          } 
          // Fallback to images array for backward compatibility
          else if (data.images && Array.isArray(data.images)) {
            console.log('Found legacy image data:', data.images);
            setMedia(data.images.map(url => ({ url, type: 'image' })));
            
            // Initialize loaded state for each media item
            const initialLoadState = {};
            data.images.forEach((_, index) => {
              initialLoadState[index] = false;
            });
            setLoadedMedia(initialLoadState);
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
    
    // Setup Intersection Observer for lazy loading
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    mediaObserver.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.dataset.index);
          if (!loadedMedia[index]) {
            // Mark this media as loading/loaded
            setLoadedMedia(prev => ({
              ...prev,
              [index]: true
            }));
          }
        }
      });
    }, options);
    
    return () => {
      // Clean up observer
      if (mediaObserver.current) {
        mediaObserver.current.disconnect();
      }
    };
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
    
    // Set this slide as loaded
    setLoadedMedia(prev => ({
      ...prev,
      [index]: true
    }));
  };

  // Set up observer for media elements
  useEffect(() => {
    const observer = mediaObserver.current;
    if (!observer) return;
    
    // Register all current media items with the observer
    document.querySelectorAll('.media-slide-item').forEach(element => {
      observer.observe(element);
    });
    
    return () => {
      // Clean up by unobserving all elements
      document.querySelectorAll('.media-slide-item').forEach(element => {
        observer.unobserve(element);
      });
    };
  }, [media]);

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
    // Check if the media should be loaded
    const shouldLoad = loadedMedia[index] || index === activeIndex || index === activeIndex + 1 || index === activeIndex - 1;
    
    // Check for placeholder
    const hasPlaceholder = item.placeholderUrl || item.posterUrl;
    
    if (item.type === 'video') {
      return (
        <SwiperSlide key={index}>
          <div 
            className="relative w-full h-full cursor-pointer media-slide-item"
            onClick={() => router.push('/collections')}
            data-index={index}
          >
            {/* Poster/placeholder image for video */}
            {item.posterUrl && !shouldLoad && (
              <div className="absolute w-full h-full bg-black">
                <Image
                  src={item.posterUrl}
                  alt="Video poster"
                  layout="fill"
                  objectFit="cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black bg-opacity-50 text-white p-4 rounded-full">
                    <FaPlay size={40} />
                  </div>
                </div>
              </div>
            )}
            
            {/* Only load video when needed */}
            {shouldLoad && (
              <video
                ref={el => videoRefs.current[index] = el}
                src={item.url}
                poster={item.posterUrl}
                autoPlay={index === activeIndex && videoControls.playing}
                muted={videoControls.muted}
                preload="metadata"
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Video Controls - Only shown on active slide */}
            {index === activeIndex && shouldLoad && (
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

    // Image slide - use Next.js Image for optimization
    return (
      <SwiperSlide 
        key={index}
        onClick={() => router.push('/collections')}
        className="relative"
      >
        <div 
          className="w-full h-full media-slide-item"
          data-index={index}
        >
          {/* Show placeholder while main image loads */}
          {hasPlaceholder && (
            <div 
              className={`absolute inset-0 transition-opacity duration-500 ${shouldLoad ? 'opacity-0' : 'opacity-100'}`}
              style={{
                backgroundImage: `url("${item.placeholderUrl}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(8px)'
              }}
            />
          )}
          
          {/* Load actual image when needed */}
          {shouldLoad ? (
            <div className="w-full h-full">
              <Image
                src={item.url}
                alt={`Slide ${index + 1}`}
                layout="fill"
                objectFit="cover"
                priority={index === 0}
                loading={index === 0 ? 'eager' : 'lazy'}
                sizes="100vw"
                className="transition-opacity duration-500"
                onLoad={() => {
                  // Update loaded state when image fully loads
                  setLoadedMedia(prev => ({
                    ...prev,
                    [index]: true
                  }));
                }}
              />
            </div>
          ) : (
            // Simplified background for non-loaded slides
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: item.placeholderUrl ? `url("${item.placeholderUrl}")` : `url("${item.url}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: item.placeholderUrl ? 'blur(8px)' : 'none'
              }}
            />
          )}
        </div>
      </SwiperSlide>
    );
  };

  return (
    <>
      <Navbar/>
      
      {/* Loading overlay */}
      {media.length === 0 && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
          <img 
            src="/Shinghai Brand Assets/PNG Assets-Shinghai Official-01.png" 
            alt="Loading..." 
            className="w-44"
          />
        </div>
      )}

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
          lazy={{
            loadPrevNext: true,
            loadPrevNextAmount: 1,
            loadOnTransitionStart: true,
            preloadImages: false
          }}
          watchSlidesProgress={true}
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
          lazy={{
            loadPrevNext: true,
            loadPrevNextAmount: 1,
            loadOnTransitionStart: true,
            preloadImages: false
          }}
          watchSlidesProgress={true}
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
        
        /* Add fade-in animation for smoother loading */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .media-slide-item img.loaded {
          animation: fadeIn 0.5s ease-in;
        }
      `}</style>
    </>
  );
}

