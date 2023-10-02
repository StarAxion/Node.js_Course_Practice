const PORT = process.env.PORT || 3000;

const SERVER_URL = `http://localhost:${PORT}`;

const COURSES = [
  { id: 'abc-123', title: 'TypeScript' },
  { id: 'cde-345', title: 'React' },
  { id: 'efg-567', title: 'Angular' },
  { id: 'ghi-789', title: 'Node.js' }
];

module.exports = {
  PORT,
  SERVER_URL,
  COURSES
};
