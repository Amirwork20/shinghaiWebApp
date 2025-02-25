"use client";
import { createContext, useContext, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const CategoryContext = createContext();

export function CategoryProvider({ children }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState({
    mainCategory: {
      id: searchParams.get("main-category") || null,
      name: searchParams.get("main-category-name") || null,
    },
    subCategory: {
      id: searchParams.get("sub-category") || null,
      name: searchParams.get("sub-category-name") || null,
    },
    category: {
      id: searchParams.get("cat") || null,
      name: searchParams.get("cat-name") || null,
    },
    search: searchParams.get("search") || null,
  });

  const handleSearch = (searchTerm) => {
    const newParams = new URLSearchParams(searchParams.toString());

    // Reset all category params when searching
    newParams.delete("main-category");
    newParams.delete("main-category-name");
    newParams.delete("sub-category");
    newParams.delete("sub-category-name");
    newParams.delete("cat");
    newParams.delete("cat-name");

    if (searchTerm) {
      // Format search term: trim whitespace and convert to lowercase
      const formattedSearch = searchTerm.trim().toLowerCase();
      newParams.set("search", formattedSearch);

      setActiveCategory({
        mainCategory: { id: null, name: null },
        subCategory: { id: null, name: null },
        category: { id: null, name: null },
        search: formattedSearch,
      });
    } else {
      newParams.delete("search");
      setActiveCategory({
        mainCategory: { id: null, name: null },
        subCategory: { id: null, name: null },
        category: { id: null, name: null },
        search: null,
      });
    }

    router.push(`/collections?${newParams.toString()}`);
  };

  const handleCategoryChange = (type, id, name, parentInfo) => {
    const newParams = new URLSearchParams(searchParams.toString());

    // Clear search parameter for all category changes
    newParams.delete("search");

    switch (type) {
      case "main-category":
        // Clear all and set main category
        newParams.delete("sub-category");
        newParams.delete("sub-category-name");
        newParams.delete("cat");
        newParams.delete("cat-name");
        newParams.set("main-category", id);
        newParams.set("main-category-name", name);
        setActiveCategory({
          mainCategory: { id, name },
          subCategory: { id: null, name: null },
          category: { id: null, name: null },
          search: null,
        });
        break;

      case "sub-category":
        // Set main and sub category, clear category
        if (parentInfo?.mainCategory) {
          newParams.set("main-category", parentInfo.mainCategory._id);
          newParams.set(
            "main-category-name",
            parentInfo.mainCategory.category_name
          );
        }
        newParams.set("sub-category", id);
        newParams.set("sub-category-name", name);
        newParams.delete("cat");
        newParams.delete("cat-name");
        setActiveCategory({
          mainCategory: parentInfo?.mainCategory
            ? {
                id: parentInfo.mainCategory._id,
                name: parentInfo.mainCategory.category_name,
              }
            : { id: null, name: null },
          subCategory: { id, name },
          category: { id: null, name: null },
          search: null,
        });
        break;

      case "category":
        // Set all category levels
        if (parentInfo?.mainCategory) {
          newParams.set("main-category", parentInfo.mainCategory._id);
          newParams.set(
            "main-category-name",
            parentInfo.mainCategory.category_name
          );
        }
        if (parentInfo?.subCategory) {
          newParams.set("sub-category", parentInfo.subCategory._id);
          newParams.set(
            "sub-category-name",
            parentInfo.subCategory.category_name
          );
        }
        newParams.set("cat", id);
        newParams.set("cat-name", name);

        setActiveCategory({
          mainCategory: parentInfo?.mainCategory
            ? {
                id: parentInfo.mainCategory._id,
                name: parentInfo.mainCategory.category_name,
              }
            : { id: null, name: null },
          subCategory: parentInfo?.subCategory
            ? {
                id: parentInfo.subCategory._id,
                name: parentInfo.subCategory.category_name,
              }
            : { id: null, name: null },
          category: { id, name },
          search: null,
        });
        break;
    }

    router.push(`/collections?${newParams.toString()}`);
  };

  const getCurrentCategoryName = () => {
    if (activeCategory?.category?.name) return activeCategory?.category?.name;
    if (activeCategory?.subCategory?.name)
      return activeCategory?.subCategory?.name;
    if (activeCategory?.mainCategory?.name)
      return activeCategory?.mainCategory?.name;
    return "All Products";
  };

  const handleClearCategories = () => {
    const newParams = new URLSearchParams();

    setActiveCategory({
      mainCategory: { id: null, name: null },
      subCategory: { id: null, name: null },
      category: { id: null, name: null },
      search: null,
    });

    router.push("/collections");
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoryContext.Provider
        value={{
          activeCategory,
          handleCategoryChange,
          handleSearch,
          getCurrentCategoryName,
          handleClearCategories,
        }}
      >
        {children}
      </CategoryContext.Provider>
    </Suspense>
  );
}

export function useCategory() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }
  return context;
}
