import { fetchAPI } from "@/utils/fetch-api";
import { getStrapiURL } from "@/utils/get-strapi-url";
import qs from "qs";

const HomePageQuery = (locale: string) =>
  qs.stringify({
    locale: locale,
    populate: {
      blocks: {
        on: {
          "home.hero-section": {
            populate: {
              demo: true,
              learn: true,
              image: {
                fields: ["url"],
              },
            },
          },
          "home.our-modules": {
            populate: "*",
          },
          "home.self-service-portal": {
            populate: {
              cta: true,
              image: {
                fields: ["url"],
              },
              card: true,
            },
          },
          "home.testimonial": {
            populate: {
              cards: {
                populate: {
                  image: {
                    fields: ["url"],
                  },
                },
              },
            },
          },
          "home.platform-benefits": {
            populate: {
              cards: true,
            },
          },
          "home.pricing": {
            populate: {
              cards: {
                populate: {
                  features: true,
                },
              },
            },
          },
          "home.faq": {
            populate: {
              cards: true,
            },
          },
          "home.blog": {
            populate: {
              cta: true,
            },
          },
        },
      },
    },
  });

export async function getHomePageData(locale: string = "en") {
  const BASE_URL = getStrapiURL();
  const query = HomePageQuery(locale);
  const url = `${BASE_URL}/api/homepage?${query}`;
  return await fetchAPI(url, {
    method: "GET",
    next: { tags: ["strapi-data"] },
  });
}

export const AllModulesQuery = (locale: string = "en") =>
  qs.stringify({
    locale: locale,
    sort: ["module_count:asc"],
    populate: {
      icon: {
        populate: "*",
      },
      tags: {
        populate: "*",
      },
      featureList: {
        populate: {
          lists: {
            populate: "*",
          },
        },
      },
      userStories: {
        populate: {
          points: {
            populate: {
              cards: {
                populate: "*",
              },
            },
          },
        },
      },
    },
  });

// Query to fetch a SINGLE module by its slug
export const SingleModuleQuery = (slug: string, locale: string = "en") =>
  qs.stringify({
    locale: locale,
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: {
      icon: { populate: "*" },
      tags: { populate: "*" },
      featureList: {
        populate: {
          lists: { populate: "*" },
        },
      },
      userStories: {
        populate: {
          points: {
            populate: {
              cards: { populate: "*" },
            },
          },
        },
      },
    },
  });

export async function getAllModulesData(locale: string = "en") {
  const BASE_URL = getStrapiURL();
  const query = AllModulesQuery(locale);
  const url = `${BASE_URL}/api/modules?${query}`;

  return await fetchAPI(url, {
    method: "GET",
    next: { tags: ["strapi-data", "modules"] },
  });
}

export async function getAllModuleSlugs() {
  const BASE_URL = getStrapiURL();
  const query = qs.stringify({ fields: ["slug"] });
  const url = `${BASE_URL}/api/modules?${query}`;
  return await fetchAPI(url, { method: "GET" });
}

export async function getModuleDataBySlug(slug: string, locale: string = "en") {
  const BASE_URL = getStrapiURL();
  const query = SingleModuleQuery(slug, locale);
  const url = `${BASE_URL}/api/modules?${query}`;

  return await fetchAPI(url, {
    method: "GET",
    next: { tags: ["strapi-data", "modules", slug] },
  });
}

// 1. Fetch ALL Blogs for the Listing Page
export const AllBlogsQuery = (locale: string = "en") =>
  qs.stringify({
    locale: locale,
    populate: {
      image: true,
    },
    sort: ["date:desc"],
  });

export async function getAllBlogsData(locale: string = "en") {
  const BASE_URL = getStrapiURL();
  const query = AllBlogsQuery(locale);
  const url = `${BASE_URL}/api/blogs?${query}`;

  return await fetchAPI(url, {
    method: "GET",
    next: { tags: ["strapi-data", "blogs"] },
  });
}

export const SingleBlogQuery = (slug: string, locale: string = "en") =>
  qs.stringify({
    locale: locale,
    filters: {
      slug: {
        $eq: slug,
      },
    },

    populate: {
      image: true,
    },
  });
export async function getBlogDataBySlug(slug: string, locale: string = "en") {
  const BASE_URL = getStrapiURL();
  const query = SingleBlogQuery(slug, locale);
  const url = `${BASE_URL}/api/blogs?${query}`;

  return await fetchAPI(url, {
    method: "GET",
    next: { tags: ["strapi-data", "blog-detail"] },
  });
}

// 3. Fetch just the Slugs for Static Site Generation (generateStaticParams)
export async function getAllBlogSlugs() {
  const BASE_URL = getStrapiURL();
  const query = qs.stringify({ fields: ["slug"] });
  const url = `${BASE_URL}/api/blogs?${query}`;
  return await fetchAPI(url, { method: "GET" });
}

// ==========================================
// UNIVERSAL DYNAMIC PAGES QUERY
// ==========================================

export const getPageQuery = (slug: string, locale: string = "en") =>
  qs.stringify(
    {
      locale: locale,
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: {
        blocks: {
          on: {
            // 1. Shared Components
            "shared.hero-section": {
              populate: { image: true },
            },
            "shared.common-cta": {
              populate: {
                image: true,
                getStartedNow: { populate: "*" },
                contact: { populate: "*" },
              },
            },

            // 2. About Components
            "about.how-we-started": {
              populate: {
                image: true,
                cta: { populate: "*" },
                card: { populate: "*" },
              },
            },
            "about.stats": {
              populate: {
                cards: { populate: "*" },
              },
            },
            "about.our-core-values": {
              populate: {
                cards: { populate: "*" },
              },
            },
            "about.the-leadership": {
              populate: {
                cards: { populate: "*" }, // Populates the team-card component and its inner images
              },
            },

            // 3. Modules & Home Components
            "modules.all-modules": {
              populate: "*", // Populates any nested fields inside all-modules
            },
            "home.pricing": {
              populate: {
                cards: { populate: "*" }, // Populates the nested pricing cards
              },
            },
            "modules.faq": {
              populate: "*", // Populates the repeatable FAQ items/cards
            },
            "pricing.compare-plans": {
              populate: {
                comparisonData: {
                  populate: {
                    features: true,
                  },
                },
              },
            },
          },
        },
      },
    },
    { encodeValuesOnly: true },
  );

// The Fetch Function
export async function getPageData(slug: string, locale: string = "en") {
  const BASE_URL = getStrapiURL();
  const query = getPageQuery(slug, locale);
  const url = `${BASE_URL}/api/pages?${query}`;

  return await fetchAPI(url, {
    method: "GET",
    next: { tags: ["strapi-data", "pages", slug] }, // Tags the cache with the specific slug
  });
}

// ==========================================
// GLOBAL SETTINGS (Header, Footer, etc.)
// ==========================================

export const GlobalQuery = (locale: string = "en") =>
  qs.stringify(
    {
      locale: locale,
      populate: {
        blocks: {
          on: {
            "global.header": {
              populate: {
                logo: true,
                navigation: {
                  populate: {
                    sub_links: {
                      populate: "*",
                    },
                  },
                },
                cta: {
                  populate: "*",
                },
              },
            },
            "global.footer": {
              populate: {
                logo: {
                  fields: ["url"],
                },
                social_links: true,
                contacts: true,
              },
            },
          },
        },
      },
    },
    { encodeValuesOnly: true },
  );

export async function getGlobalData(locale: string = "en") {
  const BASE_URL = getStrapiURL();
  const query = GlobalQuery(locale);
  // Often setup as a Single Type at /api/global
  const url = `${BASE_URL}/api/global?${query}`;

  return await fetchAPI(url, {
    method: "GET",
    next: { tags: ["strapi-data", "global"] },
  });
}

// Query to fetch all HR Toolkits
export const AllHRToolkitsQuery = (locale: string = "en") =>
  qs.stringify({
    locale: locale,
    sort: ["date:desc"],
  });

export async function getAllHRToolkits(locale: string = "en") {
  const BASE_URL = getStrapiURL();
  const query = AllHRToolkitsQuery(locale);
  const url = `${BASE_URL}/api/hr-toolkits?${query}`;

  return await fetchAPI(url, {
    method: "GET",
    next: { tags: ["strapi-data", "hr-toolkits"] },
  });
}

// Query to fetch a single HR Toolkit by slug
export const SingleHRToolkitQuery = (slug: string, locale: string = "en") =>
  qs.stringify({
    locale: locale,
    filters: {
      slug: {
        $eq: slug,
      },
    },
  });

export async function getHRToolkitBySlug(slug: string, locale: string = "en") {
  const BASE_URL = getStrapiURL();
  const query = SingleHRToolkitQuery(slug, locale);
  const url = `${BASE_URL}/api/hr-toolkits?${query}`;

  return await fetchAPI(url, {
    method: "GET",
    next: { tags: ["strapi-data", "hr-toolkit-detail", slug] },
  });
}

// Query to fetch all Compliance resources
export const AllCompliancesQuery = (locale: string = "en") =>
  qs.stringify({
    locale: locale,
    populate: "*",
    sort: ["date:desc"],
  });

export async function getAllCompliances(locale: string = "en") {
  const BASE_URL = getStrapiURL();
  const query = AllCompliancesQuery(locale);
  const url = `${BASE_URL}/api/compliances?${query}`;

  return await fetchAPI(url, {
    method: "GET",
    next: { tags: ["strapi-data", "compliances"] },
  });
}

// Query to fetch a single Compliance resource by slug
export const SingleComplianceQuery = (slug: string, locale: string = "en") =>
  qs.stringify({
    locale: locale,
    filters: {
      slug: {
        $eq: slug,
      },
    },
  });

export async function getComplianceBySlug(slug: string, locale: string = "en") {
  const BASE_URL = getStrapiURL();
  const query = SingleComplianceQuery(slug, locale);
  const url = `${BASE_URL}/api/compliances?${query}`;

  return await fetchAPI(url, {
    method: "GET",
    next: { tags: ["strapi-data", "compliance-detail", slug] },
  });
}

// Query to fetch all Use Cases
export const AllUseCasesQuery = (locale: string = "en") =>
  qs.stringify({
    locale: locale,
    populate: "*",
    sort: ["date:desc"],
  });

export async function getAllUseCases(locale: string = "en") {
  const BASE_URL = getStrapiURL();
  const query = AllUseCasesQuery(locale);
  const url = `${BASE_URL}/api/use-cases?${query}`;

  return await fetchAPI(url, {
    method: "GET",
    next: { tags: ["strapi-data", "use-cases"] },
  });
}

// Query to fetch a single Use Case by slug (Ensure 'slug' is added to the schema!)
export const SingleUseCaseQuery = (slug: string, locale: string = "en") =>
  qs.stringify({
    locale: locale,
    filters: {
      slug: {
        $eq: slug,
      },
    },
  });

export async function getUseCaseBySlug(slug: string, locale: string = "en") {
  const BASE_URL = getStrapiURL();
  const query = SingleUseCaseQuery(slug, locale);
  const url = `${BASE_URL}/api/use-cases?${query}`;

  return await fetchAPI(url, {
    method: "GET",
    next: { tags: ["strapi-data", "use-case-detail", slug] },
  });
}
