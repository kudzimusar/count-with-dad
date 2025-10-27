# Count to 100 - Kids Learning App

An interactive counting app designed for children ages 3-7 to learn numbers 1-100 through fun activities, games, and educational challenges.

## About This Project

Count to 100 is a Progressive Web App (PWA) that makes learning to count engaging and enjoyable for young learners. With colorful visuals, interactive games, and progress tracking, children can develop number recognition and counting skills at their own pace.

## Features

### Learning Activities
- **Counting Mode**: Three difficulty levels (Order, Challenge, Free Play)
- **Puzzle Games**: Number-based puzzles to reinforce learning
- **Math Challenges**: Simple addition and subtraction exercises
- **Visual & Audio Feedback**: Sound effects and speech synthesis for interactive learning

### Parent Features
- **Progress Tracking**: Monitor your child's learning journey
- **Analytics Dashboard**: Detailed insights into learning patterns
- **Profile Management**: Customize learning experience
- **Resource Library**: Educational tips and activities

### Technical Features
- **Progressive Web App**: Install on any device for offline access
- **Responsive Design**: Works on phones, tablets, and desktops
- **Dark Mode Support**: Easy on the eyes for extended learning sessions
- **Cloud Sync**: Save progress across devices (requires account)

## Technologies Used

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn-ui components
- **Backend**: Supabase (authentication, database, analytics)
- **State Management**: TanStack Query
- **Routing**: React Router v6

## Getting Started

### Prerequisites
- Node.js 18+ and npm installed
- Git for version control

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kudzimusar/count-with-dad.git
cd count-with-dad
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials (see [SUPABASE_SETUP.md](SUPABASE_SETUP.md))

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:8080](http://localhost:8080) in your browser

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## Deployment

This app is currently deployed to GitHub Pages:
**Live URL**: [https://kudzimusar.github.io/count-with-dad/](https://kudzimusar.github.io/count-with-dad/)

### Deploy to GitHub Pages

1. Update the `base` in `vite.config.ts` to match your repo name
2. Build the project: `npm run build`
3. Deploy to GitHub Pages using your preferred method

## Project Structure

```
count-with-dad/
├── src/
│   ├── components/       # React components
│   │   ├── counting/    # Counting activity components
│   │   ├── math/        # Math challenge components
│   │   ├── puzzle/      # Puzzle game components
│   │   ├── parent/      # Parent dashboard components
│   │   └── ui/          # Reusable UI components (shadcn)
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Route pages
│   ├── utils/           # Utility functions
│   └── integrations/    # Supabase integration
├── public/              # Static assets
└── supabase/           # Database schemas and migrations
```

## Configuration

### Supabase Setup
For backend functionality (authentication, data persistence), follow the setup guide in [SUPABASE_SETUP.md](SUPABASE_SETUP.md).

### Environment Variables
Required environment variables in `.env`:
```env
VITE_SUPABASE_URL=https://supabase.com/dashboard/project/xtaeinfspztjzhplzcsw
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0YWVpbmZzcHp0anpocGx6Y3N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0Nzc0ODYsImV4cCI6MjA3NzA1MzQ4Nn0.SF30wRrZDjhDchANzUz5-Ar92fpOouAbTOiedZUb5iI
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or feature requests, please:
- Open an issue on GitHub
- Check the [TESTER_MANUAL.md](TESTER_MANUAL.md) for app usage guides

## Acknowledgments

- Built with modern web technologies
- UI components from shadcn-ui
- Icons from Lucide React
- Deployed on GitHub Pages

---

**Made with ❤️ for young learners**
