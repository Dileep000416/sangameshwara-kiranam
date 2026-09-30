/**
 * Seed category list, organized into the top-level groups from the project
 * spec. `slug` here is only a local lookup key used by seed.ts to resolve
 * `categoryId` for each product — it does not need to match the `slug`
 * field the backend generates and stores on the CategoryRecord itself.
 */
export interface SeedCategory {
  slug: string;
  name: string;
  parentGroup: string;
  description: string;
}

export const seedCategories: SeedCategory[] = [
  // Fruits & Vegetables
  { slug: "fresh-fruits", name: "Fresh Fruits", parentGroup: "Fruits & Vegetables", description: "Seasonal and everyday fresh fruits." },
  { slug: "fresh-vegetables", name: "Fresh Vegetables", parentGroup: "Fruits & Vegetables", description: "Everyday fresh vegetables." },
  { slug: "leafy-vegetables", name: "Leafy Vegetables", parentGroup: "Fruits & Vegetables", description: "Fresh leafy greens." },
  { slug: "exotic-fruits", name: "Exotic Fruits", parentGroup: "Fruits & Vegetables", description: "Imported and exotic fruits." },
  { slug: "exotic-vegetables", name: "Exotic Vegetables", parentGroup: "Fruits & Vegetables", description: "Exotic and specialty vegetables." },

  // Grocery & Staples
  { slug: "rice", name: "Rice", parentGroup: "Grocery & Staples", description: "Basmati, Sona Masoori and everyday rice varieties." },
  { slug: "atta-flour", name: "Atta & Flour", parentGroup: "Grocery & Staples", description: "Wheat atta, maida, rava and other flours." },
  { slug: "dal-pulses", name: "Dal & Pulses", parentGroup: "Grocery & Staples", description: "Toor, moong, chana, urad and other dals." },
  { slug: "salt", name: "Salt", parentGroup: "Grocery & Staples", description: "Iodised and rock salt." },
  { slug: "sugar", name: "Sugar", parentGroup: "Grocery & Staples", description: "Sugar and sweeteners." },
  { slug: "jaggery", name: "Jaggery", parentGroup: "Grocery & Staples", description: "Jaggery and natural sweeteners." },
  { slug: "edible-oil", name: "Edible Oil", parentGroup: "Grocery & Staples", description: "Cooking oils for everyday use." },
  { slug: "ghee", name: "Ghee", parentGroup: "Grocery & Staples", description: "Pure and blended ghee." },

  // Masalas & Dry Fruits
  { slug: "whole-spices", name: "Whole Spices", parentGroup: "Masalas & Dry Fruits", description: "Whole spices for everyday cooking." },
  { slug: "powdered-spices", name: "Powdered Spices", parentGroup: "Masalas & Dry Fruits", description: "Ground masalas and spice powders." },
  { slug: "dry-fruits", name: "Dry Fruits", parentGroup: "Masalas & Dry Fruits", description: "Almonds, cashews, raisins and more." },
  { slug: "nuts", name: "Nuts", parentGroup: "Masalas & Dry Fruits", description: "Everyday and premium nuts." },
  { slug: "seeds", name: "Seeds", parentGroup: "Masalas & Dry Fruits", description: "Edible seeds for cooking and snacking." },

  // Dairy & Breakfast
  { slug: "milk", name: "Milk", parentGroup: "Dairy & Breakfast", description: "Fresh and packaged milk." },
  { slug: "curd", name: "Curd", parentGroup: "Dairy & Breakfast", description: "Fresh curd and yogurt." },
  { slug: "paneer", name: "Paneer", parentGroup: "Dairy & Breakfast", description: "Fresh paneer." },
  { slug: "butter", name: "Butter", parentGroup: "Dairy & Breakfast", description: "Table and cooking butter." },
  { slug: "cheese", name: "Cheese", parentGroup: "Dairy & Breakfast", description: "Cheese slices, cubes and spreads." },
  { slug: "eggs", name: "Eggs", parentGroup: "Dairy & Breakfast", description: "Farm-fresh eggs." },
  { slug: "bread", name: "Bread", parentGroup: "Dairy & Breakfast", description: "Bread and bakery essentials." },
  { slug: "batter", name: "Batter", parentGroup: "Dairy & Breakfast", description: "Ready-to-cook batters." },
  { slug: "breakfast-items", name: "Breakfast Items", parentGroup: "Dairy & Breakfast", description: "Cereals and breakfast essentials." },

  // Snacks & Beverages
  { slug: "chips", name: "Chips", parentGroup: "Snacks & Beverages", description: "Potato chips and savoury snacks." },
  { slug: "namkeens", name: "Namkeens", parentGroup: "Snacks & Beverages", description: "Traditional Indian namkeens." },
  { slug: "biscuits", name: "Biscuits", parentGroup: "Snacks & Beverages", description: "Everyday and premium biscuits." },
  { slug: "chocolates", name: "Chocolates", parentGroup: "Snacks & Beverages", description: "Chocolates and confectionery." },
  { slug: "sweets", name: "Sweets", parentGroup: "Snacks & Beverages", description: "Traditional Indian sweets." },
  { slug: "tea", name: "Tea", parentGroup: "Snacks & Beverages", description: "Tea and tea blends." },
  { slug: "coffee", name: "Coffee", parentGroup: "Snacks & Beverages", description: "Coffee powders and blends." },
  { slug: "soft-drinks", name: "Soft Drinks", parentGroup: "Snacks & Beverages", description: "Carbonated soft drinks." },
  { slug: "juices", name: "Juices", parentGroup: "Snacks & Beverages", description: "Packaged fruit juices." },
  { slug: "energy-drinks", name: "Energy Drinks", parentGroup: "Snacks & Beverages", description: "Energy and sports drinks." },

  // Instant & Packaged Foods
  { slug: "instant-noodles", name: "Instant Noodles", parentGroup: "Instant & Packaged Foods", description: "Instant noodles and vermicelli." },
  { slug: "pasta", name: "Pasta", parentGroup: "Instant & Packaged Foods", description: "Pasta varieties." },
  { slug: "ready-to-eat", name: "Ready-to-Eat", parentGroup: "Instant & Packaged Foods", description: "Ready-to-eat meals." },
  { slug: "ready-to-cook", name: "Ready-to-Cook", parentGroup: "Instant & Packaged Foods", description: "Ready-to-cook mixes." },
  { slug: "frozen-foods", name: "Frozen Foods", parentGroup: "Instant & Packaged Foods", description: "Frozen snacks and foods." },
  { slug: "sauces", name: "Sauces", parentGroup: "Instant & Packaged Foods", description: "Cooking and dipping sauces." },
  { slug: "ketchup", name: "Ketchup", parentGroup: "Instant & Packaged Foods", description: "Tomato ketchup and sauces." },
  { slug: "mayonnaise", name: "Mayonnaise", parentGroup: "Instant & Packaged Foods", description: "Mayonnaise and spreads." },

  // Household
  { slug: "detergents", name: "Detergents", parentGroup: "Household", description: "Laundry detergents and soaps." },
  { slug: "dishwashers", name: "Dishwashers", parentGroup: "Household", description: "Dishwashing liquids and bars." },
  { slug: "surface-cleaners", name: "Surface Cleaners", parentGroup: "Household", description: "Multi-surface cleaners." },
  { slug: "floor-cleaners", name: "Floor Cleaners", parentGroup: "Household", description: "Floor cleaning liquids." },
  { slug: "toilet-cleaners", name: "Toilet Cleaners", parentGroup: "Household", description: "Toilet and bathroom cleaners." },
  { slug: "mosquito-repellents", name: "Mosquito Repellents", parentGroup: "Household", description: "Mosquito coils, sprays and repellents." },
  { slug: "air-fresheners", name: "Air Fresheners", parentGroup: "Household", description: "Room fresheners and fragrances." },
  { slug: "kitchen-essentials", name: "Kitchen Essentials", parentGroup: "Household", description: "Foils, wraps and kitchen essentials." },
  { slug: "household-essentials", name: "Household Essentials", parentGroup: "Household", description: "General household essentials." },

  // Personal Care
  { slug: "soaps", name: "Soaps", parentGroup: "Personal Care", description: "Bathing soaps and body wash." },
  { slug: "shampoo", name: "Shampoo", parentGroup: "Personal Care", description: "Hair care shampoos." },
  { slug: "conditioner", name: "Conditioner", parentGroup: "Personal Care", description: "Hair conditioners." },
  { slug: "toothpaste", name: "Toothpaste", parentGroup: "Personal Care", description: "Oral care toothpaste." },
  { slug: "toothbrush", name: "Toothbrush", parentGroup: "Personal Care", description: "Toothbrushes and oral care tools." },
  { slug: "body-care", name: "Body Care", parentGroup: "Personal Care", description: "Lotions, creams and body care." },
  { slug: "grooming", name: "Grooming", parentGroup: "Personal Care", description: "Grooming and personal care essentials." },

  // Baby Care
  { slug: "baby-food", name: "Baby Food", parentGroup: "Baby Care", description: "Baby food and formula." },
  { slug: "diapers", name: "Diapers", parentGroup: "Baby Care", description: "Baby diapers." },
  { slug: "baby-hygiene", name: "Baby Hygiene", parentGroup: "Baby Care", description: "Baby wipes and hygiene products." },
  { slug: "baby-care-products", name: "Baby Care Products", parentGroup: "Baby Care", description: "General baby care essentials." },

  // Other
  { slug: "pooja-items", name: "Pooja Items", parentGroup: "Other", description: "Pooja and religious essentials." },
  { slug: "stationery", name: "Stationery", parentGroup: "Other", description: "Everyday stationery items." },
  { slug: "party-supplies", name: "Party Supplies", parentGroup: "Other", description: "Party and celebration supplies." },
];
