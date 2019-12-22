Prerender

Customized version of [prerender](https://github.com/prerender/prerender) for the needs of [inventaire.io](https://inventaire.io).

## Install

### Development
```
git clone https://github.com/inventaire/prerender
cd prerender
npm install

# Expected to install Chromium at /usr/bin/chromium-browser
# otherwise, create a ./config/local.js to override config `chromeLocation` value
sudo apt-get install chromium-browser

npm run watch
```

### Production
```
git clone https://github.com/inventaire/prerender
cd prerender
npm install --production

# Expected to install Chromium at /usr/bin/chromium-browser
# otherwise, create a ./config/local.js to override config `chromeLocation` value
sudo apt-get install chromium-browser

npm run add-to-systemd
sudo systemctl start prerender
```