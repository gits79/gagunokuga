const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const port = 3000;

// CORS 허용 (Vue 개발 서버에서 요청 가능)
app.use(cors({
    origin: 'http://localhost:5173'
}));

app.get('/capture', async (req, res) => {
    const browser = await puppeteer.launch({ headless: 'new' }); // 최신 headless 모드 사용
    const page = await browser.newPage();

    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' }); // Vue 앱이 실행되는 주소
    const screenshot = await page.screenshot({ fullPage: true });

    await browser.close();

    res.set('Content-Type', 'image/png');
    res.send(screenshot);
});

app.listen(port, () => {
    console.log(`Puppeteer 서버가 http://localhost:${port} 에서 실행 중`);
});