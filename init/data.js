const sampleListings = [

{
title: "Single PG near DY Patil College",
description: "Clean single room PG for students with WiFi.",
price: 6500,
location: { address: "DY Patil Road", city: "Pune", area: "Akurdi" },
images: [{ url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85", filename: "room1"}],
amenities: ["WiFi","Laundry","Parking"],
rating: 4.2,
available: true
},

{
title: "Budget Student PG near Akurdi Station",
description: "Affordable PG walking distance from railway station.",
price: 4800,
location: { address: "Railway Station Road", city: "Pune", area: "Akurdi" },
images: [{ url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2", filename: "room2"}],
amenities: ["WiFi","Food"],
rating: 4.0,
available: true
},

{
title: "Double Sharing PG for Students",
description: "Spacious room with balcony and study tables.",
price: 5200,
location: { address: "Sector 27", city: "Pune", area: "Akurdi" },
images: [{ url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267", filename: "room3"}],
amenities: ["WiFi","Balcony","Parking"],
rating: 4.3,
available: true
},

{
title: "Premium AC PG near PCCOE",
description: "Modern PG with AC and food service.",
price: 9000,
location: { address: "PCCOE Road", city: "Pune", area: "Akurdi" },
images: [{ url: "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8", filename: "room4"}],
amenities: ["WiFi","AC","Food","Laundry"],
rating: 4.6,
available: true
},

{
title: "Budget PG for Boys",
description: "Simple PG with shared kitchen.",
price: 4200,
location: { address: "Old Mumbai Pune Highway", city: "Pune", area: "Akurdi" },
images: [{ url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb", filename: "room5"}],
amenities: ["WiFi","Food"],
rating: 3.9,
available: true
},

{
title: "Girls PG near DY Patil University",
description: "Secure girls PG with CCTV and meals.",
price: 7000,
location: { address: "University Road", city: "Pune", area: "Akurdi" },
images: [{ url: "https://images.unsplash.com/photo-1502672023488-70e25813eb80", filename: "room6"}],
amenities: ["WiFi","Food","Security"],
rating: 4.4,
available: true
},

{
title: "Modern PG with Attached Bathroom",
description: "Private bathroom and spacious room.",
price: 7800,
location: { address: "Sector 25", city: "Pune", area: "Akurdi" },
images: [{ url: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae", filename: "room7"}],
amenities: ["WiFi","Laundry","Parking"],
rating: 4.5,
available: true
},

{
title: "Triple Sharing PG for Students",
description: "Affordable option for college students.",
price: 3800,
location: { address: "Station Area", city: "Pune", area: "Akurdi" },
images: [{ url: "https://images.unsplash.com/photo-1484154218962-a197022b5858", filename: "room8"}],
amenities: ["WiFi","Food"],
rating: 3.8,
available: true
},

{
title: "Luxury PG near Pimpri",
description: "Premium PG with gym and AC rooms.",
price: 12000,
location: { address: "Pimpri Main Road", city: "Pune", area: "Akurdi" },
images: [{ url: "https://images.unsplash.com/photo-1493666438817-866a91353ca9", filename: "room9"}],
amenities: ["WiFi","Gym","AC","Food"],
rating: 4.8,
available: true
},

{
title: "Affordable Room near Highway",
description: "Budget friendly PG with good connectivity.",
price: 4500,
location: { address: "Mumbai Pune Highway", city: "Pune", area: "Akurdi" },
images: [{ url: "https://images.unsplash.com/photo-1486304873000-235643847519", filename: "room10"}],
amenities: ["WiFi","Parking"],
rating: 3.9,
available: true
},

{
title: "Student Friendly PG near MIT Academy",
description: "Study friendly environment.",
price: 6000,
location: { address: "MIT Road", city: "Pune", area: "Akurdi" },
images: [{ url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688", filename: "room11"}],
amenities: ["WiFi","Laundry"],
rating: 4.2,
available: true
},

{
title: "Compact Studio PG",
description: "Small but modern room for working professionals.",
price: 7500,
location: { address: "Akurdi Market", city: "Pune", area: "Akurdi" },
images: [{ url: "https://images.unsplash.com/photo-1523217582562-09d0def993a6", filename: "room12"}],
amenities: ["WiFi","AC"],
rating: 4.1,
available: true
},

{
title: "Girls Hostel near Station",
description: "Safe girls PG with biometric entry.",
price: 6800,
location: { address: "Station Road", city: "Pune", area: "Akurdi" },
images: [{ url: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae", filename: "room13"}],
amenities: ["WiFi","Food","Security"],
rating: 4.3,
available: true
},

{
title: "Cozy PG for Professionals",
description: "Quiet place ideal for IT employees.",
price: 8200,
location: { address: "Nigdi Road", city: "Pune", area: "Akurdi" },
images: [{ url: "https://images.unsplash.com/photo-1521783593447-5702b9bfd267", filename: "room14"}],
amenities: ["WiFi","Parking","Laundry"],
rating: 4.4,
available: true
},

{
title: "Simple Budget PG",
description: "Basic PG with shared bathroom.",
price: 3500,
location: { address: "Sector 28", city: "Pune", area: "Akurdi" },
images: [{ url: "https://images.unsplash.com/photo-1484154218962-a197022b5858", filename: "room15"}],
amenities: ["WiFi"],
rating: 3.6,
available: true
},

{
title: "AC Deluxe PG Room",
description: "Air conditioned PG with modern furniture.",
price: 10000,
location: { address: "Akurdi Main Road", city: "Pune", area: "Akurdi" },
images: [{ url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85", filename: "room16"}],
amenities: ["WiFi","AC","Food"],
rating: 4.7,
available: true
},

{
title: "Student PG with Study Room",
description: "Separate study area for students.",
price: 6200,
location: { address: "DY Patil Area", city: "Pune", area: "Akurdi" },
images: [{ url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688", filename: "room17"}],
amenities: ["WiFi","StudyRoom"],
rating: 4.1,
available: true
},

{
title: "PG with Daily Cleaning",
description: "Clean rooms with housekeeping service.",
price: 7200,
location: { address: "Pimpri Chinchwad Road", city: "Pune", area: "Akurdi" },
images: [{ url: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae", filename: "room18"}],
amenities: ["WiFi","Cleaning"],
rating: 4.2,
available: true
},

{
title: "Affordable Triple Sharing PG",
description: "Budget option for students.",
price: 3900,
location: { address: "Sector 26", city: "Pune", area: "Akurdi" },
images: [{ url: "https://images.unsplash.com/photo-1484154218962-a197022b5858", filename: "room19"}],
amenities: ["WiFi"],
rating: 3.7,
available: true
},

{
title: "Premium PG with Parking",
description: "Comfortable stay with parking facility.",
price: 8500,
location: { address: "Nigdi Pradhikaran", city: "Pune", area: "Akurdi" },
images: [{ url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb", filename: "room20"}],
amenities: ["WiFi","Parking","Laundry"],
rating: 4.5,
available: true
},

{
title: "Family Style PG",
description: "Homely environment with food.",
price: 7600,
location: { address: "Akurdi Village Road", city: "Pune", area: "Akurdi" },
images: [{ url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267", filename: "room21"}],
amenities: ["Food","WiFi"],
rating: 4.3,
available: true
},

{
title: "Compact Budget Room",
description: "Very affordable room for students.",
price: 3200,
location: { address: "Near Bus Stand", city: "Pune", area: "Akurdi" },
images: [{ url: "https://images.unsplash.com/photo-1484154218962-a197022b5858", filename: "room22"}],
amenities: ["WiFi"],
rating: 3.5,
available: true
},

{
title: "Modern PG with Balcony",
description: "Balcony view and good ventilation.",
price: 6900,
location: { address: "Sector 24", city: "Pune", area: "Akurdi" },
images: [{ url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85", filename: "room23"}],
amenities: ["WiFi","Balcony"],
rating: 4.2,
available: true
},

{
title: "Executive PG Room",
description: "High quality furniture and quiet area.",
price: 9500,
location: { address: "Pimpri Market Road", city: "Pune", area: "Akurdi" },
images: [{ url: "https://images.unsplash.com/photo-1493666438817-866a91353ca9", filename: "room24"}],
amenities: ["WiFi","AC","Parking"],
rating: 4.6,
available: true
},

{
title: "Student Budget Hostel",
description: "Affordable hostel style PG.",
price: 3000,
location: { address: "Sector 23", city: "Pune", area: "Akurdi" },
images: [{ url: "https://images.unsplash.com/photo-1484154218962-a197022b5858", filename: "room25"}],
amenities: ["WiFi"],
rating: 3.4,
available: true
}

];

module.exports = { sampleListings };
