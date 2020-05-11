const express = require('express');

const db = require('../../data/dbConfig.js')

const router = express.Router();
 
router.get('/', (req, res) => {
    db.select('*')
    .from('accounts')
    .then(accounts => {
        res.status(200).json({ 
            data: accounts 
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'There was an error getting the accounts data'
        });
    });
});

router.get('/:id', (req, res) => {
    db('accounts')
    .where({ id: req.params.id })  
    .first()
    .then(account => {
        if (account) {
            res.status(200).json({
                data: account
            });
        } else {
            res.status(404).json({
                message: 'The account with the specified ID cannot be found'
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'There was an error retrieving the account with that specified ID'
        });
    });
});

router.post('/', (req, res) => {
    const account = req.body;
    if (isValidAccount(account)){
        db('accounts')
        .insert(account, 'id')
        .then(ids => {
            res.status(201).json({
                data: ids
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'There was an error creating the account.'
            });
        });
    } else {
        res.status(400).json({
            message: 'Please provide a name and a budget for this account'
        });
    };
});

router.delete('/:id', (req, res) => {
    db('accounts')
    .where({ id: req.params.id })
    .del()
    .then(count => {
        if (count > 0) {
            res.status(200).json({
                data: count
            });
        } else {
            res.status(404).json({
                message: 'The account with that specified ID could not be found'    
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'There was an error attempting to delete the specified account'
        });
    });
});

router.put('/:id', (req, res) => {
    db('accounts')
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
        if (count > 0) {
            res.status(200).json({
                data: count
            });
        } else {
            res.status(404).json({
                message: 'The account with that specified ID cannot be found'
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'There was a problem editing the data with that specified ID'
        });
    });
});



function isValidAccount(account) {
    return Boolean(account.name && account.budget);
}
    

module.exports = router;