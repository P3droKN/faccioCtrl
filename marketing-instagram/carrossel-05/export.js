const puppeteer = require('../carrossel-01/node_modules/puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('Iniciando exportação dos slides...');
  
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();

  const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  
  console.log('Carregando a página HTML...');
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  // Await longer for fonts and animations to settle
  await new Promise(r => setTimeout(r, 2000));

  await page.evaluate(() => {
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide) => {
      slide.style.transform = 'none';
      slide.style.margin = '20px'; 
      slide.style.boxShadow = 'none'; 
      // Force animations to their default state to avoid blur during screenshot
      const animated = slide.querySelectorAll('.float-slow, .float-medium, .float-fast');
      animated.forEach(el => el.style.animation = 'none');
    });
    
    document.body.style.padding = '0';
    document.body.style.display = 'block'; 
  });

  const slides = await page.$$('.slide');
  console.log(`Encontrados ${slides.length} slides para exportação.`);

  const outputDir = path.join(__dirname, 'export');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  for (let i = 0; i < slides.length; i++) {
    const slideNumber = i + 1;
    const outputPath = path.join(outputDir, `slide-${slideNumber}.png`);
    
    console.log(`Exportando Slide ${slideNumber}...`);
    
    await slides[i].screenshot({
      path: outputPath,
      type: 'png'
    });
    
    console.log(`✅ Slide ${slideNumber} salvo com sucesso.`);
  }

  await browser.close();
  console.log('Exportação finalizada com sucesso! Verifique a pasta "export/".');
})();
