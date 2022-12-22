import { Container, Application, TickerCallback, Point, InteractionEvent } from "pixi.js";

export abstract class Stage extends Container {

  app: any;
  cursorPosition = new Point();
  cursorIn: boolean = false;

  constructor(app: Application) {
    super();
    this.app = app;
    this.initialize();
    this.interactive = true;


    this.on('pointermove', (response: InteractionEvent) => {
      const { x, y } = response.data.global;
      this.cursorPosition.x = x;
      this.cursorPosition.y = y;
      this.cursorIn = true;
      this.pointerMove(x, y);
    })
    this.on('pointerout', () => {
      this.cursorIn = false;
    })
    const updateContainer = (delta: number) => { this.update(delta) };
    app.ticker.add(updateContainer);
    this.on('removed', () => {
      app.ticker.remove(updateContainer);
    });
  }

  abstract pointerMove(x: number, y: number): void;

  abstract initialize(): void;

  abstract update(delta: number): void;


}