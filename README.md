# Life Walk MVP

A simplified life trajectory analysis tool that helps users recognize gaps between their current path and desired future.

## Features

- **Quick Trajectory Check**: 10-minute experience analyzing past, present, and future goals
- **Visual Gap Analysis**: Side-by-side comparison showing current trajectory vs desired future
- **Detailed Life Walk**: Age-by-age reflection system for deeper self-analysis
- **Local Storage**: No backend required, data persists in browser
- **Mobile Responsive**: Works on all devices

## Development

```bash
npm install
npm run dev
```

## Building for Production

```bash
npm run build
```

## Deployment to Vercel

1. Push code to GitHub repository
2. Connect repository to Vercel
3. Deploy with default settings

The app is configured for Vercel with:
- `vercel.json` for SPA routing
- Build output in `dist/` folder
- TypeScript compilation included in build

## User Journey

1. **Welcome**: Introduction to Life Walk concept
2. **Quick Check**: 6-step reflection on past, present, and future
3. **Results**: Visual trajectory analysis showing gap between current and desired path
4. **Detailed Walk**: Optional deeper dive into age-based life planning

## Beta Testing Focus

This MVP focuses on the core emotional impact: helping users recognize when their current trajectory doesn't align with their stated desires. The goal is to create a moment of realization that motivates action.

## Next Features (Post-Beta)

- Comprehensive analysis after Detailed Walk
- Export functionality (PDF/email)
- Voice recording for reflections
- Social sharing capabilities
- Anonymous analytics