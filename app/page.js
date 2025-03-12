'use client'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Mousewheel, EffectCreative } from 'swiper/modules';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-creative';
import Navbar from './components/mainpage/Navbar';
import Footer from './components/mainpage/Footer';

export default function Home() {
  const router = useRouter();
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/web/landing-images`);
        const data = await response.json();
        if (data.success) {
          setImages(data.images);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  const handleWhatsAppClick = () => {
    // Replace with your WhatsApp number
    const phoneNumber = '923001234567';
    const message = 'Hello! I have a question about your products.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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
        >
          {images.map((image, index) => (
            <SwiperSlide 
              key={index}
              onClick={() => router.push('/collections')}
              style={{
                backgroundImage: `url("${image}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                cursor: 'pointer'
              }}
            ></SwiperSlide>
          ))}
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
        >
          {images.map((image, index) => (
            <SwiperSlide 
              key={index}
              onClick={() => router.push('/collections')}
              style={{
                backgroundImage: `url("${image}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                cursor: 'pointer'
              }}
            ></SwiperSlide>
          ))}
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

