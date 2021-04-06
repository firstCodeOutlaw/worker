const express = require('express');
const router = express.Router();
const address = require('../request/controllers/addressController');

// Get all available addresses (paginated)
router.get('/', (request, response) => {
    address.getAll(request, response);
});

// Create an address
router.post('/', (request, response) => {
    address.post(request, response)
});

// Returns a specific address
router.get('/:id', (request, response) => {
    address.getOne(request, response)
});

// Modifies a specific address
router.patch('/:id', (request, response) => {
    address.update(request, response);
});

// Permanently removes an address
router.delete('/:id', (request, response) => {
    address.delete(request, response);
});

module.exports = router;
