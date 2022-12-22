
import * as PIXI from "pixi.js";
import { Application, Loader, Texture, BaseTexture, AnimatedSprite, Rectangle, MIPMAP_MODES, SCALE_MODES, InteractionEvent, InteractivePointerEvent, Container } from "pixi.js";
import { getSpine } from "./spine-example";
import { getLayersExample } from "./layers-example";
import { BattleStage } from "./stage/battle-stage";
import "./style.css";
import Utils from "./utils/utils";
import PixiFps from "pixi-fps";

const fpsCounter = new PixiFps();

declare const VERSION: string;

const gameWidth = 800;
const gameHeight = 600;



console.log(`Welcome from pixi-typescript-boilerplate ${VERSION}`);

const app = new Application({
    backgroundColor: 0xd3d3d3,
    width: gameWidth,
    height: gameHeight,
});
let battleStage: any;
window.onload = async (): Promise<void> => {
    await loadGameAssets();
    document.body.appendChild(app.view);
    resizeCanvas();
    battleStage = new BattleStage(app);
    app.stage.addChild(battleStage);
};



async function loadGameAssets(): Promise<void> {
    return new Promise((res, rej) => {
        const loader = Loader.shared;

        loader.onComplete.once(() => {
            res();
        });

        loader.onError.once(() => {
            rej();
        });

        loader.load();
    });
}

function resizeCanvas(): void {
    const resize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        app.stage.scale.x = 1;
        app.stage.scale.y = 1;
    };
    resize();
    window.addEventListener("resize", resize);
}

