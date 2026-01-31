import { Client, Databases, Query } from "node-appwrite";
import { Agent, fetch as undiciFetch } from "undici";

const PRINTABLES_API = "https://api.printables.com/graphql/";
const PRINTABLES_CDN = "https://media.printables.com";
const BATCH_SIZE = 100;
const DELAY_MS = 1500;
const MAX_RETRIES = 5;

// Custom agent with large header size to handle Printables' oversized cookies
const agent = new Agent({
  maxHeaderSize: 65536,
});

const SEARCH_QUERY = `
  query SearchModels($query: String!, $limit: Int, $offset: Int, $categoryId: ID) {
    searchPrints2(query: $query, limit: $limit, offset: $offset, categoryId: $categoryId) {
      totalCount
      items {
        id
        name
        slug
        description
        likesCount
        downloadCount
        category { name }
        user { publicUsername }
        image { filePath }
        images { filePath }
      }
    }
  }
`;

// All printables.com categories (leaf categories for best coverage)
const CATEGORIES = [
  { id: "134", name: "Prusa Parts & Upgrades" },
  { id: "40", name: "Accessories" },
  { id: "138", name: "Anycubic Parts & Upgrades" },
  { id: "136", name: "Bambu Lab Parts & Upgrades" },
  { id: "135", name: "Creality Parts & Upgrades" },
  { id: "2", name: "Other Printer Parts & Upgrades" },
  { id: "137", name: "Voron Parts & Upgrades" },
  { id: "12", name: "Test Models" },
  { id: "16", name: "2D Plates & Logos" },
  { id: "14", name: "Sculptures" },
  { id: "15", name: "Wall-mounted" },
  { id: "41", name: "Other Art & Designs" },
  { id: "77", name: "Cosplay & Costumes" },
  { id: "78", name: "Masks" },
  { id: "81", name: "Props" },
  { id: "80", name: "Other Costume Accessories" },
  { id: "18", name: "Men" },
  { id: "20", name: "Women" },
  { id: "42", name: "Other Fashion Accessories" },
  { id: "25", name: "Audio" },
  { id: "27", name: "Computers" },
  { id: "26", name: "Photo & Video" },
  { id: "28", name: "Portable Devices" },
  { id: "100", name: "Video Games" },
  { id: "140", name: "Virtual Reality" },
  { id: "43", name: "Other Gadgets" },
  { id: "88", name: "Home Medical Tools" },
  { id: "99", name: "Medical Tools" },
  { id: "89", name: "Automotive" },
  { id: "52", name: "Electronics" },
  { id: "51", name: "Mechanical Parts" },
  { id: "95", name: "Music" },
  { id: "50", name: "Organizers" },
  { id: "64", name: "RC & Robotics" },
  { id: "49", name: "Tools" },
  { id: "82", name: "Other Ideas" },
  { id: "5", name: "Bathroom" },
  { id: "6", name: "Bedroom" },
  { id: "139", name: "Garage" },
  { id: "44", name: "Home Decor" },
  { id: "4", name: "Kitchen" },
  { id: "7", name: "Living Room" },
  { id: "29", name: "Office" },
  { id: "53", name: "Outdoor & Garden" },
  { id: "45", name: "Other House Equipment" },
  { id: "57", name: "Pets" },
  { id: "92", name: "Chemistry & Biology" },
  { id: "93", name: "Engineering" },
  { id: "98", name: "Haptic Models" },
  { id: "94", name: "Math" },
  { id: "96", name: "Other Learning" },
  { id: "91", name: "Physics & Astronomy" },
  { id: "69", name: "Autumn & Halloween" },
  { id: "68", name: "Spring & Easter" },
  { id: "71", name: "Summer" },
  { id: "70", name: "Winter & Christmas" },
  { id: "84", name: "Indoor Sports" },
  { id: "85", name: "Other Sports" },
  { id: "83", name: "Outdoor Sports" },
  { id: "74", name: "Winter Sports" },
  { id: "97", name: "Characters & Monsters" },
  { id: "104", name: "Miniature Gaming Accessories" },
  { id: "103", name: "Props & Terrains" },
  { id: "105", name: "Vehicles & Machines" },
  { id: "36", name: "Action Figures & Statues" },
  { id: "31", name: "Board Games" },
  { id: "37", name: "Building Toys" },
  { id: "34", name: "Outdoor Toys" },
  { id: "33", name: "Puzzles & Brain-teasers" },
  { id: "38", name: "Vehicles" },
  { id: "47", name: "Other Toys & Games" },
  { id: "61", name: "Animals" },
  { id: "62", name: "Architecture & Urbanism" },
  { id: "75", name: "Historical Context" },
  { id: "60", name: "People" },
];

async function fetchBatch(categoryId, limit, offset) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await undiciFetch(PRINTABLES_API, {
        method: "POST",
        dispatcher: agent,
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0",
          Origin: "https://www.printables.com",
          Referer: "https://www.printables.com/",
        },
        body: JSON.stringify({
          query: SEARCH_QUERY,
          variables: { query: "", limit, offset, categoryId },
        }),
      });

      if (!res.ok) {
        throw new Error(`API request failed: ${res.status}`);
      }

      const data = await res.json();
      if (data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
      }

      return data.data.searchPrints2;
    } catch (err) {
      if (attempt === MAX_RETRIES) throw err;
      const backoff = 2000 * attempt;
      await delay(backoff);
    }
  }
}

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, "").trim().slice(0, 1000);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function main({ req, res, log, error }) {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const databaseId = process.env.DATABASE_ID;
  const collectionId = process.env.MODELS_COLLECTION_ID;

  let totalFetched = 0;
  let totalSaved = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  for (const category of CATEGORIES) {
    log(`\n=== Category: ${category.name} (ID: ${category.id}) ===`);

    let offset = 0;
    let hasMore = true;
    let consecutiveErrors = 0;

    while (hasMore) {
      let result;
      try {
        result = await fetchBatch(category.id, BATCH_SIZE, offset);
      } catch (err) {
        consecutiveErrors++;
        error(`Failed to fetch at offset ${offset}: ${err.message}`);

        if (consecutiveErrors >= 3) {
          error(`3 consecutive fetch failures — skipping rest of category`);
          hasMore = false;
          break;
        }

        // Skip this batch but try the next offset
        log(`Skipping batch at offset ${offset}, trying next...`);
        offset += BATCH_SIZE;
        await delay(5000);
        continue;
      }

      consecutiveErrors = 0;
      const items = result.items;

      if (offset === 0) {
        log(`Total available: ${result.totalCount}`);
      }

      if (items.length === 0) {
        hasMore = false;
        break;
      }

      log(`Fetched ${items.length} at offset ${offset}`);
      totalFetched += items.length;

      for (const item of items) {
        const slug = `${item.id}-${item.slug}`;

        const thumbnailUrl = item.image?.filePath
          ? `${PRINTABLES_CDN}/${item.image.filePath}`
          : "";

        const previewImages = (item.images || [])
          .slice(0, 5)
          .map((img) => `${PRINTABLES_CDN}/${img.filePath}`);

        try {
          await databases.createDocument(databaseId, collectionId, "unique()", {
            title: item.name,
            slug,
            description: stripHtml(item.description || ""),
            author: item.user?.publicUsername || "Unknown",
            category: category.name,
            thumbnailUrl,
            previewImages: JSON.stringify(previewImages),
            likesCount: item.likesCount || 0,
            downloadCount: item.downloadCount || 0,
            printablesUrl: `https://www.printables.com/model/${item.id}-${item.slug}`,
          });
          totalSaved++;
        } catch (err) {
          if (err.message?.includes("Document with the requested ID already exists") ||
              err.code === 409 || err.type === "document_already_exists") {
            totalSkipped++;
          } else {
            totalFailed++;
            error(`Failed to save "${item.name}": ${err.message}`);
          }
        }
      }

      offset += BATCH_SIZE;

      // Stop if we've gone past the total or hit the API cap
      if (offset >= result.totalCount || offset >= 10000) {
        hasMore = false;
      }

      // Rate limit between batches
      await delay(DELAY_MS);
    }

    log(`Category done. Running totals — saved: ${totalSaved}, skipped: ${totalSkipped}, failed: ${totalFailed}`);
  }

  const summary = `Fetched ${totalFetched} models, saved ${totalSaved} new, skipped ${totalSkipped} existing, ${totalFailed} failed`;
  log(`\n=== DONE === ${summary}`);

  return res.json({
    success: true,
    totalFetched,
    totalSaved,
    totalSkipped,
    totalFailed,
    message: summary,
  });
}
