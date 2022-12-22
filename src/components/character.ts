import { Application, Sprite, Texture, Text, BaseTexture, AnimatedSprite, Rectangle, MIPMAP_MODES, SCALE_MODES, InteractionEvent, InteractivePointerEvent, Container, Graphics, Point } from "pixi.js";
import { Character } from "../state/battlefield";
import { SPRITE_HEIGHT, SPRITE_WIDTH, TILE_HEIGHT, TILE_WIDTH } from "../state/constants";

export class CharacterContainer extends Container {

  pos: Point = new Point(0, 0);
  character?: Character;
  wholeLayer?: Container;

  constructor(character: Character) {
    super();
    const profession = character.profession;
    this.character = character;
    this.wholeLayer = new Container();
    this.addChild(this.wholeLayer);


    const shadowTexture: BaseTexture = new BaseTexture(`./assets/shadow.png`, { mipmap: MIPMAP_MODES.ON, scaleMode: SCALE_MODES.NEAREST });
    const shadow: Sprite = new Sprite(new Texture(shadowTexture));
    this.wholeLayer.addChild(shadow);

    if (profession && profession.spriteFile) {
      const sprite = this.loadAnimatedSprite(profession.spriteFile, profession.spriteX || 0, profession.spriteY || 0);
      this.wholeLayer.addChild(sprite);
    }
  }

  setPosition(x: number, y: number): void {
    this.pos.x = x;
    this.pos.y = y;
    this.wholeLayer?.position.set(this.pos.x * TILE_WIDTH, this.pos.y * TILE_HEIGHT);
  }

  loadAnimatedSprite(fileName: string, x: number, y: number): AnimatedSprite {



    const texture: BaseTexture = new BaseTexture(`./assets/${fileName}`, { mipmap: MIPMAP_MODES.ON, scaleMode: SCALE_MODES.NEAREST });
    const tex = new Array<Texture>();
    for (let i = 0; i < 3; i++) {
      tex.push(new Texture(texture, new Rectangle(SPRITE_WIDTH * i + x * 3 * SPRITE_WIDTH, y * 4 * SPRITE_HEIGHT, SPRITE_WIDTH, SPRITE_HEIGHT)));
    }
    const actor = new AnimatedSprite([
      tex[0],
      tex[1],
      tex[2],
      tex[1]
    ]);
    actor.loop = true;
    actor.animationSpeed = 0.1;
    actor.play();
    actor.pivot.set(0.5, 0.5);
    actor.position.set(10, 6);
    actor.scale.set(1);
    return actor;
  }
}
