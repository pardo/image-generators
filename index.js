const puppeteer = require('puppeteer-core')
var fs = require('fs')
const args = require('args-parser')(process.argv)

// example node index.js --name=pardo --count=100 --width=1000 --height=1000 -avoidGraphemescope --bgcolor=red
var options = {
  avoidGraphemescope: args.avoidGraphemescope,
  bgcolor: args.bgcolor
}
var outputDir = './output/'
var name = args.name || 'snake'
var count = args.count || 20
var width = args.width || 500
var height = args.height || 500

console.log(args)

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir)
}

async function render (page, width, height, name, options) {
  await page.evaluate(function (width, height, name, avoidGraphemescope, bgcolor) {
    var options = {
      avoidGraphemescope: avoidGraphemescope,
      bgcolor: bgcolor
    }
    window.render(width, height, name, options)
  }, width, height, name, options.avoidGraphemescope, options.bgcolor)
}

(async() => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    defaultViewport: {
      width: 400,
      height: 400
    }
  })
  const page = await browser.newPage()
  await page.goto('http://localhost:1234')
  setTimeout(async () => {
    page.on('console', msg => {
      console.log(msg.text())
      if (msg.text().startsWith('Done:')) {
        var name = msg.text().split(':')[1]
        page.screenshot({
          path: outputDir + name, fullPage: true
        }).then(function () {
          if (msg.text().match(/.*-(\d+).jpg/)[1] == count - 1) {
            process.exit(1)
          }
        })
      }
    })
    for (let index = 0; index < count; index++) {
      await render(
        page,
        width, height,
        `${name}-${index}.jpg`,
        options
      )
    }
  }, 100)
})()
