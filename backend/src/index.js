/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// CONSTANTS
const HACKATIME_URL = "https://hackatime.hackclub.com/api/v1/stats"
const FLAVOURTOWN_URL = "https://flavortown.hackclub.com/api/v1/projects/3584/devlogs"

async function getHackatimeResponse(env){
	const apiKey = env.HACKATIME_API_KEY
	const url = HACKATIME_URL
	try{
		const response = await fetch(url,{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${apiKey}`,
			}
			
		})
		if(!response.ok){
			throw new Error(`Response status: ${response.status}`);
		}
		const result = await response.json()
		return result
	}
	catch (error){
		console.error(error.message)	
		return {error: error.message}
	}
}

// TODO: UNCOMMENT IN PRODUCTION
async function getFlavourTownResponse(env){
	const apiKey = env.FLAVOURTOWN_API_KEY
	const url = FLAVOURTOWN_URL
	try{
		const response = await fetch(url,{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Authorization": apiKey,
			}
			
		})
		if(!response.ok){
			throw new Error(`Response status: ${response.status}`);
		}
		const result = await response.json()
		return result
	}
	catch (error){
		console.error(error.message)	
		return {error: error.message}
	}
}

// TODO: COMMENT OUT IN PRODUCTION

// const debugResponse = '{"devlogs":[{"id":5181,"body":"Added a button to toggle the snow effect (which is stored in local storage) and routing for different pages","comments_count":0,"duration_seconds":4186,"likes_count":0,"scrapbook_url":null,"created_at":"2026-01-01T19:18:38.477Z","updated_at":"2026-01-01T19:18:39.347Z"},{"id":5161,"body":"The header and footer of the webpage are now packed into custom HTML elements using the costumeElements.define function, which allows me to define an element that, in this case inherites the HTMLElement class, and expresses the HTML content packed within.","comments_count":0,"duration_seconds":3956,"likes_count":0,"scrapbook_url":null,"created_at":"2026-01-01T17:44:32.390Z","updated_at":"2026-01-01T17:44:33.372Z"},{"id":5103,"body":"I added the backend for the hackatime logs (so I can safely fetch from the API without exposing the API Key. Currently ,I ran into issues with API authorization. I\'ve asked for help in Slack already :3","comments_count":0,"duration_seconds":3690,"likes_count":0,"scrapbook_url":null,"created_at":"2026-01-01T14:43:31.960Z","updated_at":"2026-01-01T14:43:32.746Z"},{"id":5070,"body":"Added A place for Hackatime logs, current iframe approach looks ugly tbh, I will be calling the hackatime API next so I can make it look better, but that requires a backend to prevent API key leaks... oof","comments_count":0,"duration_seconds":3237,"likes_count":0,"scrapbook_url":null,"created_at":"2026-01-01T12:23:47.658Z","updated_at":"2026-01-01T12:23:48.492Z"},{"id":5059,"body":"Added the home page and a single card, also added the header, and the navbar & title within it. The website is responsive, e.g the PFP moved up to the header on phone view, but in the card component on a landscape (computer view)","comments_count":0,"duration_seconds":8666,"likes_count":0,"scrapbook_url":null,"created_at":"2026-01-01T11:17:35.949Z","updated_at":"2026-01-01T11:17:36.668Z"}],"pagination":{"current_page":1,"total_pages":1,"total_count":5,"next_page":null}}'
// async function getFlavourTownResponse(env){
// 	return JSON.parse(debugResponse)
// }






export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url)

		// CORS Headers
		const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		}

		// Handle preflight OPTIONS request
		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders })
		}

		if (url.pathname === "/api/v1/hackatime"){
			const data = await getHackatimeResponse(env);
			return Response.json(data, { headers: corsHeaders });
		}
		else if (url.pathname === "/api/v1/flavourtown"){
			const data = await getFlavourTownResponse(env);
			return Response.json(data, { headers: corsHeaders });
		}
		else{
			return new Response(`Cannot GET from URL ${url.pathname}`, { headers: corsHeaders })
		}
		
	},
};
