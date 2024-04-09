export class Ball {
    x: number;
    y: number;
    color: string; 
    radius: number;
    speedX: number = 1;
    speedY: number = 1;

    constructor(x: number, y: number, color: string, radius: number) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = radius;
      }
    
    draw(ctx: CanvasRenderingContext2D): void {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
    }

    spawn(canvas: HTMLCanvasElement){
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
    }
}

export class PlayerBlock {
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
  
    constructor(x: number, y: number, w: number, h: number, color: string) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.color = color;
    }
  
    draw(ctx: CanvasRenderingContext2D): void {
      ctx.beginPath();
      ctx.rect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
    }

    spawn(canvas: HTMLCanvasElement, x: number){
        this.x = x;
        this.y = canvas.height / 2;
    }
}