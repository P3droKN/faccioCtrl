const puppeteer = require('../carrossel-01/node_modules/puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('Iniciando exportação dos Stories...');
  
  const browser = await puppeteer.launch({
    headless: "new",
    // Viewport adjusted for Stories height, though we'll clip the elements anyway
    defaultViewport: { width: 1920, height: 2000 },
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  
  console.log('Carregando a página HTML...');
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  // Aguarda carregamento de webfonts e icones
  await new Promise(r => setTimeout(r, 2000));

  await page.evaluate(() => {
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide) => {
      // Remove a escala (0.35) para renderizar a 1080x1920 nativo
      slide.style.transform = 'none';
      slide.style.margin = '20px'; 
      slide.style.boxShadow = 'none'; 
    });
    
    document.body.style.padding = '0';
    document.body.style.display = 'block'; 
  });

  const slides = await page.$$('.slide');
  console.log(`Encontrados ${slides.length} stories para exportação.`);

  const outputDir = path.join(__dirname, 'export');
  
  for (let i = 0; i < slides.length; i++) {
    const slideNumber = i + 1;
    const outputPath = path.join(outputDir, `story-${slideNumber}.png`);
    
    console.log(`Exportando Story ${slideNumber}...`);
    
    await slides[i].screenshot({
      path: outputPath,
      type: 'png'
    });
    
    console.log(`✅ Story ${slideNumber} salvo com sucesso.`);
  }

  await browser.close();
  console.log('Exportação finalizada com sucesso! Verifique a pasta "export/".');
})();
