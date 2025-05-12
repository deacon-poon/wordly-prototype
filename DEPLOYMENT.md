# Deploying the Wordly Prototype and Storybook to Vercel

This project is configured to deploy both the Next.js application and the Storybook design system documentation as separate Vercel deployments.

## Deployment Setup

### Main Application Deployment

1. Create a new project on Vercel and link it to your repository
2. Vercel will automatically detect the Next.js project
3. The `vercel.json` file configures the build settings:
   - Uses `npm run build` to build the Next.js application
   - Default Next.js output directory is used (.next)

### Storybook Deployment

1. Create a second project on Vercel, also linked to the same repository
2. On the project settings, override the build settings:
   - Set the Root Directory to `.` (root)
   - Set the Build Command to `npm run build:storybook`
   - Set the Output Directory to `storybook-static`
   - Alternatively, you can specify to use the `vercel-storybook.json` configuration file

## Deployment Process

### Automated Deployments

Both the application and Storybook will automatically deploy when you push to the `main` branch.

### Manual Deployments

You can also manually trigger deployments from the Vercel dashboard.

## Accessing the Deployments

After deployment, you'll have two separate URLs:

- Main application: `https://wordly-prototype.vercel.app` (or your custom domain)
- Storybook: `https://wordly-prototype-storybook.vercel.app` (or your custom domain)

## Local Development

- Run the Next.js application: `npm run dev`
- Run Storybook: `npm run dev:storybook`
