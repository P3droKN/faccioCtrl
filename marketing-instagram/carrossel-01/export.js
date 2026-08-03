const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('Iniciando exportação dos slides...');
  
  // Launch the browser
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();

  // Obter caminho absoluto do HTML local
  const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  
  console.log('Carregando a página HTML...');
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  // Wait a bit more to ensure fonts and lucide icons are fully rendered
  await new Promise(r => setTimeout(r, 2000));

  // Remover a escala CSS (.slide { transform: scale(0.5) }) para capturar em tamanho real (1080x1350)
  await page.evaluate(() => {
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide) => {
      slide.style.transform = 'none';
      slide.style.margin = '20px'; // Dar um pequeno respiro para o screenshot não bugar
      slide.style.boxShadow = 'none'; // Remover sombra externa pro screenshot ficar limpo
    });
    
    // Ocultar o body padding para não interferir
    document.body.style.padding = '0';
    document.body.style.display = 'block'; // remover o flexbox do body para eles ficarem empilhados e não lado a lado com erro de width
  });

  // Localizar todos os slides
  const slides = await page.$$('.slide');
  
  console.log(`Encontrados ${slides.length} slides para exportação.`);

  const outputDir = path.join(__dirname, 'imagens');
  
  for (let i = 0; i < slides.length; i++) {
    const slideNumber = i + 1;
    const outputPath = path.join(outputDir, `slide-${slideNumber}.png`);
    
    console.log(`Exportando Slide ${slideNumber}...`);
    
    // Capturar apenas a bounding box do elemento
    await slides[i].screenshot({
      path: outputPath,
      type: 'png'
    });
    
    console.log(`✅ Slide ${slideNumber} salvo com sucesso.`);
  }

  await browser.close();
  console.log('Exportação finalizada com sucesso! Verifique a pasta "imagens/".');
})();
