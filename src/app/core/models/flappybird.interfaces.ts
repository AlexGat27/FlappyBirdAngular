export interface Bird {
    x: number;
    y: number;
    color: string, 
    radius: number,
    skinPath: string
}

export class Obstacle {
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
      ctx.rect(this.x, this.y, this.w, this.h);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
    }
  }