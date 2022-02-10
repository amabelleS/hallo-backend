const express = require('express');
const router = express.Router();
const db = require('../services/db');
const HttpError = require('../models/http-error');

router.get('/', async (req, res) => {
  let salaries;
  try {
    salaries = await db.pool.query('select * from ppl_salary');
  } catch (err) {
    return next(
      new HttpError('fetching salaries failed, please try again later', 500)
    );
  }
  res.send(salaries);
});

router.get('/avg', async function (req, res) {
  let jobsAvg;
  try {
    const sqlQuery = `SELECT job, AVG(salary) AS avg FROM ppl_salary GROUP BY job`;
    jobsAvg = await db.pool.query(sqlQuery);
    // const avgJobs = rows.map((job) => {
    //   return {
    //     [job.job]: job.avg,
    //   };
    // });
  } catch (error) {
    return next(
      new HttpError(
        'Fetching average jobs salary failed, please try again later',
        500
      )
    );
  }
  res.status(200).json(jobsAvg);
});

router.get('/popularity', async function (req, res) {
  let jobsPopularity;
  try {
    const sqlQuery = `SELECT job, COUNT(job) AS popularity FROM ppl_salary GROUP BY job`;
    jobsPopularity = await db.pool.query(sqlQuery);
    res.status(200).json(jobsPopularity);
  } catch (error) {
    return next(
      new HttpError(
        'Fetching jobs popularity salary failed, please try again later',
        500
      )
    );
  }
});

router.post('/new', async function (req, res) {
  const { name, job, salary } = req.body;

  try {
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
    return next(
      new HttpError('Could not insert nor update, please try again later', 500)
    );
  }
});

router.get('/:job', async function (req, res) {
  let maxSalaryByJob;
  try {
    const sqlQuery = 'SELECT name, MAX(salary) FROM ppl_salary WHERE job=?';
    maxSalaryByJob = await db.pool.query(sqlQuery, req.params.job);
  } catch (error) {
    return next(
      new HttpError(
        'Fetching maximum salary by job params failed, please try again later',
        500
      )
    );
  }

  res.status(200).json(maxSalaryByJob[0]);
});

module.exports = router;
