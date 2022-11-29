export class Team {
	id!: number;
	ownerId!: number;
	name!: string;
	capacity: number = 15;
	numberOfPlayers: number = 0;
	logo: string =
		"https://www.pngkey.com/png/detail/66-661551_white-blank-shield-logo-school-logo-template-free.png";
	gold: number = 0;
	silver: number = 0;
	bronze: number = 0;
	numberOfGames: number = 0;
	numberOfWins: number = 0;
}
