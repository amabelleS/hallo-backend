const express = require('express');
const router = express.Router();
const db = require('../services/db');

router.get('/', async (req, res) => {
  try {
    const result = await db.pool.query('select * from ppl_salary');
    res.send(result);
  } catch (err) {
    console.log('🚀 ~ file: app.js ~ line 44 ~ app.get ~ err', err);
    throw err;
  }
});

router.get('/avg', async function (req, res) {
  try {
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
});

router.get('/popularity', async function (req, res) {
  try {
    const sqlQuery = `SELECT job, COUNT(job) AS popularity FROM ppl_salary GROUP BY job`;
    const rows = await db.pool.query(sqlQuery);
    res.status(200).json(rows);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/:job', async function (req, res) {
  try {
    const sqlQuery = 'SELECT name, MAX(salary) FROM ppl_salary WHERE job=?';
    const rows = await db.pool.query(sqlQuery, req.params.job);
    res.status(200).json(rows[0]);
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
