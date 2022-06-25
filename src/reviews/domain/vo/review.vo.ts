export class Review {
  game: string;
  rating: number;
  payToWin: number;

  constructor({
    game,
    rating,
    payToWin,
  }: {
    game?: string;
    rating?: number;
    payToWin?: number;
  }) {
    this.game = game;
    this.rating = rating;
    this.payToWin = payToWin;
  }
}
