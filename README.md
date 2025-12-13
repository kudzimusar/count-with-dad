# Count to 100 - Kids Learning App

An interactive counting app designed for children ages 3-8 to learn numbers 1-100 through fun activities, games, and educational challenges.

## About This Project

Count to 100 (also known as "Counting Fun!") is a Progressive Web App (PWA) that makes learning to count engaging and enjoyable for young learners. Built by a dad and tested by real kids, this app focuses on practical understanding rather than just memorization. With colorful visuals, interactive games, and comprehensive progress tracking, children can develop number recognition and counting skills at their own pace.

**Key Principles:**
- Teaches practical understanding, not just memorization
- Grows with your child (Ages 3-8)
- Minimizes distractions with a clean, focused interface
- COPPA compliant - No ads, no in-app purchases
- Built by a dad, tested by real kids

## Features

### Learning Activities
- **Counting Mode**: Three difficulty levels
  - **Count in Order**: Tap numbers sequentially (1, 2, 3...)
  - **Number Challenge**: Find specific numbers called out
  - **Free Play**: Explore numbers freely without rules
- **Puzzle Games**: Number-based puzzles to reinforce learning with progressive difficulty levels
- **Math Challenges**: Simple addition and subtraction exercises with age-appropriate difficulty
- **Visual & Audio Feedback**: Sound effects and speech synthesis for interactive learning
- **Star Rewards System**: Earn stars for completing activities and challenges

### Parent Features
- **Parent Zone**: Secure access with parent gate (code: 5829)
- **Progress Tracking**: Monitor your child's learning journey with detailed session history
- **Analytics Dashboard**: Detailed insights into learning patterns, charts, and trends
- **Profile Management**: Customize child's name, age, avatar, and daily learning goals
- **Account Management**: Optional account creation for cloud sync across devices
- **Progress Export**: Export progress data as JSON file
- **Resource Library**: Educational tips and activities

### Technical Features
- **Progressive Web App**: Install on any device for offline access
- **Responsive Design**: Works seamlessly on phones, tablets, and desktops
- **Dark Mode Support**: Easy on the eyes for extended learning sessions
- **Cloud Sync**: Save progress across devices (requires account)
- **Guest Mode**: Full access to free features without creating an account
- **Premium Features**: Subscription-based advanced features (optional)

## Technologies Used

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5 with React SWC plugin
- **Styling**: Tailwind CSS + shadcn-ui components (Radix UI primitives)
- **Backend**: Supabase (authentication, database, analytics)
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Form Handling**: React Hook Form + Zod validation
- **Charts**: Recharts for analytics visualization
- **Icons**: Lucide React
- **Notifications**: Sonner (toast notifications)
- **Theming**: next-themes for dark mode support

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

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:8080](http://localhost:8080) in your browser

### Available Scripts

- `npm run dev` - Start development server on port 8080
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

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
│   ├── components/          # React components
│   │   ├── counting/       # Counting activity components
│   │   │   ├── ChallengeDisplay.tsx
│   │   │   ├── CountingGrid.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── ScrollIndicator.tsx
│   │   ├── math/           # Math challenge components
│   │   │   └── MathScreen.tsx
│   │   ├── puzzle/         # Puzzle game components
│   │   │   └── PuzzleScreen.tsx
│   │   ├── parent/         # Parent dashboard components
│   │   │   ├── ParentDashboard.tsx
│   │   │   ├── AnalyticsTab.tsx
│   │   │   ├── ProgressTab.tsx
│   │   │   ├── ProfileTab.tsx
│   │   │   ├── AccountTab.tsx
│   │   │   ├── SettingsTab.tsx
│   │   │   ├── ResourcesTab.tsx
│   │   │   └── SubscriptionTab.tsx
│   │   ├── layout/         # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── MenuPanel.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── WebsiteHeader.tsx
│   │   │   └── WebsiteFooter.tsx
│   │   ├── modals/         # Modal components
│   │   │   ├── ParentGate.tsx
│   │   │   ├── PremiumGate.tsx
│   │   │   ├── CelebrationModal.tsx
│   │   │   └── SuccessModal.tsx
│   │   ├── onboarding/     # Onboarding components
│   │   ├── feedback/       # Feedback components
│   │   └── ui/             # Reusable UI components (shadcn)
│   ├── hooks/              # Custom React hooks
│   │   ├── useAnalytics.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useSound.ts
│   │   ├── useSpeech.ts
│   │   ├── useSupabaseAuth.ts
│   │   └── useSupabaseData.ts
│   ├── pages/              # Route pages
│   │   ├── Home.tsx        # Landing page
│   │   ├── Index.tsx       # Main app page
│   │   ├── About.tsx
│   │   ├── Auth.tsx
│   │   ├── Feedback.tsx
│   │   ├── Support.tsx
│   │   ├── PrivacyPolicy.tsx
│   │   └── TermsOfService.tsx
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   │   ├── animations.ts
│   │   └── constants.ts
│   ├── integrations/       # External integrations
│   │   └── supabase/
│   │       └── client.ts
│   └── lib/                # Library utilities
│       └── utils.ts
├── public/                 # Static assets
│   ├── manifest.json       # PWA manifest
│   ├── sw.js              # Service worker
│   └── screenshots/        # App screenshots
├── supabase/              # Database schemas and migrations
│   └── enhanced_schema.sql
├── .env.example           # Environment variables template
├── vite.config.ts         # Vite configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── package.json           # Dependencies and scripts
```

## Configuration

### Supabase Setup
For backend functionality (authentication, data persistence), follow the setup guide in [SUPABASE_SETUP.md](SUPABASE_SETUP.md).

### Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note**: For security reasons, do not commit your `.env` file to version control. Use `.env.example` as a template.

To get your Supabase credentials:
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the Project URL and anon/public key

## Development

### Code Quality
- ESLint is configured for code quality checks
- TypeScript for type safety
- Follow React best practices and component patterns

### Testing
- Manual testing guide available in [TESTER_MANUAL.md](TESTER_MANUAL.md)
- Test on multiple devices and browsers
- Verify PWA functionality (offline mode, install prompts)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or feature requests, please:
- Open an issue on GitHub
- Check the [TESTER_MANUAL.md](TESTER_MANUAL.md) for app usage guides
- Review [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for backend setup

## Acknowledgments

- Built with modern web technologies
- UI components from [shadcn-ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Backend powered by [Supabase](https://supabase.com/)
- Deployed on [GitHub Pages](https://pages.github.com/)

---

**Made with ❤️ for young learners by a dad who wanted to make counting fun**
