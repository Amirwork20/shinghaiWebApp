"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useCategory } from "../../context/CategoryContext"
import { useFilter } from "../../context/FilterContext"
import { usePathname } from "next/navigation"

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
  const [isHoveringDropdown, setIsHoveringDropdown] = useState(false)
  const [mobileActiveMainCategory, setMobileActiveMainCategory] = useState<string | null>(null)
  const [mobileActiveSubCategory, setMobileActiveSubCategory] = useState<string | null>(null)
  const { handleCategoryChange, handleClearCategories } = useCategory()
  const { resetFilters } = useFilter()
  const pathname = usePathname()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

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
    // Clear any existing timeout to prevent it from closing the dropdown
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    
    setActiveMenu(category?._id)
    const defaultImg = category?.sub_categories[0]?.image_url 
    setDefaultImage(defaultImg)
    setActiveImage(null)
  }

  const handleMenuItemLeave = () => {
    // Only close the dropdown if we're not hovering over the dropdown
    if (!isHoveringDropdown) {
      // Add a small delay before closing to allow for movement to the dropdown
      timeoutRef.current = setTimeout(() => {
        setActiveMenu(null)
        setDefaultImage(null)
        setActiveImage(null)
      }, 100)
    }
  }

  const handleDropdownMouseEnter = () => {
    // Clear any timeout that might close the dropdown
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsHoveringDropdown(true)
  }

  const handleDropdownMouseLeave = () => {
    setIsHoveringDropdown(false)
    // Add a small delay before closing
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null)
      setDefaultImage(null)
      setActiveImage(null)
    }, 100)
  }

  // Handlers for mobile menu sections
  const handleMobileMainCategoryToggle = (categoryId: string) => {
    if (mobileActiveMainCategory === categoryId) {
      setMobileActiveMainCategory(null)
      setMobileActiveSubCategory(null) // Close subcategory when main closes
    } else {
      setMobileActiveMainCategory(categoryId)
      setMobileActiveSubCategory(null) // Reset subcategory when changing main
    }
  }

  const handleMobileSubCategoryToggle = (subCategoryId: string) => {
    setMobileActiveSubCategory(prevState => 
      prevState === subCategoryId ? null : subCategoryId
    )
  }

  const handleAllClick = (e: React.MouseEvent) => {
    e.preventDefault()
    handleClearCategories()
    resetFilters()
  }

  const isActive = (categoryName: string) => {
    // Simple logic to determine if a menu item is active
    // This can be expanded based on your actual routing/state needs
    return pathname.includes(categoryName.toLowerCase())
  }

  if (isLoading) {
    return (
      <nav className="relative">
        <div className="hidden lg:flex justify-center gap-8 py-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-4 w-24 bg-gray-600 rounded"></div>
            </div>
          ))}
        </div>
        <div className="lg:hidden py-2">
          <div className="h-10 w-full bg-gray-600 rounded animate-pulse"></div>
        </div>
      </nav>
    )
  }

  // Find the active category
  const activeCategory = categories.find(cat => cat._id === activeMenu);

  return (
    <nav className="relative bg-white">
      {/* Mobile Menu Button */}
      <div className="lg:hidden py-2">
        <button 
          onClick={() => setActiveMenu(activeMenu ? null : 'menu')}
          className="w-full px-4 py-2.5 flex items-center justify-between text-black hover:bg-gray-100 border border-gray-300 rounded-lg"
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

      <div className="lg:block">
        {/* Desktop Menu - Use actual categories from API */}
        <div className="hidden lg:flex justify-center border-t border-b border-gray-300 py-3 bg-white">
          {categories.map((category) => (
            <div
              key={category._id}
              className="relative px-10"
              onMouseEnter={() => handleMainCategoryHover(category)}
              onMouseLeave={handleMenuItemLeave}
            >
              <Link
                href="/collections"
                onClick={(e) => handleCategoryClick(e, category)}
                className={`uppercase text-[15px] font-medium relative hover:text-gray-600 transition-colors ${
                  isActive(category.category_name) ? "text-gray-600" : "text-black"
                }`}
              >
                {category.category_name}
              </Link>
            </div>
          ))}
        </div>
        
        {/* Centralized dropdown */}
        {activeCategory && (
          <div className="hidden lg:block">
            <div 
              className="fixed left-0 right-0 mx-auto z-50 bg-white text-black shadow-lg rounded-lg"
              style={{
                width: '800px',
                maxWidth: '90%',
                top: '70px',
                marginLeft: 'auto',
                marginRight: 'auto',
                position: 'absolute',
                zIndex: 9999
              }}
              onMouseEnter={handleDropdownMouseEnter}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <div className="grid grid-cols-12 gap-6 p-6">
                <div className="col-span-12 md:col-span-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {activeCategory.sub_categories.map((subCategory) => (
                      <div 
                        key={subCategory?._id} 
                        className="mb-6"
                        onMouseEnter={() => handleSubCategoryHover(subCategory?.image_url)}
                        onMouseLeave={() => handleSubCategoryHover(null)}
                      >
                        <Link
                          href="/collections"
                          onClick={(e) => handleCategoryClick(e, activeCategory, subCategory)}
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
                                onClick={(e) => handleCategoryClick(e, activeCategory, subCategory, cat)}
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
                <div className="hidden md:block md:col-span-4">
                  <div 
                    className="h-[250px] w-full md:w-[250px] mx-auto rounded-lg overflow-hidden bg-center bg-no-repeat bg-cover transition-all duration-300"
                    style={{ 
                      backgroundImage: `url(${activeImage || defaultImage || activeCategory?.image_url})`
                    }}
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-b-lg">
                <Link
                  href="/collections"
                  onClick={(e) => handleCategoryClick(e, activeCategory)}
                  className="text-[#101b2f] hover:text-[#5d4f51] font-medium flex items-center gap-2"
                >
                  View All {activeCategory?.category_name}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {activeMenu === 'menu' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white shadow-lg border-t border-gray-200"
          >
            <div className="py-2">
              {categories.map((category) => (
                <div key={category._id} className="border-b border-gray-100 last:border-b-0">
                  <button
                    onClick={() => handleMobileMainCategoryToggle(category._id)}
                    className="w-full px-4 py-3 flex items-center justify-between text-black font-medium hover:bg-gray-50 text-left"
                  >
                    <span>{category.category_name}</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 transition-transform duration-200 ${mobileActiveMainCategory === category._id ? 'rotate-180' : ''}`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {mobileActiveMainCategory === category._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-gray-50"
                      >
                        {/* Link for the main category itself */}  
                        <Link
                          href="/collections"
                          onClick={(e) => {
                              handleCategoryClick(e, category);
                              setActiveMenu(null); // Close mobile menu on click
                          }}
                          className="block pl-8 pr-4 py-2 text-black hover:bg-gray-100"
                        >
                           View All {category.category_name}
                        </Link>
                        {category.sub_categories?.map((subCategory) => (
                          <div key={subCategory._id} className="border-t border-gray-200">
                            <button
                              onClick={() => handleMobileSubCategoryToggle(subCategory._id)}
                              className="w-full pl-8 pr-4 py-3 flex items-center justify-between text-black font-medium hover:bg-gray-100 text-left"
                            >
                              <span>{subCategory.category_name}</span>
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className={`h-4 w-4 transition-transform duration-200 ${mobileActiveSubCategory === subCategory._id ? 'rotate-180' : ''}`}
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            <AnimatePresence>
                              {mobileActiveSubCategory === subCategory._id && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden bg-gray-100"
                                >
                                  {/* Link for the sub category itself */}  
                                  <Link
                                    href="/collections"
                                    onClick={(e) => {
                                      handleCategoryClick(e, category, subCategory);
                                      setActiveMenu(null); // Close mobile menu on click
                                    }}
                                    className="block pl-12 pr-4 py-2 text-black hover:bg-gray-200"
                                  >
                                    View All {subCategory.category_name}
                                  </Link>
                                  {subCategory.categories?.map((cat) => (
                                    <Link
                                      key={cat._id}
                                      href="/collections"
                                      onClick={(e) => {
                                        handleCategoryClick(e, category, subCategory, cat);
                                        setActiveMenu(null); // Close mobile menu on click
                                      }}
                                      className="block pl-12 pr-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black"
                                    >
                                      {cat.category_name}
                                    </Link>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              <div className="border-t border-gray-200">
                <Link
                  href="/checkout"
                  className="block px-4 py-3 text-black font-medium hover:bg-gray-100"
                  onClick={() => setActiveMenu(null)} // Close mobile menu
                >
                  CHECKOUT
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
} 