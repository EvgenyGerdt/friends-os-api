export interface CreateUserDTO {
  email: string;
  password: string;
  personalData: PersonalData;
}

export type PersonalData = {
  firstName: string;
  lastName: string;
  birthday: string;
};
