export const BUSINESS = {
  name: "Global Fruits Edinburgh Ltd",
  shortName: "Global Fruits",
  signName: "Global Fruits Tollcross Edin Ltd",
  category: "Greengrocer",
  tagline: "Fruit · Vegetables · Exotic spices · Home deliveries",
  description:
    "Independent greengrocer in Tollcross, Edinburgh — fresh fruit, vegetables, exotic spices, and home deliveries.",
  rating: 4.5,
  reviewCount: 72,
  reviewSource: "Google reviews",
  addressLine: "5 Gillespie Pl",
  city: "Edinburgh",
  postcode: "EH10 4HS",
  address: "5 Gillespie Pl, Edinburgh EH10 4HS",
  phoneDisplay: "0131 228 4429",
  phoneTel: "+441312284429",
  hoursNote: "Opens 8am",
  hoursDetail: "Open daily from 8am",
  orderUrl: "https://deliveroo.co.uk",
  orderLabel: "Order on Deliveroo",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Global+Fruits+Edinburgh+Ltd+5+Gillespie+Pl+Edinburgh+EH10+4HS",
  instagramHandle: "@globalfruitsedinburgh",
  instagramUrl: "https://instagram.com",
} as const;

export const BUSINESS_REVIEWS = [
  {
    title: "Great prices, friendly staff",
    quote: "Loads of produce, great prices, friendly staff.",
    name: "Scarlett Butler",
    source: "Google",
    rating: 5,
  },
  {
    title: "Really good selection",
    quote: "Really good selection of fresh fruit and veg",
    name: "Arran Dinsmore",
    source: "Google",
    rating: 5,
  },
  {
    title: "Gorgeous, juicy greengages",
    quote:
      "Ps , the only place I've ever found gorgeous , juicy Greegages 😊",
    name: "Ian Robertson",
    source: "Google",
    rating: 5,
  },
  {
    title: "5/5 on Facebook",
    quote: "Reviews from the web — 5/5 on Facebook · 3 votes.",
    name: "Facebook",
    source: "Facebook",
    rating: 5,
  },
] as const;

export function shopCta(label = "Shop produce") {
  return label;
}
