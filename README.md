# Architect Landing Page

A beautiful, minimalist landing page for architectural firms with admin management capabilities.

## Features

✨ **Modern Design**
- Minimalist layout with beautiful gradients
- Parallax scrolling effects
- Mobile-first responsive design
- Smooth animations with Framer Motion

🔐 **Authentication**
- Google OAuth integration
- Secure admin access
- Session management with NextAuth.js

🛠️ **Content Management**
- Easy-to-use admin dashboard
- Visual color theme customizer
- Project portfolio management
- AI-powered content suggestions with Gemini

🎨 **Tech Stack**
- Next.js 15 with React 19
- TypeScript for type safety
- Tailwind CSS for styling
- shadcn/ui components
- PostgreSQL database
- Prisma ORM
- Framer Motion for animations

## Quick Start

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Google OAuth credentials
- Gemini API key (optional)

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
Create a `.env` file with:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/architect_landing?schema=public"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Gemini AI (optional)
GEMINI_API_KEY="your-gemini-api-key"
```

3. **Set up the database:**
```bash
npx prisma generate
npx prisma db push
```

4. **Run the development server:**
```bash
npm run dev
```

Visit `http://localhost:3000` to see your site!

## Configuration

### Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized origins
6. Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs

### Database Setup

The project uses PostgreSQL with Prisma. The schema includes:
- User authentication tables
- Site configuration settings
- Project portfolio data
- Content management

### Gemini AI (Optional)

For AI-powered content suggestions:
1. Get an API key from [Google AI Studio](https://aistudio.google.com/)
2. Add it to your `.env` file
3. The AI features will automatically enable

## Admin Panel

Access the admin panel at `/admin` after signing in with Google.

**Features:**
- **Content Editor**: Manage homepage text with AI suggestions
- **Color Customizer**: Customize brand colors and gradients
- **Project Manager**: Add/edit portfolio projects

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS
- Google Cloud

## Customization

### Colors & Branding

Use the admin panel to customize:
- Primary/secondary colors
- Gradient combinations
- Brand elements

### Content

All text content can be managed through the admin interface:
- Hero section text
- Service descriptions
- Project details

### Styling

The project uses Tailwind CSS. Key files:
- `src/app/globals.css` - Global styles and CSS variables
- `tailwind.config.js` - Tailwind configuration
- Component files use Tailwind classes

## License

MIT License - feel free to use for commercial projects!

---

Built with ❤️ for architects and design professionals.
