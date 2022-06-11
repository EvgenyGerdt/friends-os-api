import { Types } from 'mongoose';
import { PersonalData } from '../models/User.schema';

export type UserDetails = {
  id: Types.ObjectId;
  email: string;
  personalData: PersonalData;
};
