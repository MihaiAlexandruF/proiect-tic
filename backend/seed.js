const db = require('./config/firebase');
const { faker } = require('@faker-js/faker');

const REAL_OWNER_IDS = [
  'DsJumNZZlmheIvcPkbyLFAzfbI83',
  'lJeBVGnJ3cOzx6MR9NHqa26zeQy2',
  'rmh2D7sYYggPeG5Pqh0a0Oan6j02'
];

// Pool de 20 de imagini variate (interioare/exterioare imobiliare)
const IMAGE_POOL = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
  "https://images.unsplash.com/photo-1527359443443-84a18acc6121?w=800",
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
  "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800",
  "https://images.unsplash.com/photo-1505691722718-35059001c364?w=800",
  "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800",
  "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800",
  "https://images.unsplash.com/photo-1448630305456-d39fa54339ee?w=800",
  "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=800",
  "https://images.unsplash.com/photo-1513584684374-8bdb7489feef?w=800",
  "https://images.unsplash.com/photo-1469022563428-aa04fef9f5a2?w=800",
  "https://images.unsplash.com/photo-1501183007986-d0d080b147f9?w=800",
  "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800",
  "https://images.unsplash.com/photo-1495433324511-bf8e92934d90?w=800",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800"
];

const ADDRESS_DATA = {
  "București": ["Sector 1", "Sector 2", "Sector 3", "Sector 4", "Sector 5", "Sector 6"],
  "Cluj": ["Cluj-Napoca", "Dej", "Turda", "Gherla", "Florești"],
  "Timiș": ["Timișoara", "Lugoj", "Buziaș", "Sânnicolau Mare"],
  "Brașov": ["Brașov", "Săcele", "Zărnești", "Codlea", "Făgăraș"],
  "Iași": ["Iași", "Pașcani", "Hârlău", "Târgu Frumos"],
  "Ilfov": ["Otopeni", "Voluntari", "Popești-Leordeni", "Chiajna", "Pantelimon"]
};

const COMMON_STREETS = ["Bulevardul Unirii", "Calea Victoriei", "Șoseaua Mihai Bravu", "Strada Regele Ferdinand", "Bulevardul Eroilor", "Strada Principală"];
const heatingTypes = ['private_boiler', 'central_heating'];
const partitionTypes = ['Decomandat', 'Semidecomandat', 'Nedecomandat'];
const buildYears = ['Inainte de 1977', '1977 - 1990', '1990 - 2000', '2000 - 2010', 'Dupa 2010'];

async function seedListings(count = 20) {
  console.log(`🚀 Se pornește popularea cu ${count} anunțuri dinamice...`);

  const availableCounties = Object.keys(ADDRESS_DATA);

  for (let i = 0; i < count; i++) {
    const listingId = `seed_${faker.string.alphanumeric(10)}`;
    const randomCounty = faker.helpers.arrayElement(availableCounties);
    const randomLocality = faker.helpers.arrayElement(ADDRESS_DATA[randomCounty]);
    
    // Logica pentru poze: Alege 3 sau 4 poze RANDOM din pool-ul de 20
    const imagesCount = faker.helpers.arrayElement([3, 4]);
    const selectedImages = faker.helpers.shuffle([...IMAGE_POOL]).slice(0, imagesCount);

    const newListing = {
      title: faker.helpers.arrayElement([
        `Apartament ${faker.number.int({ min: 1, max: 4 })} camere zona ${randomLocality}`,
        `Studio modern în ${randomLocality}`,
        `Garsonieră primitoare, ${faker.helpers.arrayElement(COMMON_STREETS)}`,
        `Penthouse lux ${randomCounty}`
      ]),
      description: faker.lorem.paragraphs(2),
      price: faker.number.int({ min: 350, max: 2200 }),
      region: randomCounty,
      locality: randomLocality,
      street: faker.helpers.arrayElement(COMMON_STREETS),

      specs: {
        partitioning: faker.helpers.arrayElement(partitionTypes),
        floor: `${faker.number.int({ min: 0, max: 10 })}/10`,
        rooms: faker.number.int({ min: 1, max: 4 }),
        surface: faker.number.int({ min: 35, max: 150 }),
        balconies: faker.number.int({ min: 0, max: 2 }),
        buildingYear: faker.helpers.arrayElement(buildYears),
        heating: faker.helpers.arrayElement(heatingTypes),
        furnished: faker.helpers.arrayElement(['furnished', 'unfurnished']),
        equipped: faker.helpers.arrayElement(['equipped', 'not_equipped']),
        features: faker.helpers.arrayElements(['Lift', 'Parcare', 'Terasă', 'Aer Condiționat'], { min: 1, max: 3 })
      },

      costs: {
        maintenanceCost: faker.number.int({ min: 40, max: 200 }),
        utilitiesIncluded: faker.datatype.boolean(),
        minimumStayMonths: faker.helpers.arrayElement([1, 6, 12])
      },

      rules: {
        petsAllowed: faker.datatype.boolean(),
        smokingAllowed: faker.datatype.boolean(),
        studentsAllowed: faker.datatype.boolean(),
        foreignersAllowed: faker.datatype.boolean()
      },

      meta: {
        status: 'active',
        viewsCount: faker.number.int({ min: 10, max: 450 }),
        favoritesCount: faker.number.int({ min: 0, max: 30 }),
      },

      images: selectedImages, // Aici vin pozele random amestecate
      ownerId: faker.helpers.arrayElement(REAL_OWNER_IDS),
      createdAt: faker.date.recent({ days: 10 }).toISOString()
    };

    try {
      await db.collection('listings').doc(listingId).set(newListing);
      console.log(`✅ [${randomCounty}] Adăugat: ${newListing.title} (${imagesCount} poze)`);
    } catch (error) {
      console.error(`❌ Eroare la ${listingId}:`, error);
    }
  }

  console.log('✨ Seed finalizat! Vizualul ar trebui să fie mult mai diversificat acum.');
  process.exit();
}

seedListings(20);