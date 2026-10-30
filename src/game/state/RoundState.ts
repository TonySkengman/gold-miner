export class RoundState {
    score = 0;
    remaining = 60;
    readonly target = 650;

    get finished(): boolean { return this.remaining <= 0; }
    get won(): boolean { return this.score >= this.target; }

    update(seconds: number): void {
        this.remaining = Math.max(0, this.remaining - seconds);
    }
}
