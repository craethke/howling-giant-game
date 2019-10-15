
export class Images {

    private static assets = Images.loadAssets(require.context('Assets/', true, /\.png$/));
    private static images = Images.loadImages(Images.assets);

    private static loadImage(src: string): HTMLImageElement {
        let image = new Image();
        image.src = src;
        return image;
    }

    public static getImage(regex: RegExp) {
        return this.getImages(regex)[0];
    }

    public static getImages(regex: RegExp): HTMLImageElement[] {
        return Array.from(this.images.keys()).filter(i => regex.test(i)).map(i => Images.images.get(i));
    }

    private static loadImages(assets: Map<string, string>): Map<string, HTMLImageElement> {
        let images: Map<string, HTMLImageElement> = new Map<string, HTMLImageElement>();
        Array.from(assets.keys()).forEach((item: string) => images.set(item, Images.loadImage(assets.get(item))));
        return images;
    }

    private static loadAssets(imports: any): Map<string, string> {
        let assets: Map<string, string> = new Map<string, string>();
        imports.keys().forEach((item: any) => assets.set(item.replace('./', ''), imports(item)));
        return assets;
    }
}

export class Sounds {

    private static assets = Sounds.loadAssets(require.context('Assets/', true, /\.mp3$/));
    private static sounds: Map<string, HTMLAudioElement> = Sounds.loadSounds(Sounds.assets);

    public static getSound(regex: RegExp) {
        return Array.from(Sounds.sounds.keys()).filter(i => regex.test(i)).map(i => Sounds.sounds.get(i))[0];
    }

    private static loadAssets(imports: any): Map<string, string> {
        let assets: Map<string, string> = new Map<string, string>();
        imports.keys().forEach((item: any) => assets.set(item.replace('./', ''), imports(item)));
        return assets;
    }

    private static loadSounds(assets: Map<string, string>): Map<string, HTMLAudioElement> {
        let sounds: Map<string, HTMLAudioElement> = new Map<string, HTMLAudioElement>();
        Array.from(assets.keys()).forEach((item: string) => sounds.set(item, Sounds.loadSound(assets.get(item))));
        return sounds;
    }

    private static loadSound(src: string): HTMLAudioElement {
        return new Audio(src);
    }
}
