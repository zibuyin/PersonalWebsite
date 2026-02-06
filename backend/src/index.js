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
const HACKATIME_URL = "https://hackatime.hackclub.com/api/v1"
const FLAVOURTOWN_URL = "https://flavortown.hackclub.com/api/v1/projects/3584/devlogs"
import { EmailMessage } from "cloudflare:email";
import { createMimeMessage } from "mimetext";


async function getHackatimeResponse(urlRequest,env){
	const apiKey = env.HACKATIME_API_KEY
	const url = `${HACKATIME_URL}${urlRequest}`;
	console.log(url)
	try{
		const response = await fetch(url,{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${env.HACKATIME_API_KEY}`
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
// async function getFlavourTownResponse(env){
// 	const apiKey = env.FLAVOURTOWN_API_KEY
// 	const url = FLAVOURTOWN_URL
// 	try{
// 		const response = await fetch(url,{
// 			method: "GET",
// 			headers: {
// 				"Content-Type": "application/json",
// 				"Authorization": apiKey,
// 			}
			
// 		})
// 		if(!response.ok){
// 			throw new Error(`Response status: ${response.status}`);
// 		}
// 		const result = await response.json()
// 		return result
// 	}
// 	catch (error){
// 		console.error(error.message)	
// 		return {error: error.message}
// 	}
// }

// TODO: COMMENT OUT IN PRODUCTION

const debugResponse = '{"devlogs":[{"id":5181,"body":"Added a button to toggle the snow effect (which is stored in local storage) and routing for different pages","comments_count":0,"duration_seconds":4186,"likes_count":0,"scrapbook_url":null,"created_at":"2026-01-01T19:18:38.477Z","updated_at":"2026-01-01T19:18:39.347Z"},{"id":5161,"body":"The header and footer of the webpage are now packed into custom HTML elements using the costumeElements.define function, which allows me to define an element that, in this case inherites the HTMLElement class, and expresses the HTML content packed within.","comments_count":0,"duration_seconds":3956,"likes_count":0,"scrapbook_url":null,"created_at":"2026-01-01T17:44:32.390Z","updated_at":"2026-01-01T17:44:33.372Z"},{"id":5103,"body":"I added the backend for the hackatime logs (so I can safely fetch from the API without exposing the API Key. Currently ,I ran into issues with API authorization. I\'ve asked for help in Slack already :3","comments_count":0,"duration_seconds":3690,"likes_count":0,"scrapbook_url":null,"created_at":"2026-01-01T14:43:31.960Z","updated_at":"2026-01-01T14:43:32.746Z"},{"id":5070,"body":"Added A place for Hackatime logs, current iframe approach looks ugly tbh, I will be calling the hackatime API next so I can make it look better, but that requires a backend to prevent API key leaks... oof","comments_count":0,"duration_seconds":3237,"likes_count":0,"scrapbook_url":null,"created_at":"2026-01-01T12:23:47.658Z","updated_at":"2026-01-01T12:23:48.492Z"},{"id":5059,"body":"Added the home page and a single card, also added the header, and the navbar & title within it. The website is responsive, e.g the PFP moved up to the header on phone view, but in the card component on a landscape (computer view)","comments_count":0,"duration_seconds":8666,"likes_count":0,"scrapbook_url":null,"created_at":"2026-01-01T11:17:35.949Z","updated_at":"2026-01-01T11:17:36.668Z"}],"pagination":{"current_page":1,"total_pages":1,"total_count":5,"next_page":null}}'
async function getFlavourTownResponse(env){
	return JSON.parse(debugResponse)
}

   

async function hashString(inputString, salt) {
    const encoder = new TextEncoder();
	// Inject the Salt... (tasty :3)
	inputString = salt + inputString
    const data = encoder.encode(inputString); 
    const hashBuffer = await crypto.subtle.digest('SHA-256', data); 
    const hashArray = Array.from(new Uint8Array(hashBuffer)); 
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join(''); 

    return hashHex;
}

async function handleUniqueUser(request, env){
	const ip = request.headers.get("CF-Connecting-IP") || "127.0.0.1"
	const SALT = env.ENC_SALT
	const hash = (await hashString(ip, SALT)).toString();
	// const hash = ip DEBUG ONLY, MUST REMOVE IN PRODUCTION
	try {
		await env.DB
			.prepare(
				"INSERT OR IGNORE INTO tbl_visitors (ip_hash) VALUES (?);"
			)
			.bind(hash)
			.run()

		const { results } = await env.DB
			.prepare(
				"SELECT COUNT(DISTINCT ip_hash) AS unique_visitors_count FROM tbl_visitors"
			)
			.run()
		return {uniqueVisitors: results[0].unique_visitors_count}
	}
	catch (error){
		return {error: error.message};
	}
				
}
async function getMessages(env) {
	try{		
		const { results } = await env.DB
			.prepare(
				"SELECT message_content, message_author, message_date FROM tbl_messages ORDER BY message_date DESC"
			)
			.run()
		return { messages: results }
	}
	catch (error){
		return {error: error.message};
	}
		
}
async function validateRecaptchaToken(env, token) {
	const projectId = env.RECAPTCHA_PROJECT_ID;
	const apiKey = env.RECAPTCHA_API_KEY;
	const siteKey = env.RECAPTCHA_SITE_KEY;
	
	try {
		const response = await fetch(
			`https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments?key=${apiKey}`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					event: {
						token: token,
						expectedAction: 'submit',
						siteKey: siteKey
					}
				})
			}
		);
		
		const result = await response.json();
		console.log('reCAPTCHA Assessment Full Response:', JSON.stringify(result));
		
		// Check if the API call was successful
		if (!response.ok) {
			console.error('Google API Error:', result);
			return { valid: false, error: 'Google API returned error', details: result };
		}
		
		// Return true if valid, false otherwise
		if (result.riskAnalysis) {
			console.log('Risk Score:', result.riskAnalysis.score);
			return {
				valid: true,
				score: result.riskAnalysis.score,
				reasons: result.riskAnalysis.reasons
			};
		}
		
		console.log('No riskAnalysis in response');
		return { valid: false, error: 'No riskAnalysis in response', details: result };
	} catch (error) {
		console.error('reCAPTCHA validation error:', error.message);
		console.error('Full error:', error);
		return { valid: false, error: error.message };
	}
}

async function handleMessageSending(env, content, author, captchaToken){
	const date = new Date().toJSON()
	
	// Validate reCAPTCHA token first
	if (captchaToken) {
		const validation = await validateRecaptchaToken(env, captchaToken);
		console.log('Token validation result:', validation);
		
		if (!validation.valid) {
			return { error: 'CAPTCHA validation failed', details: validation };
		}
	} else {
		return { error: 'CAPTCHA token is required' };
	}
	
	try {
		await env.DB
			.prepare(
				"INSERT INTO tbl_messages (message_content, message_author, message_date) VALUES (?, ?, ?)"
			)
			.bind(content, author, date)
			.run()
		return { ok: true }
	}
	catch (error){
		return {error: error.message}
	}
}

// TODO
// async function handleFileNameArray(array){

// }


export default {
	async fetch(request, env, ctx) {
		let url;
		try {
			url = new URL(request.url || "");
		} catch (err) {
			return new Response("Invalid request URL", { status: 400 });
		}
		// CORS Headers
		const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT',
			'Access-Control-Allow-Headers': 'Content-Type',
		}

		// Handle preflight OPTIONS request
		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders })
		}

		// Handle PUT requests
		// Hash the IP addr and store it in SQL to count unique visitors
		if (request.method === "PUT"){
			if (url.pathname.includes("posts/uniqueVisitor")){
				const result = await handleUniqueUser(request, env);
				return Response.json(result, {
					headers: {
						...corsHeaders,
						'Content-Type': 'application/json'
					}
				});
			}
			else if (url.pathname.includes("/api/v1/leaveMessage")){
				try {
					const content = url.searchParams.get("content") || ""
					const author = url.searchParams.get("author") || ""
					const captchaToken = url.searchParams.get("captchaToken") || ""
					const result = await handleMessageSending(env, content, author, captchaToken)
					return Response.json(result ?? { ok: true }, {
						headers: {
							...corsHeaders,
							'Content-Type': 'application/json'
						}
					})
				} catch (error) {
					return Response.json({ error: error.message }, {
						status: 500,
						headers: {
							...corsHeaders,
							'Content-Type': 'application/json'
						}
					})
				}
			}

			// TODO
			// else if(url.pathname.includes("posts/fileNameArray")){
			// 	const { array } = await request.json()
			// 	const result = await handleProjectViews()
			// 	return Response.json(result, {
			// 		headers: {
			// 		...corsHeaders,
			// 		'Content-Type': 'application/json'
			// 		}
			// 	})
			// }
		}
		
		if (url.pathname && url.pathname.includes("/api/v1/hackatime")){
			const parsedURL = (url.pathname || "").replace("/api/v1/hackatime", "")
			console.log(parsedURL)
			const data = await getHackatimeResponse(parsedURL, env);
			return Response.json(data, { headers: corsHeaders });
		}
		else if (url.pathname === "/api/v1/flavourtown"){
			const data = await getFlavourTownResponse(env);
			return Response.json(data, { headers: corsHeaders });
		}
		else if (url.pathname === "/api/v1/messages"){
			const data = await getMessages(env);
			return Response.json(data, { headers: corsHeaders });
		}
			
			// return Response(result, {
			// 	headers: {
			// 	...corsHeaders,
			// 	'Content-Type': 'application/json'
			// }});
			// const result = await handleEmailSending(request, env);
			// return result || new Response("Email sent", { headers: corsHeaders });
		else{
			return new Response(`Cannot GET from URL ${url.pathname}`, { headers: corsHeaders })
		}
		
		
	},
};




// async function debugTestEmail(env) {
// 	const senderAddr = env.EMAIL_SENDER || "auto-mail@nathanyin.com";
// 	const recipientAddr = env.EMAIL_RECIPIENT || "natdrone101@gmail.com";

// 	const msg = createMimeMessage();
// 	msg.setSender({ name: "GPT-4", addr: senderAddr });
// 	msg.setRecipient(recipientAddr);
// 	msg.setSubject("An email generated in a worker");
// 	msg.addMessage({
// 		contentType: "text/plain",
// 		data: `Congratulations, you just sent an email from a worker.`,
// 	});

// 	// Envelope must match headers to satisfy SPF/DMARC
// 	const message = new EmailMessage(
// 		senderAddr,
// 		recipientAddr,
// 		msg.asRaw(),
// 	);
// 	try {
// 		await env.emailWorker.send(message);
// 	} catch (e) {
// 		return new Response(e.message);
// 	}

// 	return new Response("Hello Send Email World!");
// }