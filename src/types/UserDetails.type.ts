import { PersonalData } from '../interfaces/CreateUser.dto';

export type UserDetails = {
  id: string;
  email: string;
  personalData: PersonalData;
};
