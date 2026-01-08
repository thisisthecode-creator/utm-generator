# UTM Generator

A modern, user-friendly web application for generating UTM (Urchin Tracking Module) tracking URLs for marketing campaigns, ads, emails, and more.

## Features

- **Complete UTM Parameter Support**: All standard UTM parameters plus extended parameters
  - `utm_source` (required)
  - `utm_medium` (required)
  - `utm_campaign` (required)
  - `utm_id`
  - `utm_term`
  - `utm_content`
  - `utm_source_platform`
  - `utm_creative_format`
  - `utm_marketing_tactic`

- **Optional Template Variables**: 
  - `email={{email}}`
  - `firstName={{firstName}}`

- **Real-time URL Generation**: URL updates automatically as you type
- **URL Breakdown**: Visual breakdown of all parameters in the generated URL
- **Copy to Clipboard**: One-click copy functionality with visual feedback
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful, intuitive interface with helpful tooltips

## Usage

1. Open `index.html` in your web browser
2. Enter your base website URL
3. Fill in the required UTM parameters (Source, Medium, Campaign)
4. Optionally add additional UTM parameters
5. Toggle optional template variables (email, firstName) if needed
6. Copy the generated URL using the "Copy URL" button

## Example

**Input:**
- Base URL: `https://example.com/product`
- UTM Source: `google`
- UTM Medium: `cpc`
- UTM Campaign: `spring_sale`
- UTM Term: `running shoes`
- Include email: ✓
- Include firstName: ✓

**Generated URL:**
```
https://example.com/product?utm_source=google&utm_medium=cpc&utm_campaign=spring_sale&utm_term=running+shoes&email={{email}}&firstName={{firstName}}
```

## File Structure

```
UTM/
├── index.html      # Main HTML structure
├── styles.css      # Styling and layout
├── script.js       # URL generation logic
└── README.md       # This file
```

## Browser Support

Works in all modern browsers that support:
- ES6 JavaScript
- CSS Grid
- Clipboard API (with fallback for older browsers)

## No Dependencies

This is a pure HTML/CSS/JavaScript application with no external dependencies. Just open `index.html` in your browser and start generating UTM URLs!

## Deployment to GitHub Pages

### Quick Deploy (Using GitHub CLI)

1. **Authenticate with GitHub CLI:**
   ```bash
   gh auth login
   ```

2. **Run the deployment script:**
   ```bash
   ./deploy.sh
   ```

The script will:
- Create a public GitHub repository named `utm-generator`
- Push your code to GitHub
- Enable GitHub Pages automatically
- Provide you with the live URL

### Manual Deploy

1. **Create a new repository on GitHub** (via web interface or CLI)

2. **Add the remote and push:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/utm-generator.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Navigate to Settings > Pages
   - Under "Source", select "Deploy from a branch"
   - Choose branch: `main` and folder: `/ (root)`
   - Click Save

Your site will be available at: `https://YOUR_USERNAME.github.io/utm-generator`

