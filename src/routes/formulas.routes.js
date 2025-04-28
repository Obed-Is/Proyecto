import express from 'express';
import path from 'path';

const router = express.Router();
const __dirname = import.meta.dirname;

router.get('/formulas', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/formulas.html'));
});

export default router;