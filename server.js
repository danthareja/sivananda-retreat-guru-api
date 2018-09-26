if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const basicAuth = require('express-basic-auth');
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
  .then(() => {
    const server = express();
    
    server.use(basicAuth({
      challenge: true,
      users: {
        'admin': process.env.BASIC_AUTH_ADMIN_PASSWORD
      }
    }));

    server.get('/api/:endpoint', (req, res) => {
      return app.render(req, res, '/api', {
        _endpoint: req.params.endpoint,
        ...req.query,
      })
    });

    server.get('*', handle, (req, res) => {
      return handle(req, res)
    });

    server.listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })