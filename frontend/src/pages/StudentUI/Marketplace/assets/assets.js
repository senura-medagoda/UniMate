// ================= Imports =================

// --- Icons & UI ---
import uni from './uni.png'
import contactussv from './contact-us-animate.svg'
import AB from './about-us-page-animate.svg'
import aboutUS from './Aboutuspage-bro.png'
import unilogo from './unimatelogo.png'
import unilogo1 from './unimatelogo1.png'
import logo from './UniMate.png'
import bin_icon from './bin_icon.png'
import cart_icon from './cart_icon.png'
import cross_icon from './cross_icon.png'
import dropdown_icon from './dropdown_icon.png'
import exchange_icon from './exchange_icon.png'
import profile_icon from './profile_icon.png'
import quality_icon from './quality_icon.png'
import search_icon from './search_icon.png'
import star_dull_icon from './star_dull_icon.png'
import star_icon from './star_icon.png'
import support_img from './support_img.png'
import menu_icon from './menu_icon.png'
import razorpay_logo from './razorpay_logo.png'
import stripe_logo from './stripe_logo.png'
import contact_img from './contact_img.png'
import homepage from './homepage.png'

// --- Laptops ---
import laptop from './laptop.png'
import laptop_2 from './laptop_2.png'
import laptop_3 from './laptop_3.png'
import laptop_4 from './laptop_4.png'
import laptop_5 from './laptop_5.png'
import laptop1 from './laptop1.png'
import laptop1_2 from './laptop1_2.png'
import laptop1_3 from './laptop1_3.png'
import laptop1_4 from './laptop1_4.png'

// --- Mouse ---
import mouse from './mouse.png'
import mouse_1 from './mouse_1.png'
import mouse_2 from './mouse_2.png'
import mouse1 from './mouse1.png'
import mouse1_1 from './mouse1_1.png'
import mouse1_2 from './mouse1_2.png'
import mouse1_3 from './mouse1_3.png'

// --- Printers / Projectors ---
import miniPrinter from './miniPrinter.png'
import miniPrinter_1 from './miniPrinter_1.png'
import miniprinter2 from './miniprinter2.png'
import miniprojector from './miniprojector.png'

// --- USB Drives ---
import usb from './usb.png'
import usb_1 from './usb_1.png'
import usb_3 from './usb_3.png'
import usb_4 from './usb_4.png'
import Ugreen_usb from './Ugreen_usb.png'
import Ugreen_usb_2 from './Ugreen_usb_2.png'
import Ugreen_usb_3 from './Ugreen_usb_3.png'
import Ugreen_usb_4 from './Ugreen_usb_4.png'

// --- Clothes ---
import p_img2_1 from './p_img2_1.png'
// ❌ removed p_img2_2 (not found in folder)
import p_img2_3 from './p_img2_3.png'
import p_img2_4 from './p_img2_4.png'
import p_img4 from './p_img4.png'
import p_img5 from './p_img5.png'
import p_img43 from './p_img43.png'

// ================= Assets Export =================
export const assets = {
  bin_icon,
  cart_icon,
  cross_icon,
  dropdown_icon,
  exchange_icon,
  profile_icon,
  quality_icon,
  search_icon,
  star_dull_icon,
  star_icon,
  support_img,
  menu_icon,
  razorpay_logo,
  stripe_logo,
  contact_img,
  homepage,
  logo,
  unilogo,
  unilogo1,
  aboutUS,
  AB,
  contactussv,
  uni
}

// ================= Products Export =================
export const products = [
  // --- Laptops ---
  {
    _id: "p001",
    name: "Dell Laptop",
    description: "High performance laptop for work and study.",
    price: 55000,
    image: [laptop, laptop_2, laptop_3, laptop_4, laptop_5],
    category: "Electronics",
    subCategory: "Laptop",
    sizes: ["Regular"],
    date: 1716700000000,
    bestseller: true
  },
  {
    _id: "p002",
    name: "HP Laptop",
    description: "Durable laptop with reliable performance.",
    price: 52000,
    image: [laptop1, laptop1_2, laptop1_3, laptop1_4],
    category: "Electronics",
    subCategory: "Laptop",
    sizes: ["Regular"],
    date: 1716705000000,
    bestseller: false
  },

  // --- Mouse ---
  {
    _id: "p003",
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with smooth DPI control.",
    price: 1200,
    image: [mouse, mouse_1, mouse_2],
    category: "Electronics",
    subCategory: "Accessories",
    sizes: ["Regular"],
    date: 1716710000000,
    bestseller: true
  },
  {
    _id: "p004",
    name: "Wireless Mouse Pro",
    description: "Advanced wireless mouse with long battery life and precision tracking.",
    price: 1800,
    image: [mouse1, mouse1_1, mouse1_2, mouse1_3],
    category: "Electronics",
    subCategory: "Accessories",
    sizes: ["Regular"],
    date: 1716715000000,
    bestseller: false
  },

  // --- Printers / Projectors ---
  {
    _id: "p005",
    name: "Mini Projector",
    description: "Compact portable projector for movies and presentations.",
    price: 4500,
    image: [miniprojector],
    category: "Electronics",
    subCategory: "Projector",
    sizes: ["Regular"],
    date: 1716720000000,
    bestseller: false
  },
  {
    _id: "p006",
    name: "Mini Thermal Printer",
    description: "Pocket-sized thermal printer, easy to use with mobile.",
    price: 2500,
    image: [miniPrinter, miniPrinter_1, miniprinter2],
    category: "Electronics",
    subCategory: "Printer",
    sizes: ["Regular"],
    date: 1716730000000,
    bestseller: false
  },

  // --- USB Drives ---
  {
    _id: "p007",
    name: "High Speed USB",
    description: "High speed storage USB drive.",
    price: 2000,
    image: [usb, usb_1, usb_3, usb_4],
    category: "Electronics",
    subCategory: "Storage",
    sizes: ["Regular"],
    date: 1716740000000,
    bestseller: false
  },
  {
    _id: "p008",
    name: "Ugreen USB Hub",
    description: "Multiport Ugreen USB hub for laptops and PCs.",
    price: 3200,
    image: [Ugreen_usb, Ugreen_usb_2, Ugreen_usb_3, Ugreen_usb_4],
    category: "Electronics",
    subCategory: "Storage",
    sizes: ['32GB','64GB'],
    date: 1716745000000,
    bestseller: true
  },

  // --- Clothes ---
  {
    _id: "p009",
    name: "Men Casual T-Shirt",
    description: "Soft cotton T-shirt, regular fit, available in multiple colors.",
    price: 800,
    image: [p_img2_1, p_img2_3, p_img2_4],
    category: "Clothing",
    subCategory: "Topwear",
    sizes: ["M", "L", "XL"],
    date: 1716750000000,
    bestseller: true
  },
  {
    _id: "p010",
    name: "Women Casual Top",
    description: "Round neck top, stylish and comfortable.",
    price: 900,
    image: [p_img4, p_img5],
    category: "Clothing",
    subCategory: "Topwear",
    sizes: ["S", "M", "L"],
    date: 1716760000000,
    bestseller: false
  },
  {
    _id: "p011",
    name: "Kid Denim Jeans",
    description: "Slim fit jeans for kids, durable and comfortable.",
    price: 1100,
    image: [p_img43],
    category: "Clothing",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL"],
    date: 1716770000000,
    bestseller: false
  }
]
