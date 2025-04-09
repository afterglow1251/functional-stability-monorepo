import mongoose, { Connection } from 'mongoose';

export const MONGOOSE_CONNECTION = Symbol('MONGOOSE_CONNECTION');

export const mongooseProvider = {
  provide: MONGOOSE_CONNECTION,
  useFactory: async (): Promise<Connection> => {
    try {
      await mongoose.connect(
        'mongodb+srv://yuriiafterglow:iOrGuFUnw2jtwAVC@cluster0.7hwngpn.mongodb.net/',
        {},
      );
      console.log('MongoDB connected');
      return mongoose.connection;
    } catch (err) {
      console.error('MongoDB connection error', err);
      throw err;
    }
  },
};
