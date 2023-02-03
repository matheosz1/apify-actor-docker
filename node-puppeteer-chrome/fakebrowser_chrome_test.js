const { launchPuppeteer } = require('crawlee');
const {FakeBrowser} = require('fakebrowser');

const path = require('path');

const userDataDir = path.resolve(__dirname, './fakeBrowserUserData')

const testPageLoading = async (browser) => {
    const page = await fakeBrowser.vanillaBrowser.newPage();
    await page.goto('http://www.example.com');
    const pageTitle = await page.title();
    if (pageTitle !== 'Example Domain') {
        throw new Error(`Fakebrowser+Chrome test failed - returned title "${pageTitle}"" !== "Example Domain"`);
    }
};

const testFakebrowserChrome = async () => {
    console.log('Testing Fakebrowser with full Chrome');
    // We need --no-sandbox, because even though the build is running on GitHub, the test is running in Docker.
    // const launchOptions = { headless: false, args: ['--no-sandbox'] };
    // const launchContext = { useChrome: true, launchOptions };
    // [Optional]: Select a fake device description
    const windowsDD = require('./node_modules/fakebrowser/device-hub-demo/Windows.json');

    const builder = new FakeBrowser.Builder()
        // [Optional]: Set the fake device description
        .deviceDescriptor(windowsDD)
        // [Optional]: Show user action layers
        .displayUserActionLayer(false)
        // [Optional]: Set startup options (https://pptr.dev/#?product=Puppeteer&show=api-puppeteerlaunchoptions)
        .vanillaLaunchOptions({
            headless: false,
            useChrome: true,
            executablePath: '/usr/bin/google-chrome',
            // executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            userDataDir,
            dumpio: false,
            args: [
            // Required for Docker version of Puppeteer
            '--no-sandbox',
            ],

        })
        // Must be set: path to save user data
        // We will create a fake device description (fake browser fingerprint) and save the browser's user cache information to this folder.
        // Note: Once the fake browser fingerprint is created, it will not change, just like a normal user using the browser.
        // If you want to get a different browser fingerprint, see demo2.
        .userDataDir(userDataDir);
    
    const browser = await builder.launch();
    try {
        await testPageLoading(browser);
    } finally {
        await browser.close();
    }
};

module.exports = testFakebrowserChrome;
