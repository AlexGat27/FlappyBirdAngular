export interface IGameService{
    InitGameEnvironment(canvas: HTMLCanvasElement, ...args: any[]): void;
    GameProcessing(ctx: CanvasRenderingContext2D, ...args: any[]): void;
    StartGame(): void;
    StopGame(): void;
    CheckHandle(landmarks: any): void;
}