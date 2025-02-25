"use client";
import { useState, useEffect, Suspense } from "react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { ProductGrid } from "../components/ProductGrid";
import { X } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Slider } from "../components/ui/slider";
import TopBanner from "../components/layout/TopBanner";
import { useCategory } from "../context/CategoryContext";
import { useFilter } from "../context/FilterContext";

export default function CollectionsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [fabrics, setFabrics] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getCurrentCategoryName, activeCategory, handleCategoryChange } =
    useCategory();
  const {
    sortBy,
    setSortBy,
    season,
    setSeason,
    priceRange = [0, 20000],
    setPriceRange,
    fabric,
    setFabric,
  } = useFilter();

  useEffect(() => {
    const fetchFabrics = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/web/fabrics`
        );
        const data = await response.json();
        console.log("Fetched fabrics:", data);
        setFabrics(data.data || []);
      } catch (error) {
        console.error("Error fetching fabrics:", error);
        setFabrics([]);
      }
    };
    fetchFabrics();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/web/category-hierarchy`
        );
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Get default categories if none are selected
  const defaultMainCategory = categories[0] || {};
  const defaultSubCategory = defaultMainCategory?.sub_categories?.[0] || {};
  const defaultSubSubCategories = defaultSubCategory?.categories || [];

  // Find the parent subcategory of a selected sub-subcategory
  const findParentSubCategory = () => {
    if (!activeCategory.category.id) return null;

    for (const main of categories) {
      for (const sub of main.sub_categories || []) {
        const found = sub.categories?.find(
          (cat) => cat._id === activeCategory.category.id
        );
        if (found) {
          return {
            mainCategory: main,
            subCategory: sub,
            category: found,
          };
        }
      }
    }
    return null;
  };

  // Get the parent categories if a sub-subcategory is directly selected
  const parentCategories = findParentSubCategory();

  // Use selected categories, parent categories, or defaults
  const mainCategory =
    categories.find((cat) => cat._id === activeCategory.mainCategory.id) ||
    parentCategories?.mainCategory ||
    defaultMainCategory;

  const subCategory =
    mainCategory?.sub_categories?.find(
      (sub) => sub._id === activeCategory.subCategory.id
    ) ||
    parentCategories?.subCategory ||
    mainCategory?.sub_categories?.[0] ||
    defaultSubCategory;

  const subSubCategories = subCategory?.categories || defaultSubSubCategories;

  // Get the currently selected sub-subcategory
  const selectedSubSubCategory = activeCategory.category.id
    ? subCategory?.categories?.find(
        (cat) => cat._id === activeCategory.category.id
      ) || parentCategories?.category
    : null;

  // If there's a main category selected but no subcategory, select the first one
  useEffect(() => {
    if (
      mainCategory?._id &&
      !activeCategory.subCategory.id &&
      mainCategory.sub_categories?.[0]
    ) {
      const firstSubCategory = mainCategory.sub_categories[0];
      handleCategoryClick(new Event("click"), mainCategory, firstSubCategory);
    }
  }, [mainCategory?.id, activeCategory.subCategory.id]);

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handleSeasonChange = (value) => {
    setSeason(value);
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  const handleFabricChange = (value) => {
    setFabric(value);
  };

  const handleCategoryClick = (e, mainCategory, subCategory, category) => {
    e.preventDefault();
    if (category && subCategory) {
      // When clicking a sub-sub-category (category)
      handleCategoryChange("category", category._id, category.category_name, {
        mainCategory: {
          _id: mainCategory._id,
          category_name: mainCategory.category_name,
        },
        subCategory: {
          _id: subCategory._id,
          category_name: subCategory.category_name,
        },
      });
    } else if (subCategory) {
      // When clicking a sub-category
      handleCategoryChange(
        "sub-category",
        subCategory._id,
        subCategory.category_name,
        {
          mainCategory: {
            _id: mainCategory._id,
            category_name: mainCategory.category_name,
          },
        }
      );
    } else if (mainCategory) {
      // When clicking a main category
      handleCategoryChange(
        "main-category",
        mainCategory._id,
        mainCategory.category_name
      );
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen flex flex-col">
        <TopBanner />
        <Header />

        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-2 sm:py-4">
          <div className="text-xs sm:text-sm">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            {" > "}
            <span>{getCurrentCategoryName().toUpperCase()}</span>
          </div>
        </div>

        {/* Hero Image Section - Always show */}
        <div className="container mx-auto px-4 mb-4 sm:mb-8">
          <div className="relative h-[200px] sm:h-[300px] w-full">
            <img
              src={
                mainCategory.image_url || defaultMainCategory.image_url || null
              }
              alt={
                mainCategory.category_name ||
                defaultMainCategory.category_name ||
                ""
              }
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-4 sm:mb-6 md:mb-8 mt-3 sm:mt-4 md:mt-6">
            {selectedSubSubCategory ? (
              <>
                {/* <span className="block text-lg sm:text-xl md:text-2xl text-gray-600 mb-2">
                {subCategory.category_name || defaultSubCategory.category_name || ''}
              </span> */}
                <span className="block">
                  {selectedSubSubCategory.category_name}
                </span>
              </>
            ) : (
              subCategory.category_name ||
              defaultSubCategory.category_name ||
              ""
            )}
          </h1>
          {(subSubCategories.length > 0 ||
            defaultSubSubCategories.length > 0) && (
            <div className="flex flex-wrap place-items-center justify-center gap-4 max-w-[85%] sm:max-w-[80%] md:max-w-[75%] lg:max-w-[70%] mx-auto">
              {(subSubCategories.length > 0
                ? subSubCategories
                : defaultSubSubCategories
              )
                .filter((category) =>
                  // If a sub-subcategory is selected, show all siblings except the selected one
                  selectedSubSubCategory
                    ? category._id !== selectedSubSubCategory._id
                    : true
                )
                .map((category) => (
                  <Link
                    href="/collections"
                    key={category._id}
                    onClick={(e) =>
                      handleCategoryClick(
                        e,
                        mainCategory,
                        subCategory,
                        category
                      )
                    }
                    className={`flex flex-col items-center justify-center text-center w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] md:w-[calc(25%-12px)] lg:w-[calc(20%-13px)] ${
                      category._id === activeCategory.category.id
                        ? "opacity-50"
                        : ""
                    }`}
                  >
                    <div className="relative w-[80%] sm:w-[75%] md:w-[70%] lg:w-[65%] aspect-square rounded-full overflow-hidden mb-2">
                      <img
                        src={category.image_url}
                        alt={category.category_name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-[10px] sm:text-xs md:text-sm font-medium">
                      {category.category_name}
                    </span>
                  </Link>
                ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar - Mobile Button */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="w-full px-4 py-2 bg-gray-50 rounded-lg text-left hover:bg-gray-100 transition-colors"
              >
                Show Filters
              </button>
            </div>

            {/* Mobile Filter Drawer */}
            {isFilterOpen && (
              <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
                <div className="absolute right-0 top-0 h-full w-[300px] bg-white p-6 overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Filter Content */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        SORT BY:
                      </h3>
                      <Select value={sortBy} onValueChange={handleSortChange}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="DATE, NEW TO OLD" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">DATE, NEW TO OLD</SelectItem>
                          <SelectItem value="old">DATE, OLD TO NEW</SelectItem>
                          <SelectItem value="price-asc">
                            PRICE, LOW TO HIGH
                          </SelectItem>
                          <SelectItem value="price-desc">
                            PRICE, HIGH TO LOW
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        SEASON
                      </h3>
                      <Select
                        value={season || "all"}
                        onValueChange={handleSeasonChange}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="All Seasons" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Seasons</SelectItem>
                          <SelectItem value="summer">Summer</SelectItem>
                          <SelectItem value="winter">Winter</SelectItem>
                          <SelectItem value="spring">Spring</SelectItem>
                          <SelectItem value="fall">Fall</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        PRICE
                      </h3>
                      <Slider
                        value={priceRange}
                        onValueChange={handlePriceChange}
                        max={20000}
                        step={500}
                        className="mt-4"
                      />
                      <div className="flex justify-between mt-2 text-sm">
                        <span>Rs. {priceRange[0]}</span>
                        <span>Rs. {priceRange[1]}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        FABRIC
                      </h3>
                      <Select
                        value={fabric || "all"}
                        onValueChange={handleFabricChange}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select Fabric" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Fabrics</SelectItem>
                          {fabrics.map((fabric) => (
                            <SelectItem
                              key={fabric?._id}
                              value={String(fabric?._id || "")}
                            >
                              {fabric?.fabric_name || "Unknown Fabric"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Apply Filters Button */}
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors mt-6"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Filters Sidebar - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="space-y-6 bg-gray-50 p-6 rounded-lg border border-gray-200 sticky top-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">SORT BY:</h3>
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="DATE, NEW TO OLD" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">DATE, NEW TO OLD</SelectItem>
                      <SelectItem value="old">DATE, OLD TO NEW</SelectItem>
                      <SelectItem value="price-asc">
                        PRICE, LOW TO HIGH
                      </SelectItem>
                      <SelectItem value="price-desc">
                        PRICE, HIGH TO LOW
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">SEASON</h3>
                  <Select
                    value={season || "all"}
                    onValueChange={handleSeasonChange}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="All Seasons" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Seasons</SelectItem>
                      <SelectItem value="summer">Summer</SelectItem>
                      <SelectItem value="winter">Winter</SelectItem>
                      <SelectItem value="spring">Spring</SelectItem>
                      <SelectItem value="fall">Fall</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">PRICE</h3>
                  <Slider
                    value={priceRange}
                    onValueChange={handlePriceChange}
                    max={20000}
                    step={500}
                    className="mt-4"
                  />
                  <div className="flex justify-between mt-2 text-sm">
                    <span>Rs. {priceRange[0]}</span>
                    <span>Rs. {priceRange[1]}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">FABRIC</h3>
                  <Select
                    value={fabric || "all"}
                    onValueChange={handleFabricChange}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select Fabric" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Fabrics</SelectItem>
                      {fabrics.map((fabric) => (
                        <SelectItem
                          key={fabric?._id}
                          value={String(fabric?._id || "")}
                        >
                          {fabric?.fabric_name || "Unknown Fabric"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                {getCurrentCategoryName().toUpperCase()}
              </h1>
              <ProductGrid />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </Suspense>
  );
}
