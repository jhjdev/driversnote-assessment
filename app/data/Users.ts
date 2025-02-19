import data from './users.json';

export type User = {
  id: number;
  full_name: string | null;
  address1: string | null;
  address2: string | null;
  postal_code: number | string | null;
  city: string | null;
  country_name: string;
  country_id: string;
  organisation_id: number | null;
};

export const users: Array<User> = data;
