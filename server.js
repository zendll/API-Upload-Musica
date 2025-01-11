//sistema de upar Js

const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const port = 3000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });
app.use('/music', express.static(path.join(__dirname, 'uploads')));

app.post('/music', upload.single('music'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Nenhum arquivo foi enviado.');
  }
  console.log('Arquivo recebido:', req.file); 
  res.redirect('/music/');
});

app.get('/music/', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) {
      return res.status(500).send('Erro ao ler a pasta de uploads.');
    }
    
    const fileLinks = files.map(file => `<li><a href="/music/${file}">${file}</a></li>`).join('');
    res.send(`<h1>Arquivos de Música</h1><ul>${fileLinks}</ul>`);
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor de música rodando em http://localhost:${port}`);
});
