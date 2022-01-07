import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  res.json({ data: 'index' });
});

export = router;
