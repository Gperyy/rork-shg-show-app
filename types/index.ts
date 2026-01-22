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
  onesignal_player_id?: string;
}

export interface Participant {
  id: string;
  name: string;
  image: string;
  bio: string;
}
