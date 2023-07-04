const students = [
    { name : "Sonia", birth : "2019-14-05"},
    { name : "Antoine", birth : "2000-12-05"},
    { name : "Alice", birth : "1990-14-09"},
    { name : "Sophie", birth : "2001-10-02"},
    { name : "Bernard", birth : "1980-21-08"}
];

const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
require('dotenv').config();

http.createServer((req, res) => {
    switch (req.url) {
        case '/':
            fs.readFile('view/index.ejs', 'utf8', (err, data) => {
                if (err) {
                  res.writeHead(404);
                  res.write('File not found');
                  console.log(err);
                } else {
                  const renderedHtml = ejs.render(data);
                  res.writeHead(200, { 'Content-Type': 'text/html' });
                  res.write(renderedHtml);
                }
                res.end();
              });
            break;
        case '/users':
            fs.readFile('view/users.ejs', 'utf8', (err, data) => {
                if (err) {
                  res.writeHead(404);
                  res.write('File not found');
                  console.log(err);
                } else {
                  const renderedHtml = ejs.render(data, { students: students });
                  res.writeHead(200, { 'Content-Type': 'text/html' });
                  res.write(renderedHtml);
                }
                res.end();
              });
            break;
        case '/assets/style.css':
            const cssFile = fs.readFileSync('assets/style.css', 'utf8');
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.write(cssFile);
            res.end();
            break;
    }
    if (req.method === 'POST') {
        let body = '';
        req.on('data', (person) => {
        body += person.toString();
    });
    req.on('end', () => {
      const params = new URLSearchParams(body);
      const name = params.get('name');
      const birth = params.get('birth');
      students.push({ name: name, birth: birth });
      res.writeHead(302, { 'Location': '/' });
      console.log(students);
      res.end();
    });
  }
}).listen(process.env.APP_PORT);