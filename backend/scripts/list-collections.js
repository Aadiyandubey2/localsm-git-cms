require('dotenv').config();
const mongoose = require('mongoose');

async function main() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in database:');
    
    for (const coll of collections) {
      const count = await mongoose.connection.db.collection(coll.name).countDocuments();
      console.log(`- ${coll.name}: ${count} docs`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

main();
