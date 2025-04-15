import { HEALTH_MONGOOSE_PROVIDER } from '@app/monitoring';
import mongoose, { Connection } from 'mongoose';

export const mongooseProvider = {
  provide: HEALTH_MONGOOSE_PROVIDER,
  useFactory: async (): Promise<Connection> => {
    try {
      await mongoose.connect(
        'mongodb+srv://yuriiafterglow:<db_password>@cluster0.7hwngpn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
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
