export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  unit: string;
  image: string;
  badge?: string;
};

export const featuredProducts: Product[] = [
  {
    id: 1,
    name: "India Gate Basmati Rice",
    category: "Staples",
    price: 120,
    unit: "1 kg",
    image: "/products/basmati-rice.jpg",
    badge: "Popular",
  },
  {
    id: 2,
    name: "Aashirvaad Atta",
    category: "Staples",
    price: 85,
    unit: "1 kg",
    image: "/products/atta.jpg",
  },
  {
    id: 3,
    name: "Tata Salt",
    category: "Groceries",
    price: 30,
    unit: "1 kg",
    image: "/products/salt.jpg",
  },
  {
    id: 4,
    name: "Tata Tea",
    category: "Beverages",
    price: 140,
    unit: "250 g",
    image: "/products/tea.jpg",
    badge: "Bestseller",
  },
];