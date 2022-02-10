const express = require('express');
const router = express.Router();
const db = require('../services/db');

router.get('/', (request, response) => {
  response.status(200).send('salary');
});

router.get('/test', async function (req, res) {
  try {
    const sqlQuery = 'SELECT name, salary FROM ppl_salary WHERE salary > 20000';
    const rows = await db.pool.query(sqlQuery);
    res.status(200).json(rows);
  } catch (error) {
    res.status(400).send(error.message);
  }

  res.status(200).json({ id: req.params.id });
});

router.get('/avg', async function (req, res) {
  try {
    // const sqlQuery = 'SELECT name, job, salary FROM ppl_salary WHERE job=?';
    const sqlQuery = `SELECT job, AVG(salary) AS avg FROM ppl_salary GROUP BY job`;
    const rows = await db.pool.query(sqlQuery);
    const avgJobs = rows.map((job) => {
      return {
        [job.job]: job.avg,
      };
    });
    res.status(200).json(avgJobs);
  } catch (error) {
    res.status(400).send(error.message);
  }

  //   res.status(200).json({ job: req.params.job });
});

router.get('/popularity', async function (req, res) {
  try {
    // const sqlQuery = 'SELECT name, job, salary FROM ppl_salary WHERE job=?';
    const sqlQuery = `SELECT job, COUNT(job) AS popularity FROM ppl_salary GROUP BY job`;
    const rows = await db.pool.query(sqlQuery);
    res.status(200).json(rows);
  } catch (error) {
    res.status(400).send(error.message);
  }

  //   res.status(200).json({ job: req.params.job });
});

router.get('/:job', async function (req, res) {
  try {
    // const sqlQuery = 'SELECT name, job, salary FROM ppl_salary WHERE job=?';
    const sqlQuery = 'SELECT name, MAX(salary) FROM ppl_salary WHERE job=?';
    const rows = await db.pool.query(sqlQuery, req.params.job);
    res.status(200).json(rows);
  } catch (error) {
    res.status(400).send(error.message);
  }

  res.status(200).json({ job: req.params.job });
});

router.post('/new', async function (req, res) {
  try {
    const { name, job, salary } = req.body;

    const isNameExistQuery = `SELECT name FROM ppl_salary WHERE name='${name}'`;
    const isExistsResult = await db.pool.query(isNameExistQuery);

    let sqlQuery;
    if (isExistsResult.length > 0) {
      sqlQuery = `UPDATE ppl_salary SET job='${job}', salary='${salary}' WHERE name='${name}'`;
    } else {
      sqlQuery = `INSERT INTO ppl_salary (name, job, salary) VALUES ('${name}', '${job}', '${salary}')`;
    }

    const result = await db.pool.query(sqlQuery);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
