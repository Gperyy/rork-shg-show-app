export interface Show {
  id: string;
  title: string;
  time: string;
  endTime: string;
  description: string;
  category?: string;
  date?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface Participant {
  id: string;
  name: string;
  country: string;
  aircraft: string;
  image: string;
  bio: string;
}
