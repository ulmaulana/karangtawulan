# Karangtawulan

Aplikasi web modern untuk pengelolaan wisata Karangtawulan, dibangun dengan Next.js 15, complete authentication, database integration, AI chat assistant, dan admin dashboard.

## Tech Stack

### Frontend
- **Framework:** [Next.js 15.5.0](https://nextjs.org/) (App Router with Turbopack)
- **Language:** TypeScript 5
- **UI Library:** React 19.1.0
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Theme System:** [next-themes](https://github.com/pacocoursey/next-themes)
- **Icons:** [Lucide React](https://lucide.dev/) + [Tabler Icons](https://tabler-icons.io/)
- **Animation:** [Framer Motion 12](https://www.framer.com/motion/)
- **Form Management:** [React Hook Form](https://react-hook-form.com/) + [Zod 4](https://zod.dev/)

### Backend & Database
- **Authentication:** [Better Auth 1.3.7](https://better-auth.com/)
- **Database:** PostgreSQL with [Drizzle ORM 0.44.5](https://orm.drizzle.team/)
- **Backend Services:** [Supabase](https://supabase.com/)

### AI & Features
- **AI Integration:** Google Generative AI (Gemini)
- **Drag & Drop:** @dnd-kit
- **Data Tables:** @tanstack/react-table
- **Charts:** Recharts
- **Carousel:** Embla Carousel
- **Notifications:** Sonner

### DevOps
- **Containerization:** Docker & Docker Compose
- **Build Tool:** Turbopack
- **Linting:** ESLint
- **Database Migrations:** Drizzle Kit

## Prerequisites

Before you begin, ensure you have the following:
- Node.js 18+ installed
- Docker and Docker Compose (for database setup)
- Google Gemini API Key (untuk AI chat assistant)
- Supabase account (untuk storage dan database)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd karangtawulan
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Variables Setup**
   - Copy the `.env.example` file to `.env`:
     ```bash
     cp .env.example .env
     ```
   - The default values work with Docker setup, modify as needed

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.**

## Configuration

### Option 1: Docker Setup (Recommended)
1. **Start PostgreSQL with Docker:**
   ```bash
   npm run db:up
   ```
   This starts PostgreSQL in a Docker container with default credentials.

2. **Push database schema:**
   ```bash
   npm run db:push
   ```

### Option 2: Local Database Setup
1. Create a PostgreSQL database locally
2. Update your environment variables in `.env`:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name
   POSTGRES_DB=your_database_name
   POSTGRES_USER=your_username
   POSTGRES_PASSWORD=your_password
   ```
3. Run database migrations:
   ```bash
   npm run db:push
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration (defaults work with Docker)
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/postgres
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Authentication
BETTER_AUTH_SECRET=your_secret_key_here
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Configuration
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
```

## Features

### Core Features
- 🔐 **Authentication** - Better Auth dengan email/password
- 🗄️ **Database** - PostgreSQL dengan Drizzle ORM (type-safe)
- 🎨 **UI Components** - 40+ shadcn/ui components + Radix UI primitives
- 🌙 **Dark Mode** - System preference detection dengan smooth transitions
- 📱 **Responsive Design** - Mobile-first dengan TailwindCSS v4

### Pages & Modules
- 🏠 **Landing Page** - Modern hero section dengan feature grid
- 🏨 **Akomodasi** - Pengelolaan dan booking akomodasi
- 📦 **Paket Wisata** - Katalog paket wisata
- 🖼️ **Galeri** - Photo gallery dengan lightbox
- 💬 **AI Chat Assistant** - Chatbot dengan Google Gemini
- 👤 **User Dashboard** - Profile dan booking management

### Admin Panel
- 📊 **Dashboard** - Analytics dan overview
- 🏨 **Accommodations Management** - CRUD akomodasi
- 📦 **Accessories Management** - CRUD aksesoris/fasilitas
- 🖼️ **Gallery Management** - Upload dan kelola foto
- 🔧 **Drag & Drop** - Reorder items dengan @dnd-kit
- 📈 **Data Tables** - Sortable, filterable dengan TanStack Table

### Technical Features
- 🚀 **App Router** - Server Components & Turbopack
- 🎯 **Type Safety** - Full TypeScript dengan Zod validation
- 🔒 **Secure** - Environment variables, secure auth patterns
- 🐳 **Docker** - Multi-stage builds, production-ready
- 🤖 **AI Integration** - Google Gemini untuk AI chat assistant
- 📝 **Form Management** - React Hook Form dengan validation
- 🎭 **Animations** - Framer Motion untuk smooth transitions
- 🎨 **Modern UI** - Duna Ocean Theme, minimalist design

## Project Structure

```
karangtawulan/
├── app/                            # Next.js app router
│   ├── akomodasi/                 # Halaman akomodasi
│   ├── api/                       # API routes
│   │   ├── auth/                  # Authentication endpoints
│   │   └── chat/                  # AI chat endpoints
│   ├── dashboard/                 # User dashboard
│   │   ├── accessories/          # Admin: Kelola aksesoris
│   │   ├── accommodations/       # Admin: Kelola akomodasi
│   │   ├── gallery/              # Admin: Kelola galeri
│   │   └── ...                   # Other admin modules
│   ├── galeri/                    # Halaman galeri publik
│   ├── paket/                     # Halaman paket wisata
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/                    # React components
│   ├── landing/                  # Landing page components
│   ├── sections/                 # Page sections (hero, cta, etc)
│   ├── ui/                       # shadcn/ui components (40+)
│   ├── admin-sidebar.tsx         # Admin navigation
│   ├── chat-assistant.tsx        # AI chat component
│   ├── navbar.tsx                # Main navigation
│   └── ...                       # Other components
├── db/                            # Database
│   ├── schema/                   # Drizzle schemas
│   │   ├── auth.ts              # Auth tables
│   │   └── karangtawulan.ts     # App tables
│   └── index.ts                  # DB connection
├── docker/                        # Docker configs
│   └── postgres/                 # PostgreSQL init scripts
├── documentation/                 # Project docs
├── drizzle/                       # Database migrations
├── hooks/                         # Custom React hooks
├── lib/                           # Utilities
│   ├── auth.ts                   # Better Auth config
│   ├── auth-client.ts            # Auth client
│   ├── seo.ts                    # SEO utilities
│   ├── site.ts                   # Site config
│   └── utils.ts                  # Helper functions
├── public/                        # Static assets
├── scripts/                       # Database & utility scripts
├── supabase/                      # Supabase SQL schemas
├── docker-compose.yaml           # Docker services
├── Dockerfile                    # App container
├── drizzle.config.ts             # Drizzle config
└── components.json               # shadcn/ui config
```

## Database Integration

This starter includes modern database integration:

- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** as the database provider
- **Better Auth** integration with Drizzle adapter
- **Database migrations** with Drizzle Kit

## Development Commands

### Application
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Database
- `npm run db:up` - Start PostgreSQL in Docker
- `npm run db:down` - Stop PostgreSQL container
- `npm run db:dev` - Start development PostgreSQL (port 5433)
- `npm run db:dev-down` - Stop development PostgreSQL
- `npm run db:push` - Push schema changes to database
- `npm run db:generate` - Generate Drizzle migration files
- `npm run db:migrate` - Run migrations
- `npm run db:studio` - Open Drizzle Studio (database GUI)
- `npm run db:reset` - Reset database (drop all tables and recreate)
- `npm run db:apply` - Apply schema to Supabase
- `npm run db:ls` - List all tables
- `npm run db:seed` - Seed database with sample data

### Styling with shadcn/ui
- Pre-configured with 40+ shadcn/ui components in New York style
- Components are fully customizable and use CSS variables for theming
- Automatic dark mode support with next-themes integration
- Add new components: `npx shadcn@latest add [component-name]`

### Docker
- `npm run docker:build` - Build application Docker image
- `npm run docker:up` - Start full application stack (app + database)
- `npm run docker:down` - Stop all containers
- `npm run docker:logs` - View container logs
- `npm run docker:clean` - Stop containers and clean up volumes

## Docker Development

### Quick Start with Docker
```bash
# Start the entire stack (recommended for new users)
npm run docker:up

# View logs
npm run docker:logs

# Stop everything
npm run docker:down
```

### Development Workflow
```bash
# Option 1: Database only (develop app locally)
npm run db:up          # Start PostgreSQL
npm run dev            # Start Next.js development server

# Option 2: Full Docker stack
npm run docker:up      # Start both app and database
```

### Docker Services

The `docker-compose.yml` includes:

- **postgres**: Main PostgreSQL database (port 5432)
- **postgres-dev**: Development database (port 5433) - use `--profile dev`
- **app**: Next.js application container (port 3000)

### Docker Profiles

```bash
# Start development database on port 5433
docker-compose --profile dev up postgres-dev -d

# Or use the npm script
npm run db:dev
```

## Deployment

### Production Deployment

#### Option 1: Docker Compose (VPS/Server)

1. **Clone and setup on your server:**
   ```bash
   git clone <your-repo>
   cd codeguide-starter-fullstack
   cp .env.example .env
   ```

2. **Configure environment variables:**
   ```bash
   # Edit .env with production values
   DATABASE_URL=postgresql://postgres:your_secure_password@postgres:5432/postgres
   POSTGRES_DB=postgres
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your_secure_password
   BETTER_AUTH_SECRET=your-very-secure-secret-key
   BETTER_AUTH_URL=https://yourdomain.com
   NEXT_PUBLIC_BETTER_AUTH_URL=https://yourdomain.com
   ```

3. **Deploy:**
   ```bash
   npm run docker:up
   ```

#### Option 2: Container Registry (AWS/GCP/Azure)

1. **Build and push image:**
   ```bash
   # Build the image
   docker build -t your-registry/codeguide-starter-fullstack:latest .
   
   # Push to registry
   docker push your-registry/codeguide-starter-fullstack:latest
   ```

2. **Deploy using your cloud provider's container service**

#### Option 3: Vercel + External Database

1. **Deploy to Vercel:**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Add environment variables in Vercel dashboard:**
   - `DATABASE_URL`: Your managed PostgreSQL connection string
   - `BETTER_AUTH_SECRET`: Generate a secure secret
   - `BETTER_AUTH_URL`: Your Vercel deployment URL

3. **Setup database:**
   ```bash
   # Push schema to your managed database
   npm run db:push
   ```

### Environment Variables for Production

```env
# Required for production
DATABASE_URL=postgresql://user:password@host:port/database
BETTER_AUTH_SECRET=generate-a-very-secure-32-character-key
BETTER_AUTH_URL=https://yourdomain.com

# Optional optimizations
NODE_ENV=production
```

### Production Considerations

- **Database**: Use managed PostgreSQL (AWS RDS, Google Cloud SQL, etc.)
- **Security**: Generate strong secrets, use HTTPS
- **Performance**: Enable Next.js output: 'standalone' for smaller containers
- **Monitoring**: Add logging and health checks
- **Backup**: Regular database backups
- **SSL**: Terminate SSL at load balancer or reverse proxy

### Health Checks

The application includes basic health checks. You can extend them:

```dockerfile
# In Dockerfile, add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1
```

## AI Chat Assistant

Aplikasi dilengkapi dengan AI chat assistant menggunakan Google Gemini AI:

### Setup
1. Dapatkan API key dari [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Tambahkan ke `.env`:
   ```env
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
   ```

### Features
- ✨ **Streaming responses** - Real-time response generation
- 💭 **Conversation history** - Context-aware chat dengan memory
- 🎯 **Smart responses** - Powered by Gemini 1.5 Pro
- ⚡ **Fast & reliable** - Direct API integration
- 🛡️ **Error handling** - Graceful error management

### Usage
- Chat endpoint: `/api/chat`
- Component: `<ChatAssistant />` di `components/chat-assistant.tsx`
- Akses dari icon chat di navbar

## Documentation

Lihat folder `documentation/` untuk:
- `app_flow_document.md` - Application flow
- `frontend_guidelines_document.md` - Frontend guidelines
- `backend_structure_document.md` - Backend structure
- Dan lainnya

## Troubleshooting

Lihat `TROUBLESHOOTING.md` untuk solusi masalah umum.

## Theme

Aplikasi menggunakan **Duna Ocean Theme** - minimalist, modern, dengan color palette ocean-inspired. Lihat `DUNA-OCEAN-THEME.md` untuk detail.

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
