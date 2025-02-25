"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useCategory } from "../../context/CategoryContext"
import { useFilter } from "../../context/FilterContext"

interface Category {
  _id: string
  category_name: string
  image_url: string
  created_at: string
  updated_at: string
}

interface SubCategory extends Category {
  categories: Category[]
}

interface MainCategory extends Category {
  sub_categories: SubCategory[]
}

export function NavMenu() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [activeImage, setActiveImage] = useState<string | null>(null)
  const [defaultImage, setDefaultImage] = useState<string | null>(null)
  const [categories, setCategories] = useState<MainCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { handleCategoryChange, handleClearCategories } = useCategory()
  const { resetFilters } = useFilter()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/web/category-hierarchy`)
        const data = await response.json()
        if (data.success) {
          setCategories(data.data)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleCategoryClick = (
    e: React.MouseEvent,
    mainCategory: MainCategory,
    subCategory?: SubCategory,
    category?: Category
  ) => {
    e.preventDefault()
    if (category && subCategory) {
      handleCategoryChange('category', category._id, category.category_name, {
        mainCategory: {
          _id: mainCategory._id,
          category_name: mainCategory.category_name
        },
        subCategory: {
          _id: subCategory._id,
          category_name: subCategory.category_name
        }
      })
    } else if (subCategory) {
      handleCategoryChange('sub-category', subCategory._id, subCategory.category_name, {
        mainCategory: {
          _id: mainCategory._id,
          category_name: mainCategory.category_name
        }
      })
    } else if (mainCategory) {
      handleCategoryChange('main-category', mainCategory._id, mainCategory.category_name)
    }
  }

  const handleSubCategoryHover = (imageUrl: string | null) => {
    setActiveImage(imageUrl)
  }

  const handleMainCategoryHover = (category: MainCategory) => {
    setActiveMenu(category?._id)
    const defaultImg = category?.sub_categories[0]?.image_url 
    setDefaultImage(defaultImg)
    setActiveImage(null)
  }

  const handleAllClick = (e: React.MouseEvent) => {
    e.preventDefault()
    handleClearCategories()
    resetFilters()
  }

  if (isLoading) {
    return (
      <nav className="relative">
        <div className="hidden lg:flex justify-center gap-8 py-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
        <div className="lg:hidden py-2">
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="relative">
      {/* Mobile Menu Button */}
      <div className="lg:hidden py-2">
        <button 
          onClick={() => setActiveMenu(activeMenu ? null : 'menu')}
          className="w-full px-4 py-2.5 flex items-center justify-between text-gray-700 hover:bg-gray-50 border rounded-lg"
        >
          <div className="flex items-center gap-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
            <span className="font-medium">Menu</span>
          </div>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 transition-transform duration-200 ${activeMenu ? 'rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 9l-7 7-7-7" 
            />
          </svg>
        </button>
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:flex justify-center gap-8 py-4">
        {/* <div className="relative">
          <Link
            href="/collections"
            onClick={handleAllClick}
            className="uppercase relative hover:text-[#101b2f] transition-colors after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-[#101b2f] after:left-0 after:bottom-0 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
          >
            All
          </Link>
        </div> */}
        {categories.map((category) => (
          <div
            key={category?._id}
            className="relative"
            onMouseEnter={() => handleMainCategoryHover(category)}
            onMouseLeave={() => {
              setActiveMenu(null)
              setDefaultImage(null)
              setActiveImage(null)
            }}
          >
            <Link
              href="/collections"
              onClick={(e) => handleCategoryClick(e, category)}
              className="uppercase relative hover:text-[#101b2f] transition-colors after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-[#101b2f] after:left-0 after:bottom-0 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
            >
              {category.category_name}
            </Link>
            
            <AnimatePresence>
              {activeMenu === category._id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 transform -translate-x-1/2 top-full z-50 w-[1000px] bg-white shadow-lg rounded-lg"
                  style={{ 
                    left: '-25vw',
                    transform: 'translateX(-50%)'
                  }}
                >
                  <div className="grid grid-cols-12 gap-6 p-6">
                    <div className="col-span-8">
                      <div className="grid grid-cols-3 gap-6">
                        {category.sub_categories.map((subCategory) => (
                          <div 
                            key={subCategory?._id} 
                            className="mb-6"
                            onMouseEnter={() => handleSubCategoryHover(subCategory?.image_url)}
                            onMouseLeave={() => handleSubCategoryHover(null)}
                          >
                            <Link
                              href="/collections"
                              onClick={(e) => handleCategoryClick(e, category, subCategory)}
                              className="font-semibold text-[#101b2f] mb-4 block hover:text-[#5d4f51]"
                            >
                              {subCategory?.category_name}
                            </Link>
                            {subCategory?.categories?.length > 0 && (
                              <div className="flex flex-col gap-2 mt-2">
                                {subCategory?.categories?.map((cat) => (
                                  <Link
                                    key={cat?._id}
                                    href="/collections"
                                    onClick={(e) => handleCategoryClick(e, category, subCategory, cat)}
                                    className="block hover:bg-gray-50 p-2 rounded-lg transition-colors"
                                  >
                                    <span className="text-gray-600 hover:text-[#101b2f]">
                                      {cat?.category_name}
                                    </span>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="col-span-4">
                      <div 
                        className="h-[300px] w-[300px] mx-auto rounded-lg overflow-hidden bg-center bg-no-repeat bg-cover transition-all duration-300"
                        style={{ 
                          backgroundImage: `url(${activeImage || defaultImage || category?.image_url})`
                        }}
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-b-lg">
                    <Link
                      href="/collections"
                      onClick={(e) => handleCategoryClick(e, category)}
                      className="text-[#101b2f] hover:text-[#5d4f51] font-medium flex items-center gap-2"
                    >
                      View All {category?.category_name}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {activeMenu === 'menu' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white shadow-lg"
          >
            <Link
              href="/collections"
              onClick={(e) => {
                e.preventDefault()
                handleClearCategories()
              }}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              All Products
            </Link>
            {categories.map((category) => (
              <Link
                key={category?._id}
                href="/collections"
                onClick={(e) => handleCategoryClick(e, category)}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                {category?.category_name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
} 