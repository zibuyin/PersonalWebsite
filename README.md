# My Personal Website ![Hackatime](https://hackatime-badge.hackclub.com/U08HYM19NJE/PersonalWebsite)

A full-stack personal portfolio website built with vanilla JavaScript and Cloudflare Workers, featuring an interactive messaging system with enterprise-grade security _(Ok maybe not quite enterprise-grade, thats hyperbole)_.

## Features

### Frontend

- **Responsive Design**: Mobile-first CSS with custom theming
- **Dynamic Project Showcase**: Markdown-powered project pages with metadata
- **Interactive Message Board**: Real-time message display with automatic refresh
- **Custom Web Components**: Reusable header, footer, and card components
- **Snow Animation**: CSS-based seasonal effects

### Messaging System

- **Google reCAPTCHA Enterprise**: Invisible v3 CAPTCHA with risk scoring (0.9 threshold)
- **Rate Limiting**: IP-based limiting (1 message per 5 minutes) with countdown timer
- **Email Notifications**: Cloudflare Email Workers integration with custom domain
- **Real-time Feedback**: Toast notifications for success/error states
- **Data Validation**: Content validation, optional name/contact fields
- **Persistence**: LocalStorage-backed rate limit tracking across page reloads
- **Debug Mode**: Bypass rate limiting for testing with `author="debug"`

### Backend (Cloudflare Workers)

- **RESTful API**: Message CRUD operations with CORS support
- **D1 Database**: SQLite-based storage for messages and rate limits
- **reCAPTCHA Validation**: Server-side token verification via Google Assessment API
- **Email Integration**: Automated notifications via Cloudflare Email Send API
- **Security**: IP hashing, salted storage, request validation
- **Analytics**: Unique visitor tracking with privacy-focused design

## Technology Stack

**Frontend**

- HTML5, CSS3, Vanilla JavaScript
- MD-Block for Markdown rendering
- Google reCAPTCHA Enterprise
- Font Awesome icons

**Backend**

- Cloudflare Workers (Serverless)
- Cloudflare D1 (SQLite)
- Cloudflare Email Workers
- Node.js compatibility mode

**Deployment**

- Frontend: GitHub Pages
- Backend: Cloudflare Workers
- Database: Cloudflare D1

## Project Structure

```
PersonalWebsite/
├── index.html                 # Homepage
├── frontend/
│   ├── components/           # Web components (header, footer, cards)
│   ├── pages/               # HTML pages (about, contacts, projects)
│   ├── scripts/             # JavaScript modules
│   └── styles/              # CSS stylesheets
└── backend/
    ├── src/index.js         # Cloudflare Worker API
    ├── wrangler.toml        # Worker configuration
    └── test/               # API tests
```

## Database Schema

```sql
-- Messages
tbl_messages (
  message_content TEXT,
  message_author TEXT,
  message_date TEXT
)

-- Rate Limiting
tbl_rate_limits (
  ip_hash TEXT PRIMARY KEY,
  last_request TEXT
)
```

## API Endpoints

- `PUT /api/v1/leaveMessage` - Submit new message (with reCAPTCHA token)
- `GET /api/v1/messages` - Retrieve all messages
- `PUT /posts/uniqueVisitor` - Track unique visitors
- `GET /api/v1/hackatime` - Hackatime integration

## Setup & Deployment

### Backend

```bash
cd backend
npm install
npm run deploy  # Deploy to Cloudflare Workers
```

### Environment Variables

Configure in Cloudflare Workers dashboard or via `wrangler secret put`:

- `RECAPTCHA_PROJECT_ID`
- `RECAPTCHA_API_KEY`
- `RECAPTCHA_SITE_KEY`

### Frontend

Hosted on GitHub Pages. Push to `main` branch to deploy.

## Key Features Implementation

### Rate Limiting

- IP addresses are hashed with a salt before storage
- D1 database tracks last request timestamp per IP
- 5-minute cooldown enforced server-side
- Client-side countdown timer with localStorage persistence

### reCAPTCHA Enterprise

- Token generated on button click (invisible CAPTCHA)
- Server validates token with Google Assessment API
- Risk score threshold prevents bot submissions
- No user interaction required for legitimate users

### Email Notifications

- Triggered on successful message submission
- Sent from verified domain: `auto-mail@nathanyin.com`
- Includes sender name, content, timestamp, and optional contact info

## TODO

- [ ] Enhanced project display (highlighting, featured cards)
- [ ] Custom 404 page
- [ ] Individual project view counters
- [ ] Dark/light theme toggle
- [ ] Search functionality
- [ ] Project tagging system

## Dependencies

- [md-block](https://md-block.verou.me/) - Markdown rendering
- [Snow Effect](https://codepen.io/keithclark/pen/DjXzBw) - CSS snow animation
- [Font Awesome](https://fontawesome.com/) - Icon library
- [Google reCAPTCHA Enterprise](https://cloud.google.com/recaptcha-enterprise) - Bot protection

## License

Personal project. Code available for educational purposes.

## Contact

Visit the [contacts page](https://natdrone101.github.io/PersonalWebsite/frontend/pages/contacts.html) to leave a message.
