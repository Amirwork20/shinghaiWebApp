export const products = [
  {
    id: 1,
    name: "Puppy Floral Snap Clip",
    images: [
      "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=500",
      "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?q=80&w=500", 
      "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?q=80&w=500",
      "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?q=80&w=500",
      "https://images.unsplash.com/photo-1592187270271-9a4b84faa228?q=80&w=500",
      "https://images.unsplash.com/photo-1566206091558-7f218b696731?q=80&w=500"
    ],
    salePrice: 350,
    originalPrice: 599,
    discount: 50,
    rating: 4.5,
    reviews: 128,
    description: "Adorable puppy-themed floral hair clip, perfect for everyday wear",
    colors: ["Pink", "Blue", "Purple"]
  },
  {
    id: 2,
    name: "Butterfly Dream Hair Clip Set",
    images: [
      "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?q=80&w=500",
      "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?q=80&w=500",
      "https://images.unsplash.com/photo-1566206091558-7f218b696731?q=80&w=500"
    ],
    salePrice: 450,
    originalPrice: 699,
    discount: 35,
    rating: 4.8,
    reviews: 95,
    description: "Beautiful butterfly-themed hair clip set with sparkly details",
    colors: ["Gold", "Silver", "Rose Gold"]
  },
  {
    id: 3,
    name: "Daisy Chain Hair Clips",
    images: [
      "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?q=80&w=500",
      "https://images.unsplash.com/photo-1592187270271-9a4b84faa228?q=80&w=500",
      "https://images.unsplash.com/photo-1566206091558-7f218b696731?q=80&w=500"
    ],
    salePrice: 299,
    originalPrice: 499,
    discount: 40,
    rating: 4.3,
    reviews: 67,
    description: "Sweet daisy-themed hair clips perfect for spring and summer",
    colors: ["White", "Yellow", "Pink"]
  },
  {
    id: 4,
    name: "Princess Crown Hair Clip",
    images: [
      "https://images.unsplash.com/photo-1592187270271-9a4b84faa228?q=80&w=500",
      "https://images.unsplash.com/photo-1566206091558-7f218b696731?q=80&w=500",
      "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=500"
    ],
    salePrice: 599,
    originalPrice: 899,
    discount: 33,
    rating: 4.9,
    reviews: 156,
    description: "Elegant crown-shaped hair clip with rhinestone detailing",
    colors: ["Gold", "Silver", "Rose Gold", "Pearl"]
  },
  {
    id: 5,
    name: "Rainbow Bow Collection",
    images: [
      "https://images.unsplash.com/photo-1566206091558-7f218b696731?q=80&w=500",
      "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=500",
      "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?q=80&w=500"
    ],
    salePrice: 399,
    originalPrice: 649,
    discount: 38,
    rating: 4.6,
    reviews: 89,
    description: "Colorful bow-shaped hair clips in various rainbow colors",
    colors: ["Rainbow", "Pastel Rainbow", "Metallic Rainbow"]
  }
]

// Optional: Add a type definition for better TypeScript support
export type Product = {
  id: number
  name: string
  images: string[]
  salePrice: number
  originalPrice: number
  discount: number
  rating: number
  reviews: number
  description: string
  colors: string[]
} 