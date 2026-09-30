/**
 * Demo product catalog (100+ items) distributed across every category
 * defined in categories-data.ts. Brand names are real, publicly-known
 * consumer product brands used purely as factual/illustrative demo data
 * (as one would find on any grocery price list) — no logos, packaging
 * artwork, or other copyrighted brand assets are used anywhere in this
 * project. Product photos are intentionally left unset; the storefront
 * shows a neutral placeholder icon until the store admin uploads real
 * photos via the admin panel's image upload feature.
 */
export interface SeedProduct {
  categorySlug: string;
  productName: string;
  brand?: string;
  price: number;
  originalPrice: number;
  unit: string;
  featured?: boolean;
}

export const seedProducts: SeedProduct[] = [
  // Rice
  { categorySlug: "rice", productName: "India Gate Basmati Rice", brand: "India Gate", price: 620, originalPrice: 680, unit: "5 kg", featured: true },
  { categorySlug: "rice", productName: "Daawat Basmati Rice", brand: "Daawat", price: 590, originalPrice: 650, unit: "5 kg" },
  { categorySlug: "rice", productName: "Sona Masoori Rice", brand: "Local", price: 220, originalPrice: 240, unit: "5 kg" },
  { categorySlug: "rice", productName: "Ponni Rice", brand: "Local", price: 210, originalPrice: 230, unit: "5 kg" },
  { categorySlug: "rice", productName: "Kolam Rice", brand: "Local", price: 200, originalPrice: 215, unit: "5 kg" },

  // Atta & Flour
  { categorySlug: "atta-flour", productName: "Aashirvaad Atta", brand: "Aashirvaad", price: 260, originalPrice: 280, unit: "5 kg", featured: true },
  { categorySlug: "atta-flour", productName: "Fortune Chakki Fresh Atta", brand: "Fortune", price: 255, originalPrice: 275, unit: "5 kg" },
  { categorySlug: "atta-flour", productName: "Maida (Refined Flour)", brand: "Local", price: 48, originalPrice: 52, unit: "1 kg" },
  { categorySlug: "atta-flour", productName: "Rava (Semolina)", brand: "Local", price: 50, originalPrice: 54, unit: "1 kg" },
  { categorySlug: "atta-flour", productName: "Besan (Gram Flour)", brand: "Rajdhani", price: 95, originalPrice: 105, unit: "1 kg" },

  // Dal & Pulses
  { categorySlug: "dal-pulses", productName: "Toor Dal", brand: "Tata Sampann", price: 160, originalPrice: 175, unit: "1 kg", featured: true },
  { categorySlug: "dal-pulses", productName: "Moong Dal", brand: "Tata Sampann", price: 150, originalPrice: 165, unit: "1 kg" },
  { categorySlug: "dal-pulses", productName: "Masoor Dal", brand: "Tata Sampann", price: 110, originalPrice: 120, unit: "1 kg" },
  { categorySlug: "dal-pulses", productName: "Chana Dal", brand: "Tata Sampann", price: 120, originalPrice: 130, unit: "1 kg" },
  { categorySlug: "dal-pulses", productName: "Urad Dal", brand: "Tata Sampann", price: 145, originalPrice: 160, unit: "1 kg" },
  { categorySlug: "dal-pulses", productName: "Rajma (Kidney Beans)", brand: "Local", price: 135, originalPrice: 150, unit: "1 kg" },
  { categorySlug: "dal-pulses", productName: "Kabuli Chana", brand: "Local", price: 120, originalPrice: 130, unit: "1 kg" },

  // Salt
  { categorySlug: "salt", productName: "Tata Salt", brand: "Tata", price: 28, originalPrice: 30, unit: "1 kg", featured: true },
  { categorySlug: "salt", productName: "Tata Salt Lite", brand: "Tata", price: 45, originalPrice: 50, unit: "1 kg" },
  { categorySlug: "salt", productName: "Rock Salt (Sendha Namak)", brand: "Local", price: 35, originalPrice: 40, unit: "500 g" },

  // Sugar
  { categorySlug: "sugar", productName: "Sugar", brand: "Local", price: 48, originalPrice: 52, unit: "1 kg", featured: true },
  { categorySlug: "sugar", productName: "Madhur Pure Sugar", brand: "Madhur", price: 50, originalPrice: 55, unit: "1 kg" },

  // Jaggery
  { categorySlug: "jaggery", productName: "Jaggery Block", brand: "Local", price: 60, originalPrice: 68, unit: "1 kg" },
  { categorySlug: "jaggery", productName: "Jaggery Powder", brand: "Local", price: 65, originalPrice: 72, unit: "1 kg" },

  // Edible Oil
  { categorySlug: "edible-oil", productName: "Fortune Sunflower Oil", brand: "Fortune", price: 155, originalPrice: 170, unit: "1 litre", featured: true },
  { categorySlug: "edible-oil", productName: "Saffola Gold Oil", brand: "Saffola", price: 175, originalPrice: 190, unit: "1 litre" },
  { categorySlug: "edible-oil", productName: "Groundnut Oil", brand: "Gokul", price: 210, originalPrice: 225, unit: "1 litre" },
  { categorySlug: "edible-oil", productName: "Mustard Oil", brand: "Fortune", price: 165, originalPrice: 180, unit: "1 litre" },
  { categorySlug: "edible-oil", productName: "Rice Bran Oil", brand: "Fortune", price: 185, originalPrice: 200, unit: "1 litre" },

  // Ghee
  { categorySlug: "ghee", productName: "Amul Pure Ghee", brand: "Amul", price: 585, originalPrice: 620, unit: "1 litre", featured: true },
  { categorySlug: "ghee", productName: "Nestle Everyday Ghee", brand: "Nestle", price: 570, originalPrice: 610, unit: "1 litre" },

  // Whole Spices
  { categorySlug: "whole-spices", productName: "Cumin Seeds (Jeera)", brand: "Everest", price: 90, originalPrice: 100, unit: "200 g" },
  { categorySlug: "whole-spices", productName: "Mustard Seeds", brand: "Everest", price: 45, originalPrice: 50, unit: "200 g" },
  { categorySlug: "whole-spices", productName: "Black Pepper Whole", brand: "Everest", price: 120, originalPrice: 135, unit: "100 g" },
  { categorySlug: "whole-spices", productName: "Cinnamon Sticks", brand: "Everest", price: 75, originalPrice: 85, unit: "100 g" },

  // Powdered Spices
  { categorySlug: "powdered-spices", productName: "Turmeric Powder", brand: "Everest", price: 55, originalPrice: 62, unit: "200 g", featured: true },
  { categorySlug: "powdered-spices", productName: "Red Chilli Powder", brand: "Everest", price: 65, originalPrice: 72, unit: "200 g" },
  { categorySlug: "powdered-spices", productName: "Coriander Powder", brand: "Everest", price: 50, originalPrice: 58, unit: "200 g" },
  { categorySlug: "powdered-spices", productName: "Garam Masala", brand: "MDH", price: 85, originalPrice: 95, unit: "100 g" },
  { categorySlug: "powdered-spices", productName: "Chicken Masala", brand: "MDH", price: 90, originalPrice: 100, unit: "100 g" },
  { categorySlug: "powdered-spices", productName: "Sambar Masala", brand: "MTR", price: 70, originalPrice: 78, unit: "100 g" },

  // Dry Fruits
  { categorySlug: "dry-fruits", productName: "Almonds (Badam)", brand: "Local", price: 620, originalPrice: 680, unit: "500 g", featured: true },
  { categorySlug: "dry-fruits", productName: "Cashew Nuts (Kaju)", brand: "Local", price: 720, originalPrice: 780, unit: "500 g" },
  { categorySlug: "dry-fruits", productName: "Raisins (Kishmish)", brand: "Local", price: 180, originalPrice: 200, unit: "500 g" },
  { categorySlug: "dry-fruits", productName: "Dates (Khajur)", brand: "Local", price: 150, originalPrice: 165, unit: "500 g" },

  // Nuts
  { categorySlug: "nuts", productName: "Walnuts (Akhrot)", brand: "Local", price: 780, originalPrice: 850, unit: "500 g" },
  { categorySlug: "nuts", productName: "Pistachios (Pista)", brand: "Local", price: 890, originalPrice: 950, unit: "500 g" },

  // Seeds
  { categorySlug: "seeds", productName: "Chia Seeds", brand: "Local", price: 180, originalPrice: 200, unit: "200 g" },
  { categorySlug: "seeds", productName: "Flax Seeds", brand: "Local", price: 90, originalPrice: 100, unit: "200 g" },

  // Milk
  { categorySlug: "milk", productName: "Amul Gold Milk", brand: "Amul", price: 33, originalPrice: 35, unit: "500 ml", featured: true },
  { categorySlug: "milk", productName: "Amul Taaza Toned Milk", brand: "Amul", price: 27, originalPrice: 29, unit: "500 ml" },
  { categorySlug: "milk", productName: "Heritage Standardised Milk", brand: "Heritage", price: 30, originalPrice: 32, unit: "500 ml" },

  // Curd
  { categorySlug: "curd", productName: "Amul Fresh Curd", brand: "Amul", price: 35, originalPrice: 38, unit: "400 g" },
  { categorySlug: "curd", productName: "Heritage Curd", brand: "Heritage", price: 32, originalPrice: 35, unit: "400 g" },

  // Paneer
  { categorySlug: "paneer", productName: "Amul Fresh Paneer", brand: "Amul", price: 95, originalPrice: 105, unit: "200 g", featured: true },

  // Butter
  { categorySlug: "butter", productName: "Amul Butter", brand: "Amul", price: 55, originalPrice: 58, unit: "100 g" },

  // Cheese
  { categorySlug: "cheese", productName: "Amul Cheese Slices", brand: "Amul", price: 130, originalPrice: 140, unit: "200 g" },

  // Eggs
  { categorySlug: "eggs", productName: "Farm Fresh Eggs", brand: "Local", price: 72, originalPrice: 80, unit: "1 packet (6 pcs)", featured: true },
  { categorySlug: "eggs", productName: "Farm Fresh Eggs", brand: "Local", price: 138, originalPrice: 150, unit: "1 packet (12 pcs)" },

  // Bread
  { categorySlug: "bread", productName: "Britannia Bread", brand: "Britannia", price: 45, originalPrice: 48, unit: "1 packet" },
  { categorySlug: "bread", productName: "Modern Bread", brand: "Modern", price: 42, originalPrice: 45, unit: "1 packet" },

  // Batter
  { categorySlug: "batter", productName: "Idli Batter", brand: "Local", price: 60, originalPrice: 65, unit: "1 kg" },
  { categorySlug: "batter", productName: "Dosa Batter", brand: "Local", price: 65, originalPrice: 70, unit: "1 kg" },

  // Breakfast Items
  { categorySlug: "breakfast-items", productName: "Kellogg's Corn Flakes", brand: "Kellogg's", price: 220, originalPrice: 240, unit: "475 g", featured: true },
  { categorySlug: "breakfast-items", productName: "Quaker Oats", brand: "Quaker", price: 190, originalPrice: 205, unit: "1 kg" },
  { categorySlug: "breakfast-items", productName: "MTR Rava Idli Mix", brand: "MTR", price: 85, originalPrice: 95, unit: "500 g" },

  // Chips
  { categorySlug: "chips", productName: "Lay's Classic Salted", brand: "Lay's", price: 20, originalPrice: 20, unit: "52 g", featured: true },
  { categorySlug: "chips", productName: "Kurkure Masala Munch", brand: "Kurkure", price: 20, originalPrice: 20, unit: "55 g" },
  { categorySlug: "chips", productName: "Bingo Mad Angles", brand: "Bingo", price: 20, originalPrice: 20, unit: "60 g" },

  // Namkeens
  { categorySlug: "namkeens", productName: "Haldiram's Aloo Bhujia", brand: "Haldiram's", price: 55, originalPrice: 60, unit: "200 g" },
  { categorySlug: "namkeens", productName: "Haldiram's Moong Dal", brand: "Haldiram's", price: 60, originalPrice: 65, unit: "200 g" },

  // Biscuits
  { categorySlug: "biscuits", productName: "Parle-G Biscuits", brand: "Parle", price: 10, originalPrice: 10, unit: "1 packet", featured: true },
  { categorySlug: "biscuits", productName: "Britannia Good Day", brand: "Britannia", price: 30, originalPrice: 35, unit: "1 packet" },
  { categorySlug: "biscuits", productName: "Oreo Chocolate Sandwich", brand: "Oreo", price: 30, originalPrice: 35, unit: "1 packet" },

  // Chocolates
  { categorySlug: "chocolates", productName: "Cadbury Dairy Milk", brand: "Cadbury", price: 40, originalPrice: 45, unit: "1 bar", featured: true },
  { categorySlug: "chocolates", productName: "Nestle KitKat", brand: "Nestle", price: 25, originalPrice: 30, unit: "1 bar" },

  // Sweets
  { categorySlug: "sweets", productName: "Haldiram's Soan Papdi", brand: "Haldiram's", price: 120, originalPrice: 135, unit: "500 g" },
  { categorySlug: "sweets", productName: "Kaju Katli", brand: "Local", price: 480, originalPrice: 520, unit: "500 g" },

  // Tea
  { categorySlug: "tea", productName: "Tata Tea Gold", brand: "Tata Tea", price: 140, originalPrice: 155, unit: "250 g", featured: true },
  { categorySlug: "tea", productName: "Red Label Tea", brand: "Brooke Bond", price: 130, originalPrice: 145, unit: "250 g" },
  { categorySlug: "tea", productName: "Society Tea", brand: "Society", price: 115, originalPrice: 125, unit: "250 g" },

  // Coffee
  { categorySlug: "coffee", productName: "Nescafe Classic", brand: "Nescafe", price: 220, originalPrice: 240, unit: "100 g", featured: true },
  { categorySlug: "coffee", productName: "Bru Instant Coffee", brand: "Bru", price: 195, originalPrice: 210, unit: "100 g" },

  // Soft Drinks
  { categorySlug: "soft-drinks", productName: "Coca-Cola", brand: "Coca-Cola", price: 40, originalPrice: 40, unit: "750 ml" },
  { categorySlug: "soft-drinks", productName: "Pepsi", brand: "Pepsi", price: 40, originalPrice: 40, unit: "750 ml" },
  { categorySlug: "soft-drinks", productName: "Sprite", brand: "Sprite", price: 40, originalPrice: 40, unit: "750 ml" },

  // Juices
  { categorySlug: "juices", productName: "Real Fruit Juice - Mixed Fruit", brand: "Real", price: 110, originalPrice: 120, unit: "1 litre" },
  { categorySlug: "juices", productName: "Tropicana Orange Juice", brand: "Tropicana", price: 115, originalPrice: 125, unit: "1 litre" },

  // Energy Drinks
  { categorySlug: "energy-drinks", productName: "Red Bull Energy Drink", brand: "Red Bull", price: 125, originalPrice: 125, unit: "250 ml" },

  // Instant Noodles
  { categorySlug: "instant-noodles", productName: "Maggi 2-Minute Noodles", brand: "Maggi", price: 14, originalPrice: 14, unit: "1 packet", featured: true },
  { categorySlug: "instant-noodles", productName: "Top Ramen Noodles", brand: "Top Ramen", price: 15, originalPrice: 15, unit: "1 packet" },
  { categorySlug: "instant-noodles", productName: "Vermicelli (Semiya)", brand: "Bambino", price: 55, originalPrice: 60, unit: "1 kg" },

  // Pasta
  { categorySlug: "pasta", productName: "Chings Pasta", brand: "Chings", price: 60, originalPrice: 65, unit: "200 g" },

  // Ready-to-Eat
  { categorySlug: "ready-to-eat", productName: "MTR Ready to Eat Rava Idli", brand: "MTR", price: 70, originalPrice: 78, unit: "1 packet" },
  { categorySlug: "ready-to-eat", productName: "Haldiram's Ready to Eat Dal Makhani", brand: "Haldiram's", price: 95, originalPrice: 105, unit: "1 packet" },

  // Ready-to-Cook
  { categorySlug: "ready-to-cook", productName: "MTR Dosa Mix", brand: "MTR", price: 65, originalPrice: 72, unit: "500 g" },

  // Frozen Foods
  { categorySlug: "frozen-foods", productName: "McCain Frozen French Fries", brand: "McCain", price: 130, originalPrice: 145, unit: "425 g" },
  { categorySlug: "frozen-foods", productName: "Godrej Yummiez Chicken Nuggets", brand: "Godrej Yummiez", price: 175, originalPrice: 195, unit: "425 g" },

  // Sauces
  { categorySlug: "sauces", productName: "Chings Schezwan Sauce", brand: "Chings", price: 75, originalPrice: 85, unit: "250 g" },

  // Ketchup
  { categorySlug: "ketchup", productName: "Kissan Fresh Tomato Ketchup", brand: "Kissan", price: 95, originalPrice: 105, unit: "500 g", featured: true },

  // Mayonnaise
  { categorySlug: "mayonnaise", productName: "Veeba Eggless Mayonnaise", brand: "Veeba", price: 90, originalPrice: 100, unit: "275 g" },

  // Detergents
  { categorySlug: "detergents", productName: "Surf Excel Easy Wash", brand: "Surf Excel", price: 180, originalPrice: 195, unit: "1 kg", featured: true },
  { categorySlug: "detergents", productName: "Ariel Matic Detergent", brand: "Ariel", price: 210, originalPrice: 230, unit: "1 kg" },
  { categorySlug: "detergents", productName: "Tide Plus Detergent", brand: "Tide", price: 165, originalPrice: 180, unit: "1 kg" },

  // Dishwashers
  { categorySlug: "dishwashers", productName: "Vim Dishwash Bar", brand: "Vim", price: 15, originalPrice: 15, unit: "1 piece" },
  { categorySlug: "dishwashers", productName: "Vim Dishwash Liquid Gel", brand: "Vim", price: 105, originalPrice: 115, unit: "500 ml" },

  // Surface Cleaners
  { categorySlug: "surface-cleaners", productName: "Lizol Disinfectant Surface Cleaner", brand: "Lizol", price: 195, originalPrice: 210, unit: "975 ml" },

  // Floor Cleaners
  { categorySlug: "floor-cleaners", productName: "Colin Floor Cleaner", brand: "Colin", price: 110, originalPrice: 120, unit: "1 litre" },

  // Toilet Cleaners
  { categorySlug: "toilet-cleaners", productName: "Harpic Power Plus", brand: "Harpic", price: 95, originalPrice: 105, unit: "500 ml" },

  // Mosquito Repellents
  { categorySlug: "mosquito-repellents", productName: "Good Knight Mosquito Coil", brand: "Good Knight", price: 35, originalPrice: 40, unit: "1 packet" },
  { categorySlug: "mosquito-repellents", productName: "All Out Refill", brand: "All Out", price: 80, originalPrice: 90, unit: "1 refill" },

  // Air Fresheners
  { categorySlug: "air-fresheners", productName: "Godrej Aer Room Spray", brand: "Godrej Aer", price: 170, originalPrice: 185, unit: "220 ml" },

  // Kitchen Essentials
  { categorySlug: "kitchen-essentials", productName: "Aluminium Foil", brand: "Hindalco Freshwrapp", price: 120, originalPrice: 130, unit: "1 roll" },
  { categorySlug: "kitchen-essentials", productName: "Cling Wrap", brand: "Local", price: 85, originalPrice: 95, unit: "1 roll" },

  // Household Essentials
  { categorySlug: "household-essentials", productName: "Garbage Bags", brand: "Local", price: 90, originalPrice: 100, unit: "1 packet" },

  // Soaps
  { categorySlug: "soaps", productName: "Lifebuoy Soap", brand: "Lifebuoy", price: 35, originalPrice: 38, unit: "1 piece", featured: true },
  { categorySlug: "soaps", productName: "Dove Beauty Bar", brand: "Dove", price: 65, originalPrice: 70, unit: "1 piece" },
  { categorySlug: "soaps", productName: "Pears Soap", brand: "Pears", price: 55, originalPrice: 60, unit: "1 piece" },

  // Shampoo
  { categorySlug: "shampoo", productName: "Head & Shoulders Shampoo", brand: "Head & Shoulders", price: 190, originalPrice: 210, unit: "180 ml" },
  { categorySlug: "shampoo", productName: "Dove Shampoo", brand: "Dove", price: 175, originalPrice: 195, unit: "180 ml" },

  // Conditioner
  { categorySlug: "conditioner", productName: "Sunsilk Conditioner", brand: "Sunsilk", price: 160, originalPrice: 175, unit: "175 ml" },

  // Toothpaste
  { categorySlug: "toothpaste", productName: "Colgate Strong Teeth", brand: "Colgate", price: 95, originalPrice: 105, unit: "200 g", featured: true },
  { categorySlug: "toothpaste", productName: "Pepsodent Germicheck", brand: "Pepsodent", price: 90, originalPrice: 100, unit: "200 g" },

  // Toothbrush
  { categorySlug: "toothbrush", productName: "Colgate Zig Zag Toothbrush", brand: "Colgate", price: 45, originalPrice: 50, unit: "1 piece" },

  // Body Care
  { categorySlug: "body-care", productName: "Nivea Body Lotion", brand: "Nivea", price: 210, originalPrice: 230, unit: "400 ml" },
  { categorySlug: "body-care", productName: "Vaseline Petroleum Jelly", brand: "Vaseline", price: 85, originalPrice: 95, unit: "100 ml" },

  // Grooming
  { categorySlug: "grooming", productName: "Gillette Shaving Razor", brand: "Gillette", price: 110, originalPrice: 120, unit: "1 piece" },

  // Baby Food
  { categorySlug: "baby-food", productName: "Cerelac Baby Cereal", brand: "Cerelac", price: 230, originalPrice: 250, unit: "300 g" },

  // Diapers
  { categorySlug: "diapers", productName: "Pampers Baby Diapers", brand: "Pampers", price: 560, originalPrice: 620, unit: "1 packet (M, 46 pcs)", featured: true },
  { categorySlug: "diapers", productName: "Huggies Wonder Pants", brand: "Huggies", price: 540, originalPrice: 600, unit: "1 packet (M, 42 pcs)" },

  // Baby Hygiene
  { categorySlug: "baby-hygiene", productName: "Himalaya Baby Wipes", brand: "Himalaya", price: 95, originalPrice: 105, unit: "1 packet (72 pcs)" },

  // Baby Care Products
  { categorySlug: "baby-care-products", productName: "Johnson's Baby Powder", brand: "Johnson's", price: 130, originalPrice: 145, unit: "200 g" },
  { categorySlug: "baby-care-products", productName: "Johnson's Baby Oil", brand: "Johnson's", price: 145, originalPrice: 160, unit: "200 ml" },

  // Pooja Items
  { categorySlug: "pooja-items", productName: "Camphor (Kapoor)", brand: "Local", price: 40, originalPrice: 45, unit: "50 g" },
  { categorySlug: "pooja-items", productName: "Agarbatti (Incense Sticks)", brand: "Cycle", price: 45, originalPrice: 50, unit: "1 packet" },

  // Stationery
  { categorySlug: "stationery", productName: "Notebook (200 pages)", brand: "Classmate", price: 55, originalPrice: 60, unit: "1 piece" },
  { categorySlug: "stationery", productName: "Ball Point Pens (Pack of 5)", brand: "Cello", price: 40, originalPrice: 45, unit: "1 packet" },

  // Party Supplies
  { categorySlug: "party-supplies", productName: "Paper Plates (Pack of 25)", brand: "Local", price: 90, originalPrice: 100, unit: "1 packet" },
  { categorySlug: "party-supplies", productName: "Birthday Balloons (Pack of 30)", brand: "Local", price: 70, originalPrice: 80, unit: "1 packet" },

  // Fresh Fruits
  { categorySlug: "fresh-fruits", productName: "Banana", brand: "Local", price: 45, originalPrice: 50, unit: "1 kg", featured: true },
  { categorySlug: "fresh-fruits", productName: "Apple (Shimla)", brand: "Local", price: 180, originalPrice: 200, unit: "1 kg" },
  { categorySlug: "fresh-fruits", productName: "Papaya", brand: "Local", price: 40, originalPrice: 45, unit: "1 kg" },
  { categorySlug: "fresh-fruits", productName: "Watermelon", brand: "Local", price: 30, originalPrice: 35, unit: "1 kg" },
  { categorySlug: "fresh-fruits", productName: "Pomegranate", brand: "Local", price: 160, originalPrice: 180, unit: "1 kg" },

  // Fresh Vegetables
  { categorySlug: "fresh-vegetables", productName: "Onion", brand: "Local", price: 35, originalPrice: 40, unit: "1 kg", featured: true },
  { categorySlug: "fresh-vegetables", productName: "Tomato", brand: "Local", price: 40, originalPrice: 45, unit: "1 kg" },
  { categorySlug: "fresh-vegetables", productName: "Potato", brand: "Local", price: 30, originalPrice: 35, unit: "1 kg" },
  { categorySlug: "fresh-vegetables", productName: "Cauliflower", brand: "Local", price: 35, originalPrice: 40, unit: "1 piece" },
  { categorySlug: "fresh-vegetables", productName: "Brinjal (Eggplant)", brand: "Local", price: 40, originalPrice: 45, unit: "1 kg" },
  { categorySlug: "fresh-vegetables", productName: "Carrot", brand: "Local", price: 45, originalPrice: 50, unit: "1 kg" },

  // Leafy Vegetables
  { categorySlug: "leafy-vegetables", productName: "Spinach (Palak)", brand: "Local", price: 25, originalPrice: 30, unit: "1 bunch" },
  { categorySlug: "leafy-vegetables", productName: "Coriander Leaves", brand: "Local", price: 10, originalPrice: 12, unit: "1 bunch" },
  { categorySlug: "leafy-vegetables", productName: "Curry Leaves", brand: "Local", price: 8, originalPrice: 10, unit: "1 bunch" },
  { categorySlug: "leafy-vegetables", productName: "Fenugreek Leaves (Methi)", brand: "Local", price: 20, originalPrice: 25, unit: "1 bunch" },

  // Exotic Fruits
  { categorySlug: "exotic-fruits", productName: "Kiwi", brand: "Local", price: 25, originalPrice: 30, unit: "1 piece" },
  { categorySlug: "exotic-fruits", productName: "Dragon Fruit", brand: "Local", price: 120, originalPrice: 140, unit: "1 piece" },
  { categorySlug: "exotic-fruits", productName: "Avocado", brand: "Local", price: 90, originalPrice: 100, unit: "1 piece" },

  // Exotic Vegetables
  { categorySlug: "exotic-vegetables", productName: "Broccoli", brand: "Local", price: 90, originalPrice: 100, unit: "1 piece" },
  { categorySlug: "exotic-vegetables", productName: "Zucchini", brand: "Local", price: 80, originalPrice: 90, unit: "1 kg" },
  { categorySlug: "exotic-vegetables", productName: "Bell Pepper (Capsicum)", brand: "Local", price: 70, originalPrice: 80, unit: "500 g" },
];
