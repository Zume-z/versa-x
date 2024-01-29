import fs from 'fs-extra'

async function build() {
  const _dir = 'extension'
  const _dir_assets = 'extension/assets'
  const src_files = fs.readdirSync(_dir)
  const assets_files = fs.readdirSync(_dir_assets)

  for (const file of src_files) {
    // MANIFEST.JSON
    if (file.startsWith('manifest')) {
      fs.readFile(_dir + '/' + file, 'utf-8', function (err, data) {
        data = data.replace(/assets\/main.tsx.*.js/g, 'assets/main.js')
        data = data.replace(/"assets\/main.*.css"/g, '')
        data = data.replace(/assets\/content-script-loader.main.tsx.*.js/g, 'assets/content-script-loader.js')

        fs.writeFile(_dir + '/' + file, data, 'utf-8', function (err) {
          if (err) throw err
        })
      })
    }

    // SERVICE-WORKER-LOADER
    if (file.startsWith('service-worker-loader')) {
      fs.readFile(_dir + '/' + file, 'utf-8', function (err, data) {
        if (err) throw err
        // './assets/background.ts.d481bc82.js';
        const newValue = data.replace(/assets\/background.ts.*.js/g, 'assets/background.js')
        fs.writeFile(_dir + '/' + file, newValue, 'utf-8', function (err) {
          if (err) throw err
        })
      })
    }
  }

  for (const file of assets_files) {
    // MAIN.JS
    if (file.startsWith('main') && file.endsWith('.js')) {
      fs.renameSync(
        _dir_assets + '/' + file,
        _dir_assets + '/' + file.replace(file, 'main.js'),

        { recursive: true },
      )
    }

    // MAIN.CSS
    if (file.startsWith('main') && file.endsWith('.css')) {
      fs.renameSync(
        _dir_assets + '/' + file,
        _dir_assets + '/' + file.replace(file, 'main.css'),

        { recursive: true },
      )
    }

    // BACKGROUND.JS
    if (file.startsWith('background.ts') && file.endsWith('.js')) {
      fs.renameSync(
        _dir_assets + '/' + file,
        _dir_assets + '/' + file.replace(file, 'background.js'),

        { recursive: true },
      )
    }

    // CONTENT-SCRIPT-LOADER
    if (file.startsWith('content-script-loader')) {
      fs.readFile(_dir_assets + '/' + file, 'utf-8', function (err, data) {
        if (err) throw err
        const newValue = data.replace(/assets\/main.tsx.*.js/g, 'assets/main.js')
        fs.writeFile(_dir_assets + '/' + file, newValue, 'utf-8', function (err) {
          if (err) throw err
          fs.renameSync(
            _dir_assets + '/' + file,
            _dir_assets + '/' + file.replace(file, 'content-script-loader.js'),

            { recursive: true },
          )
        })
      })
    }
  }

  console.info('Build Complete.')
}

build()
