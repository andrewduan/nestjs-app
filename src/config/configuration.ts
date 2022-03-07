export default () => ({
    mongodb: {
      user: process.env.MONGO_USER,
      password: process.env.MONGO_PASSWORD,
      path: process.env.MONGO_PATH
    }
  });