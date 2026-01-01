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

async function getHackatimeResponse(env){
	const apiKey = env.HACKATIME_API_KEY
	const url = HACKATIME_URL + "?api_key=" + apiKey
	try{
		const response = await fetch(url)
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
export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url)

		if (url.pathname === "/api/v1/hackatime"){
			const data = await getHackatimeResponse(env);
			return new Response(JSON.stringify(data));
		}
		else{
			return new Response("Cannot GET from URL")
		}
		
	},
};
