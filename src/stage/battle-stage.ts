import { Application, Sprite, Texture, Text, BaseTexture, AnimatedSprite, Rectangle, MIPMAP_MODES, SCALE_MODES, InteractionEvent, InteractivePointerEvent, Container, Graphics, Point } from "pixi.js";
import { Stage } from "../utils/stage";
import { Battle, Character, loadBattle } from "../state/battlefield";

import { CharacterContainer } from "../components/character";
import * as PIXI from "pixi.js";
import Utils from "../utils/utils";
import PixiFps from "pixi-fps";
const fpsCounter = new PixiFps();

const SPRITE_WIDTH = 48;
const SPRITE_HEIGHT = 48;

const TERRAIN_WIDTH = 32;
const TERRAIN_HEIGHT = 32;

const TILE_WIDTH = 64;
const TILE_HEIGHT = 64;

export class BattleStage extends Stage {



  text: any;

  battle?: Battle;
  grid: Point = new Point(0, 0);
  previousGrid: Point = new Point(0, 0);

  scrollSpeed: Point = new Point(0, 0);
  cursorout: boolean = true;
  terrainTexture: any;

  cursorSprite: Sprite | undefined;
  terrainLayer: any;
  //graphics = new PIXI.Graphics();

  cursorLayer: any;

  constructor(app: Application) {
    super(app);
  }

  initialize(): void {
    this.loadTerrain();
    this.battle = loadBattle();


    console.log(this.battle);
    this.terrainLayer = new PIXI.Container();
    this.cursorLayer = new PIXI.Container();
    this.addChild(this.terrainLayer);


    for (let i = 0; i < 70; i++) {
      for (let j = 0; j < 40; j++) {
        const a1 = this.loadTerrainSprite(Utils.RandInt(0, 2), 5);
        a1.position.set(TILE_WIDTH / 2 * i, TILE_HEIGHT / 2 * j);
        this.terrainLayer.addChild(a1);
      }
    }

    for (let teamI = 0; teamI < this.battle.teams.length; teamI++) {
      let team = this.battle.teams[teamI];
      for (let charI = 0; charI < team.characters.length; charI++) {
        let character = team.characters[charI];
        const characterSprite = new CharacterContainer(character);
        characterSprite.setPosition(character.x, character.y);
        this.terrainLayer.addChild(characterSprite);
      }
    }

    const graphics = new Graphics();
    graphics.lineStyle(2, 0xFFFFFF, 1);
    graphics.beginFill(0x650A5A, 0.25);
    graphics.drawRoundedRect(0, 0, TILE_WIDTH, TILE_HEIGHT, 8);
    graphics.endFill();

    this.text = new Text('', {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0xffffff,
      align: 'center',
    });
    this.text.position.set(0, 100);

    this.terrainLayer.addChild(this.cursorLayer);

    this.cursorLayer.addChild(graphics);

    this.scale.set(1);

    this.cursorSprite = this.loadCursor();

    this.addChild(fpsCounter);
    this.addChild(this.text);
    this.addChild(this.cursorSprite);
  }

  pointerMove(x: number, y: number): void {
    this.grid.x = Math.floor((this.cursorPosition.x - this.terrainLayer.x) / TILE_WIDTH);
    this.grid.y = Math.floor((this.cursorPosition.y - this.terrainLayer.y) / TILE_HEIGHT);



    if (this.grid.x !== this.previousGrid.x || this.grid.y !== this.previousGrid.y) {
      const currentCharacter = this.getCurrentCharacter();

      console.log('update')

      if (currentCharacter) {
        this.text.text = currentCharacter.name;
      }
    }


    const gridx = this.grid.x * TILE_WIDTH;
    const gridy = this.grid.y * TILE_HEIGHT;
    this.cursorSprite?.position.set(this.cursorPosition.x, this.cursorPosition.y);
    this.cursorLayer.position.set(gridx, gridy);


    this.previousGrid.x = this.grid.x;
    this.previousGrid.y = this.grid.y;
  }

  update(delta: number): void {


    //this.text.text = `${this.cursorPosition.x}:${this.cursorPosition.y}`






    this.terrainLayer.x += this.scrollSpeed.x;
    this.terrainLayer.y += this.scrollSpeed.y;
    this.scrollSpeed.x *= 0.8;
    this.scrollSpeed.y *= 0.8;

    if (this.terrainLayer.x < -1000 - this.app.renderer.screen.width) {
      this.terrainLayer.x = -1000 - this.app.renderer.screen.width
    }

    if (this.terrainLayer.x > 0) {
      this.terrainLayer.x = 0
    }

    if (this.terrainLayer.y < -1000 - this.app.renderer.screen.height) {
      this.terrainLayer.y = -1000 - this.app.renderer.screen.height
    }

    if (this.terrainLayer.y > 0) {
      this.terrainLayer.y = 0
    }

    if (this.cursorIn) {
      if (this.cursorSprite) {
        this.cursorSprite.visible = true;
      }
      if (this.cursorPosition.x > this.app.renderer.screen.width - 100) {
        this.scrollSpeed.x -= 2;
      }
      if (this.cursorPosition.x < 100) {
        this.scrollSpeed.x += 2;
      }


      if (this.cursorPosition.y > this.app.renderer.screen.height - 100) {
        this.scrollSpeed.y -= 2;
      }
      if (this.cursorPosition.y < 100) {
        this.scrollSpeed.y += 2;
      }
    }
    else {
      if (this.cursorSprite) {
        this.cursorSprite.visible = false;
      }
    }
  }

  getCurrentCharacter(): Character | null {

    return this.battle?.characterMap.get(this.grid.x, this.grid.y);
  }

  loadBattle(): void {

  }

  loadCursor(): Sprite {
    const cursorTexture = new BaseTexture('./assets/cursor.png', { mipmap: MIPMAP_MODES.ON, scaleMode: SCALE_MODES.NEAREST });
    return new PIXI.Sprite(new Texture(cursorTexture));
  }

  loadTerrain(): void {
    this.terrainTexture = new BaseTexture('./assets/terrain-v7.png', { mipmap: MIPMAP_MODES.ON, scaleMode: SCALE_MODES.NEAREST });
  }

  loadTerrainSprite(x: number, y: number): PIXI.Sprite {
    const sprite = new PIXI.Sprite(new Texture(this.terrainTexture, new Rectangle(TERRAIN_WIDTH * x, TERRAIN_HEIGHT * y, TERRAIN_WIDTH, TERRAIN_HEIGHT)));
    sprite.scale.set(1);
    sprite.pivot.set(0, 0)
    return sprite;
  }

  loadAnimatedSprite(fileName: string, x: number, y: number): AnimatedSprite {
    const texture: BaseTexture = new BaseTexture(fileName, { mipmap: MIPMAP_MODES.ON, scaleMode: SCALE_MODES.NEAREST });


    const tex = new Array<Texture>();
    for (let i = 0; i < 3; i++) {
      tex.push(new Texture(texture, new Rectangle(SPRITE_WIDTH * i + x * 3 * SPRITE_WIDTH, y * SPRITE_HEIGHT, SPRITE_WIDTH, SPRITE_HEIGHT)));
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
    actor.scale.set(1);


    /*
    const colorMatrix = new PIXI.filters.ColorMatrixFilter();
    actor.filters = [colorMatrix];
    colorMatrix.desaturate();*/


    return actor;
  }



}



