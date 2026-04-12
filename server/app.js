const express = require('express');
const cors = require('cors');

const servicesRoutes = require('./routes/servicesRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const detailingRoutes = require('./routes/detailingRoutes');
const bookingsRoutes = require('./routes/bookingsRoutes');
const paymentsRoutes = require('./routes/paymentsRoutes');
const userRoutes = require('./routes/userRoutes');
const pubsubRoutes = require('./routes/pubsubRoutes');
const redisRoutes = require('./routes/redisRoutes');
const listenForMessages = require('./subscribers/notificationSubscriber');

const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 4201;
const router = express.Router();

app.use(cors());
app.use(express.json()); // Allows for POST/PUT parsing

/* API routes */
app.use('/api/services', servicesRoutes);         // Handles GET /api/services/
app.use('/api/vehicle', vehicleRoutes);           // Handles GET /api/vehicle/
app.use('/api/detailing', detailingRoutes);       // Handles GET /api/detailing/
app.use('/api/bookings', bookingsRoutes);         // Handles GET /api/bookings/
app.use('/api/payments', paymentsRoutes);         // Handles GET /api/payments/
app.use('/api/users', userRoutes);                // Handles GET /api/users/
app.use('/api/pubsub', pubsubRoutes)
app.use('/api/redis', redisRoutes)
app.use('/api', router)

// For testing, temporary
router.get('/test', (req, res) => {
    res.json({message: "Hello World"});
});


const createCounter = () => {
  let x = 0;
  return {
    increment: () => {
      x++;
    },
    getValue: () => {
      return x;
    }
  }
}

const mergeSort = (arr) => {

  let a = [];
  if (arr.length <= 1) {
    return arr;
  }

  const middle = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, middle));
  const right = mergeSort(arr.slice(middle, arr.length));
  return merge(left, right);
}

const merge = (a, b) => {

  let result = []
  
  let leftIndex = 0
  let rightIndex = 0

  while (leftIndex < a.length && rightIndex < b.length) {
    if (a[leftIndex] < b[rightIndex] && rightIndex < b.length && leftIndex < a.length) {
      result.push(a[leftIndex])
      leftIndex++;
    } else {
      result.push(b[rightIndex])
      rightIndex++;
    }
  }
  if (rightIndex == b.length) {
    return result.concat(a)
  }
  if (leftIndex == a.length) {
    return result.concat(b)
  }
  // sort b (right side)
}

// 404 handler (runs if no route above matches)
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Centralized error-handling middleware (last)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
  
  // Start the Pub/Sub worker
  listenForMessages();
});