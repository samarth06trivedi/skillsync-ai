//lib/db.ts
import monk from 'monk';

const db = monk(process.env.MONGO_URI!);
const users = db.get('users'); // assuming your collection is called 'users'

export default users;
