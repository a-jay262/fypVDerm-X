export declare class ImageControllerr {
    predict(file: any): Promise<{
        prediction: any;
        error?: undefined;
    } | {
        error: any;
        prediction?: undefined;
    }>;
}
