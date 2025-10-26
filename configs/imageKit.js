import ImageKit from "imagekit";

const imageKit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export default imageKit;

// const response = await client.files.upload({
//     file: fs.createReadStream('path/to/file'),
//     fileName: 'file-name.jpg',
// });

// console.log(response);