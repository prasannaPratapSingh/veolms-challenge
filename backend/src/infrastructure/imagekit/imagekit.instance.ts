import ImageKit from "imagekit";
import envConfig from "../../config/envConfig.js";

const imageKit = new ImageKit({
    privateKey: envConfig.IMAGEKIT_PRIVATE_KEY,
    publicKey: envConfig.IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: "https://ik.imagekit.io/qvcxvle08/"
})

export default imageKit;