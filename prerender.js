import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function prerender() {
  if (process.env.VERCEL) {
    console.log('Vercel environment detected. Skipping Puppeteer prerender to avoid browser launch issues.');
    return;
  }
  const app = express();
  
  // Serve static files from dist
  app.use(express.static(path.join(__dirname, 'dist')));
  
  // Fallback to index.html for SPA routes
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });

  const server = app.listen(0);
  const port = server.address().port;

  console.log(`Starting headless browser to prerender...`);
  const browser = await puppeteer.launch({ headless: 'new' });
  
  const routes = ['/', '/terms', '/privacy', '/accessibility'];
  
  for (const route of routes) {
    const page = await browser.newPage();
    console.log(`Prerendering ${route}...`);
    
    // Go to route
    await page.goto(`http://localhost:${port}${route}`, { waitUntil: 'networkidle0' });
    
    // Ensure React has mounted and injected content
    await page.waitForFunction('document.getElementById("root").innerHTML !== ""');

    // Get the fully rendered HTML
    const html = await page.content();
    
    // Save to the corresponding folder
    const outDir = path.join(__dirname, 'dist', route === '/' ? '' : route);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    
    const outFile = path.join(outDir, 'index.html');
    fs.writeFileSync(outFile, html);
    console.log(`Saved ${outFile}`);
    
    await page.close();
  }
  
  await browser.close();
  server.close();
  console.log('Prerendering complete!');
}

prerender().catch(err => {
  console.error(err);
  process.exit(1);
});
