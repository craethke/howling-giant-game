


export class Images {

    private static truckSrc = require('../assets/truck/truck_default_a.png');
    private static dustSrc = require('../assets/dust/dust_a.png');

    private static groundDefaultSrc = require('../assets/bg_tiles/bg_default.png');
    private static groundRockASrc = require('../assets/bg_tiles/bg_rock_a.png');
    private static groundRockBSrc = require('../assets/bg_tiles/bg_rock_b.png');
    private static tumbleweedSrc = require('../assets/tumbleweed/tumbleweed_a.png');
    
    private static cactusDeadSrc = require('../assets/cactus/cactus_dead.png');
    
    private static rockASrc = require('../assets/rock/rock_a.png');
    private static rockBSrc = require('../assets/rock/rock_b.png');
    private static cactusSrc = require('../assets/cactus/cactus.png');

    private static hudDefaultASrc = require('../assets/hud/hud_default_a.png');
    private static hudHeartEmptySrc = require('../assets/hud/hud_heart_empty.png');
    private static hudHeartFullSrc = require('../assets/hud/hud_heart_full.png');
    private static hudHeartHalfSrc = require('../assets/hud/hud_heart_half.png');
    private static hudHeartbarSrc = require('../assets/hud/hud_heartbar.png');

    private static smokecloudSrc = require('../assets/smokecloud/smokecloud_a.png');
    
    public static truck: HTMLImageElement = Images.loadImage(Images.truckSrc);
    public static dust: HTMLImageElement = Images.loadImage(Images.dustSrc);

    public static groundDefault: HTMLImageElement = Images.loadImage(Images.groundDefaultSrc);
    public static groundRockA: HTMLImageElement = Images.loadImage(Images.groundRockASrc);
    public static groundRockB: HTMLImageElement = Images.loadImage(Images.groundRockBSrc);
    public static tumbleweed: HTMLImageElement = Images.loadImage(Images.tumbleweedSrc);
    public static cactusDead: HTMLImageElement = Images.loadImage(Images.cactusDeadSrc);
    
    public static rockA: HTMLImageElement = Images.loadImage(Images.rockASrc);
    public static rockB: HTMLImageElement = Images.loadImage(Images.rockBSrc);
    public static cactus: HTMLImageElement = Images.loadImage(Images.cactusSrc);

    public static smokecloud: HTMLImageElement = Images.loadImage(Images.smokecloudSrc);

    public static hudDefaultA: HTMLImageElement = Images.loadImage(Images.hudDefaultASrc);
    public static hudHeartEmpty: HTMLImageElement = Images.loadImage(Images.hudHeartEmptySrc);
    public static hudHeartFull: HTMLImageElement = Images.loadImage(Images.hudHeartFullSrc);
    public static hudHeartHalf: HTMLImageElement = Images.loadImage(Images.hudHeartHalfSrc);
    public static hudHeartbar: HTMLImageElement = Images.loadImage(Images.hudHeartbarSrc);

    private static loadImage(src: string): HTMLImageElement {
        let image = new Image();
        image.src = src;
        return image;
    }
}