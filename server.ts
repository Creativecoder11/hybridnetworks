import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import next from 'next';
import { parse } from 'url';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  server.use(express.json());

  // Mock data for terminals
  const terminals = [
    { id: 'TERM-001', customer: 'Acme Corp', location: [37.7749, -122.4194], network: 'Starlink', status: 'Online', uptime: 99.9, subscriptionPlan: 'Enterprise', startDate: '2025-01-01', expireDate: '2026-01-01', subscriptionEvent: null },
    { id: 'TERM-002', customer: 'Global Tech', location: [51.5074, -0.1278], network: 'OneWeb', status: 'Warning', uptime: 98.5, subscriptionPlan: 'Pro', startDate: '2025-06-01', expireDate: '2026-06-01', subscriptionEvent: 'downgrade' },
    { id: 'TERM-003', customer: 'Oceanic Airlines', location: [-33.8688, 151.2093], network: 'Starlink', status: 'Offline', uptime: 95.2, subscriptionPlan: 'Basic', startDate: '2025-03-15', expireDate: '2026-03-15', subscriptionEvent: 'expire' },
    { id: 'TERM-004', customer: 'Desert Oasis', location: [25.2048, 55.2708], network: 'OneWeb', status: 'Online', uptime: 99.9, subscriptionPlan: 'Pro', startDate: '2025-11-20', expireDate: '2026-11-20', subscriptionEvent: 'upgrade' },
    { id: 'TERM-005', customer: 'Acme Corp', location: [34.0522, -118.2437], network: 'Starlink', status: 'Online', uptime: 99.5, subscriptionPlan: 'Enterprise', startDate: '2025-01-01', expireDate: '2026-01-01', subscriptionEvent: null },
  ];

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Send initial data
    socket.emit('terminals', terminals);

    // Simulate real-time speed data
    const interval = setInterval(() => {
      const speedData = terminals.map(t => ({
        id: t.id,
        download: Math.floor(Math.random() * 150) + 50, // 50-200 Mbps
        upload: Math.floor(Math.random() * 30) + 10, // 10-40 Mbps
        latency: Math.floor(Math.random() * 40) + 20, // 20-60 ms
        timestamp: new Date().toISOString(),
      }));
      socket.emit('speed-update', speedData);
    }, 2000);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      clearInterval(interval);
    });
  });

  // API Routes
  server.get('/api/terminals', (req, res) => {
    res.json(terminals);
  });

  server.post('/api/terminals', (req, res) => {
    const newTerminal = {
      ...req.body,
      status: 'Online',
      uptime: 100,
      subscriptionEvent: null
    };
    terminals.push(newTerminal);
    io.emit('terminals', terminals);
    res.status(201).json(newTerminal);
  });

  server.get('/api/analytics', (req, res) => {
    const customer = req.query.customer as string;
    let filteredTerminals = terminals;
    
    if (customer) {
      filteredTerminals = terminals.filter(t => t.customer === customer);
    }

    res.json({
      dailyUsage: customer ? 120 : 450, // Mock data based on customer
      monthlyUsage: customer ? 3.5 : 12.5, // Mock data based on customer
      activeTerminals: filteredTerminals.filter(t => t.status === 'Online').length,
      totalTerminals: filteredTerminals.length,
      averageUptime: 98.3,
    });
  });

  // Next.js request handler
  server.all(/.*/, (req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
