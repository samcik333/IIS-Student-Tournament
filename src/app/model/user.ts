export class User {
  id!: number;
  name!: string;
  lastname!: string;
  username!: string;
  email!: string;
  password!: string;
  photo: string = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
  role: 'admin' | 'user' = 'user';
  gold: number = 0;
  silver: number = 0;
  bronze: number = 0;
  numberOfGames: number = 0;
  numberOfWins: number = 0;
  likedTournaments: number[] = [];
}
