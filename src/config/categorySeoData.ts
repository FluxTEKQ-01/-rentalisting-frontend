import { PropertyCategory } from '../types';

export interface CategorySeoInfo {
  slug: string;
  categoryValue: PropertyCategory;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  heroBadge: string;
  h1Title: string;
  heroSubtitle: string;
  heroImages: string[];
  overviewHeading: string;
  overviewDescription: string;
  highlights: { title: string; desc: string; icon: string }[];
  faqs: { question: string; answer: string }[];
  relatedCategorySlugs: string[];
}

export const CATEGORY_SEO_DATA: Record<string, CategorySeoInfo> = {
  'apartments': {
    slug: 'apartments',
    categoryValue: 'house_apartment',
    title: 'Apartments & Flats for Rent',
    metaTitle: 'Apartments & Flats for Rent | Studio, 1BHK, 2BHK & 3BHK Rental Homes',
    metaDescription: 'Browse verified apartments and flats for rent. Explore 1BHK, 2BHK, 3BHK studio apartments & gated community homes with top amenities, verified photos, and direct owner listings.',
    keywords: ['apartments for rent', 'flats for rent', 'gated community apartments', '2BHK for rent', '1BHK flat lease', 'studio apartment rent'],
    heroBadge: 'Verified Residential Homes',
    h1Title: 'Apartments & Flats for Rent',
    heroSubtitle: 'Discover premium studio apartments, modern high-rise flats, and family-friendly gated community homes verified for quality & comfort.',
    heroImages: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80',
    ],
    overviewHeading: 'Why Rent an Apartment via BookMySpace?',
    overviewDescription: 'Apartments offer security, modern amenities, maintenance support, and prime city locations. Our verified apartment listings provide direct contact with property owners with zero hidden brokerage fees.',
    highlights: [
      { title: 'Gated Security & CCTV', desc: 'Round-the-clock security, visitor tracking, and access control.', icon: 'security' },
      { title: 'Modern Amenities', desc: 'Access to gyms, swimming pools, clubhouses, and designated parking.', icon: 'amenities' },
      { title: 'Prime Urban Locations', desc: 'Located close to tech parks, top schools, transit hubs, and hospitals.', icon: 'location' },
    ],
    faqs: [
      {
        question: 'What documents are required to rent an apartment?',
        answer: 'Typically, you need government-issued identity proof (Aadhaar, Passport, PAN), proof of income (salary slips or employment letter), and passport-size photographs.'
      },
      {
        question: 'Are security deposits negotiable for flats?',
        answer: 'Yes, security deposit terms are agreed upon directly between tenant and owner. Standard deposits range between 1 to 6 months of rent.'
      },
      {
        question: 'Can I find furnished or semi-furnished apartments?',
        answer: 'Absolutely! Our property search filters let you easily filter by fully furnished, semi-furnished, or unfurnished apartments.'
      }
    ],
    relatedCategorySlugs: ['independent-villas', 'farm-land-plots', 'co-working-spaces']
  },

  'independent-villas': {
    slug: 'independent-villas',
    categoryValue: 'villa',
    title: 'Independent Houses & Villas for Rent',
    metaTitle: 'Independent Houses & Luxury Villas for Rent | Private Homes & Bungalows',
    metaDescription: 'Find luxury independent villas and houses for rent. Enjoy private gardens, spacious multi-story layouts, private parking, and peaceful residential neighborhoods.',
    keywords: ['independent house for rent', 'villa for rent', 'luxury bungalow lease', 'independent duplex house', 'private villa rental'],
    heroBadge: 'Exclusive Private Living',
    h1Title: 'Independent Houses & Luxury Villas for Rent',
    heroSubtitle: 'Step into private living with spacious independent houses, luxury duplex villas, and peaceful bungalows featuring private gardens and multi-car parking.',
    heroImages: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=80',
    ],
    overviewHeading: 'Experience Freedom & Privacy in Independent Villas',
    overviewDescription: 'Independent houses and villas give you full autonomy over your living space without shared walls or HOA maintenance restrictions. Ideal for families and executives seeking privacy and grandeur.',
    highlights: [
      { title: 'Private Courtyard & Garden', desc: 'Enjoy your personal lawn, terrace garden, and outdoor leisure space.', icon: 'tree' },
      { title: 'No Shared Walls', desc: 'Maximum privacy and sound isolation for ultimate comfort.', icon: 'house' },
      { title: 'Dedicated Multi-Car Parking', desc: 'Private driveways and covered garages for secure vehicle storage.', icon: 'car' },
    ],
    faqs: [
      {
        question: 'Who handles maintenance for independent houses?',
        answer: 'Structural repairs are managed by the owner, while day-to-day utility maintenance is handled by the tenant as specified in the lease contract.'
      },
      {
        question: 'Are independent villas suitable for pet owners?',
        answer: 'Yes! Independent houses with private yards are ideal for pets. You can confirm pet friendliness directly with the owner on the listing details page.'
      }
    ],
    relatedCategorySlugs: ['apartments', 'farm-land-plots', 'commercial-buildings']
  },

  'farm-land-plots': {
    slug: 'farm-land-plots',
    categoryValue: 'open_plot_land',
    title: 'Farm Land & Open Plots for Lease & Rent',
    metaTitle: 'Farm Land & Open Plots for Rent / Lease | Agricultural & Open Land',
    metaDescription: 'Rent or lease open plots, agricultural farm land, commercial land, and event grounds. Verified parcel boundaries with water and road connectivity.',
    keywords: ['farm land for lease', 'open plot for rent', 'agricultural land lease', 'commercial land plot', 'event plot rent'],
    heroBadge: 'Land & Agro Leases',
    h1Title: 'Farm Land & Open Plots for Lease & Rent',
    heroSubtitle: 'Explore verified open land parcels, organic agricultural farm plots, and commercial open spaces ideal for farming, warehousing, or outdoor operations.',
    heroImages: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1920&q=80',
    ],
    overviewHeading: 'Versatile Land Parcels for Agriculture & Commercial Use',
    overviewDescription: 'Whether you need fertile soil for organic agriculture, open space for industrial storage, or land for solar installations, browse verified plot listings directly.',
    highlights: [
      { title: 'Verified Survey Boundaries', desc: 'Clear land demarcation, title verification, and road access points.', icon: 'map' },
      { title: 'Water & Electricity Access', desc: 'Listings detail borewell depth, electrical load capacity, and soil type.', icon: 'power' },
      { title: 'Flexible Lease Terms', desc: 'Short-term seasonal farming leases or long-term commercial plot agreements.', icon: 'calendar' },
    ],
    faqs: [
      {
        question: 'Can I lease agricultural land for long-term farming?',
        answer: 'Yes, land owners offer flexible short-term and multi-year agricultural leases depending on crop cycles and project requirements.'
      },
      {
        question: 'How are boundary checks conducted?',
        answer: 'Listings include geolocation coordinates and survey map boundaries. Prospective tenants can arrange on-site inspections directly.'
      }
    ],
    relatedCategorySlugs: ['warehouses', 'industrial-spaces', 'independent-villas']
  },

  'office-spaces': {
    slug: 'office-spaces',
    categoryValue: 'office',
    title: 'Commercial Office Spaces for Rent',
    metaTitle: 'Commercial Office Spaces for Rent | IT Parks & Business Hubs',
    metaDescription: 'Rent corporate office spaces, furnished IT offices, and commercial workspaces. Prime business locations with high-speed internet, power backup & parking.',
    keywords: ['office space for rent', 'commercial office lease', 'IT park workspace', 'furnished office for rent'],
    heroBadge: 'Business Workspaces',
    h1Title: 'Commercial Office Spaces for Rent',
    heroSubtitle: 'Elevate your business in premium corporate towers, tech park offices, and plug-and-play commercial suites.',
    heroImages: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80',
    ],
    overviewHeading: 'Modern Workspaces Designed for Productivity',
    overviewDescription: 'Scale your team with fully-equipped office suites featuring conference rooms, high-speed fiber internet, fiber redundancy, and 24/7 power backup.',
    highlights: [
      { title: 'High-Speed Infrastructure', desc: 'Pre-wired fiber internet and backup power generation.', icon: 'wifi' },
      { title: 'Prime Commercial Hubs', desc: 'Located near key metro lines, airports, and commercial centers.', icon: 'building' },
      { title: 'Flexible Workstation Layouts', desc: 'Customizable cabin layouts, open desk spaces, and boardrooms.', icon: 'layout' },
    ],
    faqs: [
      {
        question: 'Are maintenance and utility costs included in office rent?',
        answer: 'Commercial leases outline whether maintenance fees (CAM) are bundled in the base rent or billed separately.'
      }
    ],
    relatedCategorySlugs: ['co-working-spaces', 'shops-retail', 'commercial-buildings']
  },

  'shops-retail': {
    slug: 'shops-retail',
    categoryValue: 'shop_retail',
    title: 'Retail Shops & Commercial Showrooms for Rent',
    metaTitle: 'Retail Shops & Commercial Showrooms for Rent | High Footfall Outlets',
    metaDescription: 'Find prime retail shops, high-street store spaces, and commercial showrooms for rent. Maximize brand visibility in high footfall shopping districts.',
    keywords: ['shop for rent', 'retail space lease', 'showroom for rent', 'commercial store space'],
    heroBadge: 'Retail & Storefronts',
    h1Title: 'Retail Shops & Commercial Spaces for Rent',
    heroSubtitle: 'Position your store in high footfall commercial markets, shopping malls, and main street retail hubs.',
    heroImages: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1920&q=80',
    ],
    overviewHeading: 'Prime Commercial Retail Locations',
    overviewDescription: 'Drive customer traffic with roadside retail spaces featuring wide glass fronts, loading access, and prominent brand signage options.',
    highlights: [
      { title: 'High Footfall Traffic', desc: 'Located in bustling commercial arteries and shopping avenues.', icon: 'shopping_bag' },
      { title: 'Wide Frontage Display', desc: 'Clear glass facades for maximum product visibility.', icon: 'eye' },
      { title: 'Prime High-Street Branding', desc: 'Prominent exterior signage rights to capture consumer attention.', icon: 'megaphone' },
    ],
    faqs: [
      {
        question: 'Can I alter the interior layout for branding?',
        answer: 'Yes, retail tenants are permitted interior fit-outs as specified in the commercial lease contract.'
      }
    ],
    relatedCategorySlugs: ['showrooms', 'office-spaces', 'commercial-buildings']
  },

  'warehouses': {
    slug: 'warehouses',
    categoryValue: 'warehouse',
    title: 'Industrial Warehouses & Godowns for Lease',
    metaTitle: 'Industrial Warehouses & Godowns for Rent / Lease | Storage & Logistics',
    metaDescription: 'Lease industrial warehouses, godowns, and cold storage facilities. High ceiling clearances, heavy vehicle loading docks, and prime highway connectivity.',
    keywords: ['warehouse for lease', 'godown for rent', 'industrial storage space', 'logistics park lease'],
    heroBadge: 'Logistics & Storage',
    h1Title: 'Industrial Warehouses & Storage Facilities',
    heroSubtitle: 'Streamline supply chain operations with heavy-duty logistics warehouses, distribution hubs, and storage godowns.',
    heroImages: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=1920&q=80',
    ],
    overviewHeading: 'High-Capacity Storage & Logistics Infrastructure',
    overviewDescription: 'Find logistics parks equipped with dock levelers, fire sprinkler systems, wide container access roads, and 24/7 security perimeter guards.',
    highlights: [
      { title: 'Heavy Vehicle Loading Docks', desc: 'Multiple container bays and dock leveler access.', icon: 'truck' },
      { title: 'High Clear Height', desc: 'Clear vertical stacking height up to 32ft for optimized pallet storage.', icon: 'height' },
      { title: 'Highway & Transit Connectivity', desc: 'Seamless arterial road access for freight trucks and cargo trailers.', icon: 'map' },
    ],
    faqs: [
      {
        question: 'Are fire safety approvals and NOCs available?',
        answer: 'All listed commercial warehouses include verified fire safety compliances and structural safety NOC details.'
      }
    ],
    relatedCategorySlugs: ['industrial-spaces', 'farm-land-plots', 'storage-spaces']
  },

  'co-working-spaces': {
    slug: 'co-working-spaces',
    categoryValue: 'coworking',
    title: 'Shared Co-working Spaces & Desks for Rent',
    metaTitle: 'Co-working Spaces & Shared Workstations for Rent | Flexible Cabins',
    metaDescription: 'Book flexible co-working spaces, dedicated desks, hot desks, and private startup cabins. Community events, high-speed WiFi & high-end amenities included.',
    keywords: ['coworking space rent', 'shared office desk', 'private cabin rent', 'flexible office space'],
    heroBadge: 'Flexible Workspaces',
    h1Title: 'Co-working Spaces & Flexible Desks',
    heroSubtitle: 'Join thriving founder communities with flexible hot desks, dedicated seats, and private team cabins with zero setup capital required.',
    heroImages: [
      'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1920&q=80',
    ],
    overviewHeading: 'Plug-and-Play Workspace Solutions',
    overviewDescription: 'Scale your company seamlessly with all-inclusive pricing covering unlimited coffee, high-speed internet, meeting room credits, and printing services.',
    highlights: [
      { title: 'Zero Setup Cost', desc: 'Start working immediately without heavy capital expenditure.', icon: 'dollar' },
      { title: 'Meeting Rooms & Cafe', desc: 'Access to modern boardrooms, phone booths, and lounge cafes.', icon: 'coffee' },
      { title: 'High-Speed Fiber WiFi', desc: 'Dedicated gigabit bandwidth with redundant failover connections.', icon: 'wifi' },
    ],
    faqs: [
      {
        question: 'Can I rent a single desk in a co-working space?',
        answer: 'Yes! Co-working listings offer flexible plans ranging from daily passes and hot desks to dedicated team bays.'
      }
    ],
    relatedCategorySlugs: ['office-spaces', 'commercial-buildings', 'apartments']
  },

  'commercial-buildings': {
    slug: 'commercial-buildings',
    categoryValue: 'commercial_building',
    title: 'Standalone Commercial Buildings for Lease',
    metaTitle: 'Commercial Buildings & Independent Towers for Rent | Entire Multi-Floor Spaces',
    metaDescription: 'Lease multi-floor commercial buildings and corporate headquarters. Ideal for corporate campuses, medical centers, and institutional headquarters.',
    keywords: ['commercial building for rent', 'standalone commercial property', 'entire building lease', 'corporate building lease'],
    heroBadge: 'Corporate Headquarters',
    h1Title: 'Standalone Commercial Buildings for Rent',
    heroSubtitle: 'Establish your brand headquarters in independent multi-floor commercial complexes featuring dedicated elevators and branding rights.',
    heroImages: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80',
    ],
    overviewHeading: 'Full-Building Independence for Enterprises',
    overviewDescription: 'Multi-story corporate towers providing total operational control, facade branding opportunities, basement parking, and high-capacity elevators.',
    highlights: [
      { title: 'Facade Naming Rights', desc: 'Prominent building exterior signage for corporate visibility.', icon: 'building' },
      { title: 'Multi-Level Basement Parking', desc: 'Ample parking capacity for staff and executive vehicles.', icon: 'car' },
      { title: 'Dedicated High-Speed Elevators', desc: 'Multiple passenger and service elevators for vertical transit.', icon: 'elevator' },
    ],
    faqs: [
      {
        question: 'Can a commercial building be leased floor-by-floor?',
        answer: 'Many building owners offer options to lease either individual entire floors or the entire standalone structure.'
      }
    ],
    relatedCategorySlugs: ['office-spaces', 'shops-retail', 'showrooms']
  },

  'showrooms': {
    slug: 'showrooms',
    categoryValue: 'showroom',
    title: 'Commercial Showrooms for Rent',
    metaTitle: 'Commercial Showrooms for Rent | Auto, Fashion & Premium Brand Outlets',
    metaDescription: 'Find high-visibility showrooms for rent. Double-height ceilings, glass frontage, and heavy customer traffic locations for luxury brands.',
    keywords: ['showroom for rent', 'automobile showroom lease', 'fashion showroom rent', 'commercial display space'],
    heroBadge: 'Premium Brand Displays',
    h1Title: 'Commercial Showrooms for Rent',
    heroSubtitle: 'Showcase your flagship brand in grand double-height showrooms located along arterial commercial avenues.',
    heroImages: [
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80',
    ],
    overviewHeading: 'State-of-the-Art Commercial Display Facilities',
    overviewDescription: 'Designed specifically for automotive, electronics, and fashion brands seeking expansive display floors and customer lounge areas.',
    highlights: [
      { title: 'Double Height Floor Clearance', desc: 'Architectural grandeur for impactful product exhibits.', icon: 'height' },
      { title: 'Main Road High Visibility', desc: 'Frontage directly facing high-speed traffic corridors.', icon: 'eye' },
      { title: 'High Power Grid Allocation', desc: '3-phase electrical load capacity to support heavy display lighting & HVAC.', icon: 'power' },
    ],
    faqs: [
      {
        question: 'Are electrical loads customizable for high lighting demands?',
        answer: 'Yes, commercial showrooms feature high 3-phase power allocations suitable for heavy display lighting and air conditioning.'
      }
    ],
    relatedCategorySlugs: ['shops-retail', 'commercial-buildings', 'office-spaces']
  },

  'industrial-spaces': {
    slug: 'industrial-spaces',
    categoryValue: 'industrial',
    title: 'Industrial Spaces & Manufacturing Plants for Rent',
    metaTitle: 'Industrial Spaces & Factory Land for Rent | Manufacturing Units',
    metaDescription: 'Rent industrial plots, factories, and manufacturing facilities equipped with industrial power, effluent treatment access, and heavy crane setups.',
    keywords: ['industrial space for rent', 'factory for rent', 'manufacturing unit lease', 'industrial sheds'],
    heroBadge: 'Factory & Manufacturing',
    h1Title: 'Industrial Spaces & Factory Units',
    heroSubtitle: 'Power your industrial production with heavy-duty manufacturing sheds, industrial plots, and compliant factory facilities.',
    heroImages: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1920&q=80',
    ],
    overviewHeading: 'Compliant & Heavy Industrial Infrastructure',
    overviewDescription: 'Zoned industrial properties supporting heavy power grids, industrial waste management, high crane hook height, and logistics transit.',
    highlights: [
      { title: 'Heavy Power Grid Load', desc: 'High KVA transformer capacity and 3-phase industrial power supply.', icon: 'power' },
      { title: 'ETP & Waste Access', desc: 'Effluent treatment plant connections and pollution NOC compliance.', icon: 'flask' },
      { title: 'Overhead Crane Setup', desc: 'Gantry crane girders and high hook clearance for machinery handling.', icon: 'crane' },
    ],
    faqs: [
      {
        question: 'Do these properties have industrial zoning clearance?',
        answer: 'Yes, all listed manufacturing facilities specify green/orange zone compliance and environmental safety approvals.'
      }
    ],
    relatedCategorySlugs: ['warehouses', 'farm-land-plots', 'storage-spaces']
  },

  'hotel-banquet': {
    slug: 'hotel-banquet',
    categoryValue: 'hotel_banquet',
    title: 'Hotels & Banquet Halls for Rent',
    metaTitle: 'Hotels & Banquet Halls for Rent / Lease | Hospitality & Event Spaces',
    metaDescription: 'Lease operational hotel properties, banquet halls, and hospitality venues. Fully fitted commercial kitchens, guest rooms, and event spaces.',
    keywords: ['hotel for lease', 'banquet hall for rent', 'resort lease', 'hospitality property rent'],
    heroBadge: 'Hospitality Venues',
    h1Title: 'Hotels & Banquet Halls for Lease',
    heroSubtitle: 'Operate grand hospitality properties, wedding banquet facilities, and boutique hotel buildings in prime tourism and event centers.',
    heroImages: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1920&q=80',
    ],
    overviewHeading: 'Turnkey Hospitality Properties',
    overviewDescription: 'Complete with guest rooms, dining halls, commercial kitchen setups, liquor license eligibility, and large event lawns.',
    highlights: [
      { title: 'Fitted Commercial Kitchen', desc: 'Stainless steel cooking ranges, walk-in freezers, and dishwashing zones.', icon: 'kitchen' },
      { title: 'Banquet & Dining Halls', desc: 'Acoustically insulated event halls capable of grand banquet setups.', icon: 'banquet' },
      { title: 'Guest Room Accommodation', desc: 'Ensuite furnished hotel rooms for overnight guest stays.', icon: 'bed' },
    ],
    faqs: [
      {
        question: 'Are banquet halls equipped with sound and lighting infrastructure?',
        answer: 'Most banquet properties include acoustic paneling, central air conditioning, and high-capacity electrical setups.'
      }
    ],
    relatedCategorySlugs: ['event-venues', 'commercial-buildings', 'independent-villas']
  },

  'event-venues': {
    slug: 'event-venues',
    categoryValue: 'event_venue',
    title: 'Event Venues & Celebration Grounds for Rent',
    metaTitle: 'Event Venues & Party Grounds for Rent | Weddings, Concerts & Expos',
    metaDescription: 'Book outdoor event grounds, open-air lawns, and indoor celebration venues for weddings, corporate expos, and cultural gatherings.',
    keywords: ['event venue for rent', 'party lawn rent', 'expo ground lease', 'wedding venue lease'],
    heroBadge: 'Event Spaces',
    h1Title: 'Event Venues & Celebration Grounds',
    heroSubtitle: 'Host unforgettable corporate summits, grand weddings, and exhibitions at premier indoor and open-air event spaces.',
    heroImages: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1920&q=80',
    ],
    overviewHeading: 'Spacious & Adaptable Event Venues',
    overviewDescription: 'Featuring large guest capacity, green rooms, valet parking arrangements, and vendor catering access.',
    highlights: [
      { title: 'High Guest Capacity', desc: 'Expansive lawns and pillarless halls accommodating 500+ guests.', icon: 'users' },
      { title: 'Green Rooms & Suites', desc: 'Private dressing suites for hosts, performers, and wedding parties.', icon: 'star' },
      { title: 'Ample Valet Parking', desc: 'Expansive parking fields capable of handling large vehicle volumes.', icon: 'car' },
    ],
    faqs: [
      {
        question: 'Can event venues be booked on a daily basis?',
        answer: 'Yes, event venues offer both single-day event bookings and multi-day exhibition rentals.'
      }
    ],
    relatedCategorySlugs: ['hotel-banquet', 'shooting-locations', 'farm-land-plots']
  },

  'shooting-locations': {
    slug: 'shooting-locations',
    categoryValue: 'shooting_location',
    title: 'Shooting Locations & Film Sets for Rent',
    metaTitle: 'Shooting Locations & Film Studios for Rent | TV, Ads & Movies',
    metaDescription: 'Rent cinematic shooting locations, soundstages, photo studios, and scenic villas for film productions, TV commercials, and photoshoots.',
    keywords: ['shooting location for rent', 'film studio lease', 'photo studio rent', 'ad shoot location'],
    heroBadge: 'Media Production',
    h1Title: 'Shooting Locations & Production Sets',
    heroSubtitle: 'Capture stunning visual content in curated film sets, heritage villas, modern minimalist apartments, and sound-isolated studios.',
    heroImages: [
      'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1920&q=80',
    ],
    overviewHeading: 'Production-Ready Visual Locations',
    overviewDescription: 'Equipped with vanity rooms, generator parking, acoustic insulation, and flexible shoot timing permissions.',
    highlights: [
      { title: 'Production-Friendly Access', desc: 'Dedicated parking for equipment trucks and vanity vans.', icon: 'camera' },
      { title: 'Acoustic & Sound Insulation', desc: 'Sound-isolated indoor stages for clean dialogue audio recording.', icon: 'mic' },
      { title: 'Vanity & Makeup Lounges', desc: 'Air-conditioned green rooms with lighted mirrors for cast & crew.', icon: 'user_profile' },
    ],
    faqs: [
      {
        question: 'Are night shoots permitted at shooting locations?',
        answer: 'Night shoot permissions vary by location and are detailed in individual listing specifications.'
      }
    ],
    relatedCategorySlugs: ['independent-villas', 'event-venues', 'apartments']
  },

  'storage-spaces': {
    slug: 'storage-spaces',
    categoryValue: 'storage',
    title: 'Self-Storage & Inventory Units for Rent',
    metaTitle: 'Self-Storage Spaces & Inventory Lockers for Rent | Secure Storage',
    metaDescription: 'Rent secure self-storage lockers, household item storage units, and business inventory spaces. Climate control, 24/7 security & flexible plans.',
    keywords: ['storage space for rent', 'self storage locker', 'household storage unit', 'inventory storage lease'],
    heroBadge: 'Secure Storage',
    h1Title: 'Self-Storage & Inventory Storage Units',
    heroSubtitle: 'Store personal belongings, excess inventory, and archival files safely in climate-controlled, surveillance-monitored storage lockers.',
    heroImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1920&q=80',
    ],
    overviewHeading: 'Safe, Accessible & Climate-Controlled Storage',
    overviewDescription: 'Personal storage rooms featuring individual keycard access, fire suppression, and pest control protection.',
    highlights: [
      { title: '24/7 Keycard Access', desc: 'Retrieve your items anytime with secure digital keycards.', icon: 'lock' },
      { title: 'Climate & Humidity Control', desc: 'Preserve sensitive documents, electronics, and wooden furniture.', icon: 'power' },
      { title: 'Fire & Pest Control Safety', desc: 'Automated sprinkler protection and routine pest eradication treatments.', icon: 'security' },
    ],
    faqs: [
      {
        question: 'Is climate control available for sensitive items?',
        answer: 'Yes, specialized climate-controlled units maintain temperature and humidity levels for documents and electronics.'
      }
    ],
    relatedCategorySlugs: ['warehouses', 'office-spaces', 'apartments']
  },

  'parking-spaces': {
    slug: 'parking-spaces',
    categoryValue: 'parking',
    title: 'Vehicle Parking Spaces & Fleet Storage for Rent',
    metaTitle: 'Parking Spaces & Vehicle Storage for Rent | Covered & Open Slots',
    metaDescription: 'Rent secure car parking slots, commercial fleet yards, and bike parking spaces. Covered garages and gated surface parking available.',
    keywords: ['parking space for rent', 'car parking slot lease', 'fleet parking ground', 'covered garage rent'],
    heroBadge: 'Vehicle Parking',
    h1Title: 'Vehicle Parking Spaces & Garages',
    heroSubtitle: 'Reserve dedicated monthly parking slots and fleet storage grounds in dense city centers.',
    heroImages: [
      'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1920&q=80',
    ],
    overviewHeading: 'Convenient & Secure Vehicle Parking',
    overviewDescription: 'Eliminate parking hassle with reserved, boom-barrier controlled car slots and commercial transport parking yards.',
    highlights: [
      { title: 'CCTV Surveillance', desc: 'Monitored parking areas for vehicle safety.', icon: 'security' },
      { title: 'Reserved Monthly Slots', desc: 'Guaranteed parking spot dedicated to your vehicle 24/7.', icon: 'car' },
      { title: 'Gated Access Control', desc: 'RFID boom barriers and security guard validation.', icon: 'lock' },
    ],
    faqs: [
      {
        question: 'Can I rent a parking slot on a monthly subscription?',
        answer: 'Yes, parking owners offer monthly, quarterly, and annual parking space leases.'
      }
    ],
    relatedCategorySlugs: ['apartments', 'office-spaces', 'commercial-buildings']
  }
};

// Helper function to resolve category info by slug or by PropertyCategory value
export function getSeoDataBySlug(slug: string): CategorySeoInfo | undefined {
  if (CATEGORY_SEO_DATA[slug]) return CATEGORY_SEO_DATA[slug];
  // Fallback: search by categoryValue
  return Object.values(CATEGORY_SEO_DATA).find(c => c.categoryValue === slug);
}

// Map propertyType string to clean URL slug
export function getCategorySlug(categoryValue: PropertyCategory): string {
  const item = Object.values(CATEGORY_SEO_DATA).find(c => c.categoryValue === categoryValue);
  return item ? item.slug : categoryValue;
}
