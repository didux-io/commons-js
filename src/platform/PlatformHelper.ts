export type PlatformType = "android" | "ios" | "node" | "other";

export class PlatformHelper {
    private static instance: PlatformHelper;

    private platformType: PlatformType;

    private constructor(platformType: PlatformType) {
        this.platformType = platformType;
    }

    static getInstance(): PlatformHelper {
        if(!PlatformHelper.initialize)
            throw new Error("PlatformHelper is not yet initialized");

        return PlatformHelper.instance;
    }

    /**
     * Initializes the PlatformHelper with the platform type.
     * @param platformType The platform type.
     */
    static initialize(platformType: PlatformType) {
        if(PlatformHelper.instance)
            throw new Error("PlatformHelper is already initialized");

        PlatformHelper.instance = new PlatformHelper(platformType);
    }

    isAndroid(): boolean {
        return this.platformType == "android";
    }

    isIos(): boolean {
        return this.platformType == "ios";
    }

    isNode(): boolean {
        return this.platformType == "node";
    }

    isOther(): boolean {
        return this.platformType == "other";
    }
}