// const express = require('express');
// const cors = require('cors');
// const app = express();
// var corsOptions = {
//   origin: 'http://localhost:8081',
// };
// app.use(cors(corsOptions));
// // parse requests of content-type - application/json
// app.use(express.json());
// // parse requests of content-type - application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));
// // simple route
// app.get('/', (req, res) => {
//   res.json({ message: 'Welcome to bezkoder application.' });
// });
// // require('./app/routes/tutorial.routes.js')(app);
// // set port, listen for requests
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}.`);
// });

const express = require('express');
const salaryRouter = require('./routes/salary');

const app = express();
const db = require('./services/db');
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
// app.get('/', (req, res) => {
//   res.json({ message: 'ok' });
// });

app.get('/', async (req, res) => {
  try {
    const result = await db.pool.query('select * from ppl_salary');
    res.send(result);
    console.log('🚀 ~ file: app.js ~ line 42 ~ app.get ~ result', result);
  } catch (err) {
    console.log('🚀 ~ file: app.js ~ line 44 ~ app.get ~ err', err);
    throw err;
  }
});

app.get('/test', (request, response) => {
  response.status(200).send('TESTY');
});

app.use('/salary', salaryRouter);

app.listen(port, () => {
  console.log(`Hallo app listening at http://localhost:${port}`);
});
