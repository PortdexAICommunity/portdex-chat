"use server";

import FirecrawlApp from "@mendable/firecrawl-js";
import { generateUUID } from "@/lib/utils";
import * as cheerio from "cheerio";

interface ScrapedProduct {
	id?: string;
	title: string;
	price: string;
	image: string;
	imageLink?: string;
	seller: string;
	condition: string;
	shipping: string;
	location: string;
	link: string;
	watchers?: number;
	bids?: number;
	timeLeft?: string;
	buyItNow?: boolean;
	bestOffer?: boolean;
}

interface ProductSelector {
	container: string;
	title: string[];
	price: string[];
	image: string[];
	seller: string[];
	condition: string[];
	shipping: string[];
	location: string[];
	link: string[];
	watchers: string[];
	bids: string[];
	timeLeft: string[];
}
interface Product {
	id: string;
	name: string;
	price: number;
	image: string;
	description: string;
	category: string;
	rating: number;
	reviews: number;
	supplier?: string;
	supplierUrl?: string;
	moq?: number;
	features?: string[];
	trustMetrics?: any;
}

// Helper function to create eBay search URL
function createEbaySearchUrl(query: string): string {
	// Replace spaces with + and encode special characters
	const encodedQuery = query.trim().replace(/\s+/g, "+");
	return `https://www.ebay.com/sch/i.html?_nkw=${encodedQuery}&_sacat=0&_from=R40&_trksid=p4432023.m570.l1313`;
}

// Helper function to clean and parse price
function parsePrice(priceStr: string): number {
	if (!priceStr) return 0;
	// Remove currency symbols and extra spaces, then parse
	const cleaned = priceStr.replace(/[$,]/g, "").trim();
	const price = parseFloat(cleaned);
	return isNaN(price) ? 0 : price;
}

// Main eBay scraping function using Firecrawl
export async function scrapeEbayProducts(
	query: string,
	maxResults: number = 15
): Promise<Product[]> {
	try {
		console.log(`Scraping eBay for: ${query}`);

		// Initialize Firecrawl
		const app = new FirecrawlApp({
			apiKey: process.env.FIRECRAWL_API_KEY,
		});

		// Create eBay search URL
		const searchUrl = createEbaySearchUrl(query);
		console.log(`Search URL: ${searchUrl}`);

		// Use Firecrawl to scrape the eBay search page
		const scrapeResult = await app.scrape(searchUrl, {
			formats: ["rawHtml"],
			onlyMainContent: true,
		});

		console.log("scrape result", scrapeResult.rawHtml);

		if (scrapeResult?.metadata?.statusCode !== 200) {
			console.error(
				"Firecrawl scraping failed with status:",
				scrapeResult?.metadata?.statusCode
			);
			return [];
		}

		if (!scrapeResult.rawHtml) {
			console.error("No HTML content received from Firecrawl");
			return [];
		}

		console.log(`Successfully scraped eBay page`);

		// Extract product data from the scraped content
		const products = extractProductsFromContent(scrapeResult.rawHtml);

		console.log(`Extracted ${products.length} valid products from eBay`);

		// Convert scraped products to our Product format
		const formattedProducts: Product[] = products
			.map((item) => {
				const priceValue = parsePrice(item.price);

				return {
					id: generateUUID(),
					name: item.title,
					price: priceValue > 0 ? Number(priceValue.toFixed(2)) : 0,
					image: item.image,
					description: item.title,
					category: "General",
					rating: Math.floor(Math.random() * 2) + 3, // Random rating between 3-5
					reviews: item.watchers || Math.floor(Math.random() * 100) + 10,
					supplier: item.seller,
					features: [item.condition, item.shipping, item.location].filter(
						Boolean
					),
				};
			})
			.filter((product) => product.price > 0);

		console.log(`Final formatted products: ${formattedProducts.length}`);
		return formattedProducts.slice(0, maxResults);
	} catch (error) {
		console.error("Error scraping eBay:", error);
		return [];
	}
}

// Helper function to extract products from HTML content using Cheerio
function extractProductsFromContent(htmlContent: string): ScrapedProduct[] {
	const products: ScrapedProduct[] = [];

	try {
		// Load HTML content into Cheerio with optimized options
		const $ = cheerio.load(htmlContent, {
			xmlMode: false,
		});

		console.log("Full HTML length:", htmlContent.length);
		console.log("HTML contains 's-item':", htmlContent.includes("s-item"));

		// Debug: analyze HTML structure
		const commonSelectors = [
			".s-item",
			".srp-results",
			".s-result-item",
			".item-card",
			"[data-item-id]",
			".listing",
			".product",
			"article",
		];
		console.log("HTML element analysis:");
		commonSelectors.forEach((selector) => {
			const count = $(selector).length;
			if (count > 0) {
				console.log(`  ${selector}: ${count} elements`);
			}
		});

		// Primary selector strategy for eBay product items using new card structure
		const primarySelectors = [
			".su-card-container",
			".s-item:not(.s-item--promotional)",
			".s-item",
			"[data-item-id]",
			".srp-results .s-item",
		];

		let productElements = $([]);
		let usedSelector = "";

		// Try primary selectors in order of preference
		for (const selector of primarySelectors) {
			const elements = $(selector);
			if (elements.length > 0) {
				console.log(
					`Found ${elements.length} elements with selector: ${selector}`
				);

				// Filter out promotional content using advanced Cheerio methods
				const filteredElements = elements.filter((index, element) => {
					const $item = $(element);
					const title = $item.find(".s-item__title").text().trim();
					const link = $item.find(".s-item__link").attr("href") || "";

					// Debug logging for first few items
					if (index < 3) {
						console.log(`Debug item ${index + 1}:`, {
							title: title.substring(0, 50),
							titleLength: title.length,
							link: link ? "Found" : "Missing",
							hasPromotionalClass: $item.is(".s-item--promotional"),
							linkContainsSearch: link.includes("ebay.com/sch/"),
							titleContainsShop: title.toLowerCase().includes("shop on ebay"),
						});
					}

					// Use Cheerio's :contains() pseudo-selector for better filtering
					const isPromotional =
						title.toLowerCase().includes("shop on ebay") ||
						link.includes("ebay.com/sch/") ||
						$item.is(".s-item--promotional") ||
						$item.has(':contains("Shop on eBay")').length > 0;

					// More lenient title check - accept if any title-like text exists
					const hasValidTitle =
						title.length > 0 ||
						$item.find("h3, h4, [title], a").text().trim().length > 0;

					return !isPromotional && hasValidTitle;
				});

				if (filteredElements.length > 0) {
					productElements = filteredElements as any;
					usedSelector = selector;
					console.log(
						`Using selector: ${selector} with ${filteredElements.length} valid products`
					);
					break;
				} else if (elements.length > 0) {
					// If filtering removes all elements, use unfiltered as fallback
					console.log(
						`No elements passed filter for ${selector}, using unfiltered elements as fallback`
					);
					productElements = elements as any;
					usedSelector = selector;
					break;
				}
			}
		}

		// Fallback selectors if primary ones fail
		if (productElements.length === 0) {
			console.log("Trying fallback selectors...");

			const fallbackSelectors = [
				".s-result-item",
				".item-card",
				"[class*='item'][class*='result']",
				"div[data-testid*='item']",
				"article",
			];

			for (const selector of fallbackSelectors) {
				const elements = $(selector);
				if (elements.length > 0 && elements.length < 100) {
					// Avoid too many false positives

					// Validate that these elements contain product-like data
					const validProducts = elements.filter((index, element) => {
						const $el = $(element);
						const title = $el
							.find("h3, h4, [class*='title'], a[title]")
							.first()
							.text()
							.trim();
						const price = $el
							.find("[class*='price'], .price, [data-testid*='price']")
							.first()
							.text()
							.trim();

						return (
							title.length > 3 &&
							price.length > 0 &&
							!title.toLowerCase().includes("shop on ebay")
						);
					});

					if (validProducts.length > 0) {
						console.log(
							`Found ${validProducts.length} valid products with fallback selector: ${selector}`
						);
						productElements = validProducts as any;
						usedSelector = selector;
						break;
					}
				}
			}
		}

		console.log(
			`Final product elements to process: ${productElements.length} using selector: ${usedSelector}`
		);

		// Early return if no products found
		if (productElements.length === 0) {
			console.log("No valid product elements found");
			return [];
		}

		// Debug: show what elements we're finding
		if (productElements.length > 0) {
			console.log(
				"First element HTML sample:",
				productElements.first().html()?.substring(0, 200)
			);
			console.log(
				"First element classes:",
				productElements.first().attr("class")
			);
		}

		// Process each product element using Cheerio best practices
		productElements.each((index, element) => {
			const $item = $(element);

			try {
				// Use new CSS selectors for eBay card structure
				const title = extractTextWithFallbacks($item, [
					".s-card__title",
					".s-item__title",
					".s-item__title a", // Sometimes title is inside a link
					"h3",
					"h4",
					"[class*='title']",
					"a[title]",
					".item-title",
					"a", // Any link as last resort
					"span", // Any span as last resort
				]);

				const price = extractTextWithFallbacks($item, [
					".s-card__price",
					".s-item__price",
					".s-item__price .notranslate", // Sometimes price is inside notranslate
					"[class*='price']",
					".price",
					"[data-testid*='price']",
					".notranslate",
					"span:contains('$')", // Any span containing $ symbol
				]);

				// Extract image with new card structure selectors
				const image =
					extractAttributeWithFallbacks($item, "src", [
						".su-media__image img.s-card__image",
						".s-item__image-img",
						"img[src]",
						"[class*='image'] img",
						".item-image img",
					]) ||
					extractAttributeWithFallbacks($item, "data-src", [
						".su-media__image img.s-card__image",
						".s-item__image-img",
						"img[data-src]",
						"[class*='image'] img",
					]) ||
					"";

				// Extract image link (href) for the new card structure
				const imageLink = extractAttributeWithFallbacks($item, "href", [
					".su-media__image a.image-treatment",
					".s-item__image a",
					"[class*='image'] a",
				]);

				const seller = extractTextWithFallbacks($item, [
					".su-card-container__attributes__secondary .su-styled-text.primary.large",
					".s-item__seller-info-text",
					"[class*='seller']",
					".seller-name",
				]);

				const condition = extractTextWithFallbacks($item, [
					".s-card__subtitle",
					".SECONDARY_INFO",
					"[class*='condition']",
					".item-condition",
				]);

				const shipping = extractTextWithFallbacks($item, [
					".su-card-container__attributes__primary .su-styled-text.secondary.large",
					".s-item__shipping",
					".s-item__logisticsCost",
					"[class*='shipping']",
					".shipping-cost",
				]);

				const location = extractTextWithFallbacks($item, [
					".s-item__location",
					"[class*='location']",
					".item-location",
				]);

				const link = extractAttributeWithFallbacks($item, "href", [
					".su-card-container__header > a.su-link",
					".s-item__link",
					"a[href*='itm']",
					"a[href*='item']",
				]);

				// Debug logging for first few items
				if (index < 3) {
					console.log(`Product ${index + 1}:`, {
						title: title.substring(0, 50),
						price,
						image: image ? "Found" : "Missing",
						imageLink: imageLink ? "Found" : "Missing",
						seller,
						condition,
						shipping,
						location,
						link: link ? "Found" : "Missing",
					});
				}

				// Enhanced validation - be more lenient
				if (!title && !price) {
					console.log(
						`Skipping product ${index + 1}: No title AND no price found`
					);
					return;
				}

				// If we have either title or price, try to extract more info
				if (!title || title.length < 2) {
					console.log(
						`Warning: Product ${index + 1} has weak title: "${title}"`
					);
				}
				if (!price) {
					console.log(`Warning: Product ${index + 1} has no price found`);
				}

				// Extract watchers count with improved parsing
				let watchers: number | undefined;
				const hotnessText = $item
					.find(".s-item__hotness, [class*='watching'], [class*='hotness']")
					.text()
					.trim();
				if (hotnessText) {
					const watchingMatch = hotnessText.match(
						/(\d+)\s*(?:people\s+)?watching/i
					);
					if (watchingMatch) {
						watchers = parseInt(watchingMatch[1], 10);
					}
				}

				// Extract additional metadata
				const bids = extractBidsCount($item);
				const timeLeft = extractTimeLeft($item);
				const buyItNow =
					$item.find('[class*="buy-it-now"], [class*="bin"]').length > 0;
				const bestOffer =
					$item.find('[class*="best-offer"], [class*="obo"]').length > 0;

				// Create product object with fallbacks for missing data
				const product: ScrapedProduct = {
					title: title || "Unknown Product",
					price: price || "Price not available",
					image,
					imageLink,
					seller,
					condition,
					shipping,
					location,
					link,
					watchers,
					bids,
					timeLeft,
					buyItNow,
					bestOffer,
				};

				products.push(product);
				console.log(`Added product ${index + 1}: ${title.substring(0, 50)}`);
			} catch (itemError) {
				console.error(`Error processing product ${index + 1}:`, itemError);
				// Continue processing other items
			}
		});

		console.log(
			`Successfully extracted ${products.length} products from HTML content`
		);
		return products.slice(0, 60); // Limit to 60 products for pagination
	} catch (error) {
		console.error("Error parsing HTML content with Cheerio:", error);
		return [];
	}
}

// Helper function to extract text with multiple selector fallbacks
function extractTextWithFallbacks($element: any, selectors: string[]): string {
	for (const selector of selectors) {
		const text = $element.find(selector).first().text().trim();
		if (text && text.length > 0) {
			return text;
		}
	}
	return "";
}

// Helper function to extract attributes with multiple selector fallbacks
function extractAttributeWithFallbacks(
	$element: any,
	attribute: string,
	selectors: string[]
): string {
	for (const selector of selectors) {
		const attrValue = $element.find(selector).first().attr(attribute);
		if (attrValue && attrValue.length > 0) {
			return attrValue;
		}
	}
	return "";
}

// Helper function to extract bids count
function extractBidsCount($item: any): number | undefined {
	const bidsText = $item
		.find("[class*='bid'], .bids, [class*='auction']")
		.text()
		.trim();
	if (bidsText) {
		const bidMatch = bidsText.match(/(\d+)\s*bid/i);
		if (bidMatch) {
			return parseInt(bidMatch[1], 10);
		}
	}
	return undefined;
}

// Helper function to extract time left
function extractTimeLeft($item: any): string | undefined {
	const timeText = $item
		.find("[class*='time'], .time-left, [class*='ending']")
		.text()
		.trim();
	if (
		timeText &&
		(timeText.includes("d") || timeText.includes("h") || timeText.includes("m"))
	) {
		return timeText;
	}
	return undefined;
}
