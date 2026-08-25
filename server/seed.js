const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Course = require('./models/Course');
const Semester = require('./models/Semester');
const Subject = require('./models/Subject');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  await User.deleteOne({ email: 'admin@pdr.test' });
  await Course.deleteMany({});
  await Semester.deleteMany({});
  await Subject.deleteMany({});

  const admin = await User.create({
    name: 'Admin',
    email: 'admin@pdr.test',
    password: await bcrypt.hash('admin123', 10),
    role: 'admin',
  });

  const mca = await Course.create({ name: 'MCA', code: 'mca' });
  const bca = await Course.create({ name: 'BCA', code: 'bca' });

  const mcaS1 = await Semester.create({ name: 'Semester 1', number: 1, course: mca._id });
  await Semester.create({ name: 'Semester 2', number: 2, course: mca._id });

  await Subject.create({ name: 'Database Management Systems', code: 'DBMS', semester: mcaS1._id });
  await Subject.create({ name: 'Computer Networks', code: 'CN', semester: mcaS1._id });
  await Subject.create({ name: 'Data Structures', code: 'DS', semester: mcaS1._id });

  await Semester.create({ name: 'Semester 1', number: 1, course: bca._id });

  console.log('Seeded admin:', admin.email);
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
