// ─────────────────────────────────────────────────────────────
// All site content lives here. Edit text, add pages, swap the
// brand — every page and the navigation are generated from this.
// ─────────────────────────────────────────────────────────────

export interface SubItem { slug: string; title: string; summary: string }
export interface Category {
  slug: string
  title: string
  group: 'physical' | 'digital'
  tagline: string
  intro: string
  icon: string
  items: SubItem[]
}

export const brand = {
  name: 'Northloom',
  full: 'Northloom Group',
  email: 'hello@example.com',
  phone: '+880 1700 000000',
  address: 'Gulshan Avenue, Dhaka 1212, Bangladesh',
}

// ── Solutions (physical + digital) ───────────────────────────
export const categories: Category[] = [
  {
    slug: 'trims', title: 'Trims', group: 'physical', icon: '🏷️',
    tagline: 'The small details that carry your brand.',
    intro: 'From the tag a shopper turns over first to the label they read years later, our trims are engineered to look right, feel right and last.',
    items: [
      { slug: 'hangtags', title: 'Hangtags', summary: 'Die-cut, embossed and foiled tags in recycled and FSC-certified boards.' },
      { slug: 'woven-and-printed-labels', title: 'Woven & Printed Labels', summary: 'High-definition damask, satin and printed labels that stay soft against skin.' },
      { slug: 'badges-and-patches', title: 'Badges & Patches', summary: 'Embroidered, rubber and leather-look patches for a tactile brand mark.' },
      { slug: 'heat-transfers', title: 'Heat Transfers', summary: 'Tagless neck prints and logo transfers that survive 50+ wash cycles.' },
      { slug: 'pocket-flashers', title: 'Jokers & Pocket Flashers', summary: 'Fit and size communicators for denim and tailored garments.' },
      { slug: 'metal-hardware', title: 'Metal Hardware', summary: 'Buttons, rivets, zip pullers and eyelets in custom finishes.' },
      { slug: 'trim-materials', title: 'Trim Materials', summary: 'A material library of papers, yarns and films with full traceability.' },
    ],
  },
  {
    slug: 'packaging', title: 'Packaging', group: 'physical', icon: '📦',
    tagline: 'Unboxing that protects products and the planet.',
    intro: 'Right-sized, recyclable packaging designed around your channel — whether it ships to a doorstep or sits on a shelf.',
    items: [
      { slug: 'e-commerce-packaging', title: 'E-commerce Packaging', summary: 'Mailers and returnable boxes that cut void fill and shipping weight.' },
      { slug: 'product-packaging', title: 'Product Packaging', summary: 'Sleeves, wraps and inserts that frame the product at first touch.' },
      { slug: 'retail-packaging', title: 'Retail Packaging', summary: 'Shelf-ready presentation built for fast replenishment.' },
      { slug: 'polybags', title: 'Polybags', summary: 'Recycled-content and paper alternatives to conventional polybags.' },
      { slug: 'boxes', title: 'Boxes', summary: 'Rigid, folding and magnetic boxes for premium and gifting lines.' },
      { slug: 'cards', title: 'Cards', summary: 'Header cards, sock cards and inserts for hanging and flat-pack retail.' },
      { slug: 'shopping-bags', title: 'Shopping Bags', summary: 'Paper and woven bags with rope, ribbon or die-cut handles.' },
      { slug: 'packaging-materials', title: 'Packaging Materials', summary: 'Tissue, tape, stickers and fillers matched to your palette.' },
    ],
  },
  {
    slug: 'store-decorations', title: 'Store Decorations', group: 'physical', icon: '🛍️',
    tagline: 'Retail spaces that tell the story.',
    intro: 'Hangers, signage and display pieces that make a store feel unmistakably yours — rolled out consistently across every location.',
    items: [
      { slug: 'hangers', title: 'Hangers', summary: 'Wood, recycled plastic and paper hangers with branded hooks.' },
      { slug: 'retail-signage', title: 'Retail Signage', summary: 'Wayfinding, price and campaign signage in modular systems.' },
      { slug: 'seasonal-displays', title: 'Seasonal Displays', summary: 'Window and in-store kits delivered ready for each campaign drop.' },
      { slug: 'product-display', title: 'Product Display', summary: 'Counter units, plinths and fixtures that lift sell-through.' },
      { slug: 'promotional-items', title: 'Promotional Items', summary: 'Gift-with-purchase and event merchandise that people keep.' },
      { slug: 'customized-solutions', title: 'Customized Solutions', summary: 'Bespoke pieces designed and prototyped by our studio.' },
    ],
  },
  {
    slug: 'paper-hangers', title: 'Paper Hangers', group: 'physical', icon: '🪝',
    tagline: 'Plastic-free hanging, without compromise.',
    intro: 'Recyclable board hangers strong enough for outerwear and smart enough for automated packing lines.',
    items: [
      { slug: 'garment-hangers', title: 'Garment Hangers', summary: 'Tops, bottoms and outerwear hangers in kerbside-recyclable board.' },
      { slug: 'kidswear-hangers', title: 'Babywear & Kidswear Hangers', summary: 'Small-format hangers with rounded, child-safe edges.' },
      { slug: 'accessory-and-footwear-hangers', title: 'Accessory & Footwear Hangers', summary: 'Hooks and cards for socks, belts, hats and shoes.' },
      { slug: 'homeware-and-petware-hangers', title: 'Homeware & Petware Hangers', summary: 'Heavy-duty formats for textiles, toys and pet products.' },
    ],
  },
  {
    slug: 'source-tagging', title: 'Source Tagging', group: 'physical', icon: '🖨️',
    tagline: 'Price and protect at the point of manufacture.',
    intro: 'Apply retail-ready tickets and security tags at the factory, so stock arrives on the floor ready to sell.',
    items: [
      { slug: 'in-plant-printing', title: 'In-Plant Printing', summary: 'Print variable data on-site with our software, printers and support.' },
      { slug: 'price-tickets', title: 'Price Tickets', summary: 'Multi-currency tickets and stickers fed straight from your ERP.' },
    ],
  },
  {
    slug: 'care-labels', title: 'Care & Content Labels', group: 'physical', icon: '🧺',
    tagline: 'Compliant labelling in every language you sell in.',
    intro: 'We translate, validate and print care and composition data so every market rule is met — first time.',
    items: [],
  },
  {
    slug: 'threadid', title: 'ThreadID Platform', group: 'digital', icon: '🧬',
    tagline: 'One source of truth for every product.',
    intro: 'ThreadID is our cloud platform for product data, certificates and digital identities — connecting suppliers, brands and consumers.',
    items: [
      { slug: 'certificate-manager', title: 'Certificate Manager', summary: 'Collect, validate and track supplier certificates in one place.' },
      { slug: 'product-manager', title: 'Product Manager', summary: 'Structure materials, origins and impact data per style and SKU.' },
      { slug: 'digital-manager', title: 'Digital Manager', summary: 'Publish consumer-facing product pages from the same data set.' },
      { slug: 'packaging-manager', title: 'Packaging Manager', summary: 'Report packaging weights and materials for EPR compliance.' },
      { slug: 'complete-dpp', title: 'Complete DPP Solution', summary: 'End-to-end Digital Product Passport — data, carrier and hosting.' },
    ],
  },
  {
    slug: 'digital-product-passport', title: 'Digital Product Passport', group: 'digital', icon: '🛂',
    tagline: 'Be ready for the passport era.',
    intro: 'Upcoming regulation will require textile products to carry a scannable record of what they are made of and where. We help you get there step by step.',
    items: [],
  },
  {
    slug: 'rfid', title: 'RFID', group: 'digital', icon: '📡',
    tagline: 'See every item, everywhere.',
    intro: 'Item-level RFID that improves stock accuracy, speeds up checkout and reduces loss — from encoding at source to reading in store.',
    items: [
      { slug: 'inventory-accuracy', title: 'Inventory Accuracy & Loss Prevention', summary: 'Near-perfect stock counts and fewer shrinkage surprises.' },
      { slug: 'retail-mandates', title: 'Retail RFID Mandates', summary: 'Meet retailer tagging requirements without slowing production.' },
      { slug: 'rfid-tagging', title: 'RFID Tagging Solutions', summary: 'Hangtags, stickers and labels with certified inlays.' },
      { slug: 'sustainable-rfid', title: 'Sustainability & RFID', summary: 'Paper-based and aluminium-free inlays for lower impact.' },
      { slug: 'rfid-sew-in-labels', title: 'RFID Sew-in Labels', summary: 'Permanent tags that enable resale, repair and recycling.' },
    ],
  },
  {
    slug: 'qr-and-nfc', title: 'QR Codes & NFC', group: 'digital', icon: '📱',
    tagline: 'Turn every product into a channel.',
    intro: 'Unique, serialised QR codes and NFC tags that link each item to authenticity checks, care guides and after-sale services.',
    items: [],
  },
]

export const findCategory = (slug: string) => categories.find(c => c.slug === slug)

// ── Industries ───────────────────────────────────────────────
export const industries = [
  { slug: 'fashion', title: 'Fashion', icon: '👗', text: 'Fast seasons and many drops — we keep trims and packaging in step with your calendar.' },
  { slug: 'footwear', title: 'Footwear', icon: '👟', text: 'Shoe boxes, tissue and tongue labels that survive the warehouse and delight at home.' },
  { slug: 'workwear', title: 'Workwear', icon: '🦺', text: 'Durable, compliant labelling for garments that work as hard as their wearers.' },
  { slug: 'lingerie', title: 'Lingerie & Underwear', icon: '🩱', text: 'Skin-friendly labels and transfers, plus gift-ready packaging.' },
  { slug: 'home-textiles', title: 'Home Textiles & Decor', icon: '🛏️', text: 'Bands, inserts and hangers for bedding, towels and soft furnishings.' },
  { slug: 'kidswear', title: 'Kidswear', icon: '🧸', text: 'Safety-tested trims and playful packaging for the youngest customers.' },
  { slug: 'accessories', title: 'Accessories', icon: '👜', text: 'Small-format tags, cards and boxes for bags, belts and jewellery.' },
  { slug: 'outdoor', title: 'Outdoor', icon: '🏔️', text: 'Technical labels that stay legible through rain, snow and repeated washing.' },
  { slug: 'denim', title: 'Denim & Jeanswear', icon: '👖', text: 'Leather-look patches, flashers and hardware that define a five-pocket.' },
  { slug: 'activewear', title: 'Activewear & Athleisure', icon: '🏃', text: 'Stretch-ready heat transfers and lightweight branding for performance pieces.' },
]

// ── About pages ──────────────────────────────────────────────
export const aboutPages = [
  { slug: 'about-us', title: 'About Us', lead: 'We help brands express who they are on every product they make.', body: ['Northloom Group started as a small label workshop and has grown into a partner for trims, packaging and product data. Our teams sit close to the factories our customers use, so decisions happen fast and close to production.', 'We combine a design studio, global manufacturing and a software platform under one roof — which means one partner, one data set and one standard of quality.'] },
  { slug: 'locations', title: 'Locations', lead: 'Local teams, global standards.', body: ['Our production and service hubs are placed where garments are made, so we can deliver within days rather than weeks.'] },
  { slug: 'design-and-innovation', title: 'Design & Innovation', lead: 'A studio that thinks in materials.', body: ['Our designers and material engineers prototype new constructions every week — from mono-material packaging to labels made from post-consumer fibre.', 'Bring us a brief, a mood board or a problem. We will come back with samples.'] },
  { slug: 'production', title: 'Production', lead: 'Owned factories, consistent quality.', body: ['We run our own weaving, printing and converting lines, audited to international social and environmental standards.', 'Colour is matched digitally and checked on every run, so a label made in one country matches one made in another.'] },
  { slug: 'esg', title: 'ESG', lead: 'Measured progress, reported openly.', body: ['We publish annual targets for emissions, materials and people, and we report against them every year — including where we fall short.'] },
  { slug: 'sustainability', title: 'Sustainability', lead: 'Less material, better material, longer life.', body: ['Our default material range is recycled or certified. We help customers remove unnecessary components and design for recycling from the start.'] },
  { slug: 'partner-network', title: 'Partner Network', lead: 'Better together.', body: ['We work with traceability platforms, certification bodies and software providers so our customers can plug Northloom into the tools they already use.'] },
]

export const locations = [
  { city: 'Dhaka', country: 'Bangladesh', type: 'Production & service hub' },
  { city: 'Chattogram', country: 'Bangladesh', type: 'Production' },
  { city: 'Ho Chi Minh City', country: 'Vietnam', type: 'Production & service hub' },
  { city: 'Istanbul', country: 'Türkiye', type: 'Production' },
  { city: 'Copenhagen', country: 'Denmark', type: 'Design studio & sales' },
  { city: 'Shanghai', country: 'China', type: 'Production & sourcing' },
  { city: 'Colombo', country: 'Sri Lanka', type: 'Service hub' },
  { city: 'Nairobi', country: 'Kenya', type: 'Service hub' },
]

// ── Homepage ─────────────────────────────────────────────────
export const pillars = [
  { title: 'Design & Innovation', text: 'A material-first studio turning brand ideas into samples within days.', to: '/about/design-and-innovation', icon: '✏️' },
  { title: 'Data Integration', text: 'Connect your PLM or ERP so artwork and variable data flow without retyping.', to: '/data-integration', icon: '🔗' },
  { title: 'Traceability', text: 'Know where each component came from — and prove it to customers and regulators.', to: '/solutions/threadid', icon: '🧭' },
  { title: 'ESG', text: 'Lower-impact materials and transparent reporting built into every order.', to: '/about/esg', icon: '🌱' },
]

export const reasons = [
  'One partner for trims, packaging and product data',
  'Production hubs close to where your garments are made',
  'In-house studio for fast sampling and material development',
  'Recycled and certified materials as the default, not the upgrade',
  'Software that keeps every artwork, size and language in sync',
]

export const stats = [
  { value: 24, suffix: '', label: 'Countries' },
  { value: 1800, suffix: '+', label: 'Employees' },
  { value: 6500, suffix: '+', label: 'Factories supplied' },
  { value: 900, suffix: '+', label: 'Brands served' },
  { value: 3, suffix: 'bn', label: 'Units per year' },
  { value: 30, suffix: '+', label: 'Years of experience' },
]

export const clientLogos = ['ALDER & CO', 'Brightwave', 'MOSSGREY', 'Fjordline', 'Pellucid', 'ROAM/RO', 'Kestrel', 'Tidepool', 'Ochre Lane', 'NOVU']

export const testimonials = [
  { quote: 'Northloom cut our packaging weight by a third and the boxes look better than before.', name: 'Head of Sourcing', company: 'Brightwave (sample client)' },
  { quote: 'Having labels, tags and product data from one team removed a week from every launch.', name: 'Production Director', company: 'Fjordline (sample client)' },
  { quote: 'Their studio understood our brand faster than any supplier we have worked with.', name: 'Creative Lead', company: 'Ochre Lane (sample client)' },
]

// ── News / resources ─────────────────────────────────────────
export interface Article { slug: string; title: string; category: string; date: string; summary: string; body: string[] }
export const articles: Article[] = [
  { slug: 'spring-trims-collection', title: 'Meet the Spring trims collection', category: 'Product', date: '2026-09-28', summary: 'Soft-touch boards, natural dyes and a new range of mono-material patches.', body: ['Our studio spent the summer testing materials that feel premium without mixed-material construction. The result is a collection that is easier to recycle and still delights in hand.', 'Samples are available now through your account manager.'] },
  { slug: 'solar-rooftops-dhaka', title: 'Solar rooftops now power our Dhaka weaving floor', category: 'Sustainability', date: '2026-09-10', summary: 'A 1.2 MW rooftop array covers most daytime demand at our largest site.', body: ['The installation was completed in twelve weeks without stopping production.', 'We will publish a full year of generation data in our next ESG report.'] },
  { slug: 'dpp-explained', title: 'Digital Product Passports explained in five questions', category: 'Insight', date: '2026-08-21', summary: 'What the passport is, who needs one and how to start preparing today.', body: ['A Digital Product Passport is a structured record of a product, accessible through a data carrier such as a QR code or NFC tag.', 'Start by mapping the data you already hold and the suppliers who hold the rest. Most brands find the gaps are in materials and processing steps.'] },
  { slug: 'design-graduate-programme', title: 'Launching our design graduate programme', category: 'Company', date: '2026-07-30', summary: 'Twelve textile and graphic design graduates join a two-year rotation across studio and production.', body: ['Graduates spend time in sampling, colour management and customer projects before choosing a specialism.'] },
  { slug: 'paper-hanger-line-expands', title: 'Paper hanger line expands to outerwear', category: 'Product', date: '2026-06-14', summary: 'A reinforced board construction now carries coats up to 2.5 kg.', body: ['Outerwear was the last category where plastic hangers were the only practical option. Not anymore.'] },
  { slug: 'recycled-label-yarn', title: 'Switching our woven labels to recycled yarn', category: 'Product', date: '2026-05-02', summary: 'Recycled polyester is now the default yarn for every new woven label order.', body: ['Colour range and hand-feel match our previous virgin yarn, with no change in lead time.'] },
  { slug: 'threadid-open-api', title: 'ThreadID opens its API to customers', category: 'Digital', date: '2026-04-11', summary: 'Push product and material data from your own systems with a documented REST API.', body: ['API keys can be created by account admins, with per-key permissions and audit logs.'] },
  { slug: 'packaging-weight-guide', title: 'Five ways to cut packaging weight this season', category: 'Insight', date: '2026-03-03', summary: 'Practical changes that lower shipping cost and material use without hurting presentation.', body: ['Start with right-sizing: most e-commerce parcels carry more air than product.', 'Then look at board grades, inserts and tape — small changes add up across millions of units.'] },
]

export const resourcePages: Record<string, { title: string; lead: string }> = {
  'news': { title: 'News & Insights', lead: 'Product launches, company updates and practical guides from our teams.' },
  'webinars': { title: 'Webinars', lead: 'On-demand sessions on regulation, materials and digital identity.' },
  'events': { title: 'Events', lead: 'Meet our team at trade fairs and industry events.' },
  'brand-cases': { title: 'Brand Cases', lead: 'How brands use Northloom to launch faster and waste less.' },
  'downloads': { title: 'Downloads', lead: 'Brochures, material guides and technical sheets.' },
  'testimonials': { title: 'Testimonials', lead: 'What our customers say about working with us.' },
  'pressroom': { title: 'Pressroom', lead: 'Press releases, media assets and contacts for journalists.' },
  'newsletter': { title: 'Newsletter', lead: 'One useful email a month. No spam, unsubscribe any time.' },
}

export const webinars = [
  { title: 'Preparing your supply chain for product passports', date: '2026-11-12', length: '45 min' },
  { title: 'Designing packaging for recycling', date: '2026-10-02', length: '40 min' },
  { title: 'RFID at source: a practical rollout guide', date: '2026-08-18', length: '50 min' },
]
export const events = [
  { title: 'Dhaka Apparel Expo', date: '2026-11-20', place: 'Dhaka, Bangladesh', booth: 'Hall 2 · B14' },
  { title: 'Sourcing Week Europe', date: '2027-02-09', place: 'Copenhagen, Denmark', booth: 'Stand 31' },
  { title: 'Retail Tech Summit', date: '2027-03-16', place: 'Online', booth: 'Virtual booth' },
]
export const downloads = [
  { title: 'Company brochure', size: '4.2 MB', file: '/downloads/northloom-brochure.txt' },
  { title: 'Sustainable materials guide', size: '2.8 MB', file: '/downloads/materials-guide.txt' },
  { title: 'Care label symbol chart', size: '0.6 MB', file: '/downloads/care-symbols.txt' },
]
export const brandCases = [
  { brand: 'Fjordline (sample)', result: '−34% packaging weight', text: 'Switched to right-sized mailers and paper void fill across 3 markets.' },
  { brand: 'Kestrel (sample)', result: '99% stock accuracy', text: 'Rolled out RFID sew-in labels from 40 factories in 6 months.' },
  { brand: 'Ochre Lane (sample)', result: '2 weeks faster launches', text: 'Centralised artwork and care data in ThreadID.' },
]

// ── Careers ──────────────────────────────────────────────────
export const jobs = [
  { id: 'graphic-designer-dhaka', title: 'Graphic Designer, Trims Studio', location: 'Dhaka', type: 'Full-time', team: 'Design' },
  { id: 'account-manager-hcmc', title: 'Key Account Manager', location: 'Ho Chi Minh City', type: 'Full-time', team: 'Sales' },
  { id: 'fullstack-developer', title: 'Full-stack Developer, ThreadID', location: 'Remote', type: 'Full-time', team: 'Digital' },
  { id: 'quality-engineer-ctg', title: 'Quality Engineer', location: 'Chattogram', type: 'Full-time', team: 'Production' },
  { id: 'esg-analyst', title: 'ESG Data Analyst', location: 'Copenhagen', type: 'Full-time', team: 'Sustainability' },
]

// ── Legal ────────────────────────────────────────────────────
export const legalPages: Record<string, { title: string; body: string[] }> = {
  'privacy-policy': { title: 'Privacy Policy', body: ['This is a template privacy policy. Replace it with text reviewed by your legal adviser.', 'We collect the information you submit through our forms (name, email, company, message) to answer your request. We do not sell personal data.', 'You can ask us to access or delete your data at any time by emailing us.'] },
  'cookies': { title: 'Cookie Policy', body: ['This site uses a strictly necessary cookie to remember your cookie choice. Analytics cookies are only set if you accept them.', 'You can change your choice at any time using the "Cookie settings" link in the footer.'] },
  'legal-imprint': { title: 'Legal Imprint', body: ['Northloom Group (placeholder company). Replace with your registered company name, registration number, address and responsible person.'] },
  'compliance': { title: 'Responsibility & Compliance', body: ['Our code of conduct applies to every employee and supplier. Replace this text with your own policies.'] },
  'ethics-hotline': { title: 'Ethics Hotline', body: ['Report concerns confidentially using the contact form and selecting "Ethics report" as the topic. Reports are handled by an independent officer.'] },
}

// ── Navigation (built from data above) ───────────────────────
export const nav = [
  {
    label: 'Product Solutions', to: '/solutions',
    columns: categories.filter(c => c.group === 'physical').map(c => ({
      title: c.title, to: `/solutions/${c.slug}`,
      links: c.items.map(i => ({ label: i.title, to: `/solutions/${c.slug}/${i.slug}` })),
    })),
  },
  {
    label: 'Digital Solutions', to: '/solutions#digital',
    columns: categories.filter(c => c.group === 'digital').map(c => ({
      title: c.title, to: `/solutions/${c.slug}`,
      links: c.items.map(i => ({ label: i.title, to: `/solutions/${c.slug}/${i.slug}` })),
    })),
  },
  {
    label: 'Industries', to: '/industries',
    columns: [{ title: 'Industries', to: '/industries', links: industries.map(i => ({ label: i.title, to: `/industries/${i.slug}` })) }],
  },
  {
    label: 'Resources', to: '/resources/news',
    columns: [{ title: 'Resources', to: '/resources/news', links: Object.entries(resourcePages).map(([k, v]) => ({ label: v.title, to: `/resources/${k}` })) }],
  },
  {
    label: 'About', to: '/about/about-us',
    columns: [{ title: 'About', to: '/about/about-us', links: aboutPages.map(p => ({ label: p.title, to: `/about/${p.slug}` })) }],
  },
  {
    label: 'Contact', to: '/contact',
    columns: [{ title: 'Contact', to: '/contact', links: [{ label: 'Contact our team', to: '/contact' }, { label: 'Careers', to: '/careers' }] }],
  },
]
