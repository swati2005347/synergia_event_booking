const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory data store
let bookings = [];
let nextId = 1;

/*
-----------------------------------------------------
1. GET /api/bookings - View all event bookings
-----------------------------------------------------
*/
app.get('/api/bookings', (req, res) => {
  res.json({
    success: true,
    message: 'All event bookings retrieved successfully.',
    data: bookings
  });
});

/*
-----------------------------------------------------
2. POST /api/bookings - Register for the event
-----------------------------------------------------
Expected JSON body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "event": "Synergia 2025"
}
-----------------------------------------------------
*/
app.post('/api/bookings', (req, res) => {
  const { name, email, event } = req.body;

  if (!name || !email || !event) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and event are required.'
    });
  }

  const newBooking = {
    id: nextId++,
    name,
    email,
    event
  };

  bookings.push(newBooking);

  res.status(201).json({
    success: true,
    message: 'Booking created successfully!',
    data: newBooking
  });
});

/*
-----------------------------------------------------
3. GET /api/bookings/:id - View a specific booking
-----------------------------------------------------
*/
app.get('/api/bookings/:id', (req, res) => {
  const bookingId = parseInt(req.params.id);
  const booking = bookings.find(b => b.id === bookingId);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found.'
    });
  }

  res.json({
    success: true,
    message: 'Booking retrieved successfully.',
    data: booking
  });
});

/*
-----------------------------------------------------
4. PUT /api/bookings/:id - Update participant details
-----------------------------------------------------
Expected JSON body (any field can be updated):
{
  "name": "Updated Name",
  "email": "new@example.com"
}
-----------------------------------------------------
*/
app.put('/api/bookings/:id', (req, res) => {
  const bookingId = parseInt(req.params.id);
  const booking = bookings.find(b => b.id === bookingId);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found.'
    });
  }

  const { name, email, event } = req.body;

  if (name) booking.name = name;
  if (email) booking.email = email;
  if (event) booking.event = event;

  res.json({
    success: true,
    message: 'Booking updated successfully!',
    data: booking
  });
});

/*
-----------------------------------------------------
5. DELETE /api/bookings/:id - Cancel a booking
-----------------------------------------------------
*/
app.delete('/api/bookings/:id', (req, res) => {
  const bookingId = parseInt(req.params.id);
  const index = bookings.findIndex(b => b.id === bookingId);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found.'
    });
  }

  const deletedBooking = bookings.splice(index, 1);

  res.json({
    success: true,
    message: 'Booking cancelled successfully.',
    data: deletedBooking[0]
  });
});

/*
-----------------------------------------------------
Start the server
-----------------------------------------------------
*/
app.listen(PORT, () => {
  console.log(`🚀 Synergia Event Booking API running on http://localhost:${PORT}`);
});
