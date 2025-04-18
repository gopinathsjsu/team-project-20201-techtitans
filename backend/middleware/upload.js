import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { config } from "dotenv";

config();

const s3 = new S3Client({
	region: process.env.AWS_REGION_IMAGES,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID_IMAGES,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_IMAGES,
	},
});

const storage = multer.memoryStorage();

const upload = multer({ storage });

export const uploadToS3 = async (file) => {
	const params = {
		Bucket: process.env.AWS_BUCKET_NAME_IMAGES,
		Key: `images/${Date.now()}-${file.originalname}`,
		Body: file.buffer,
		ContentType: file.mimetype,
	};

	try {
		const data = await s3.send(new PutObjectCommand(params));
		return `https://${process.env.AWS_BUCKET_NAME_IMAGES}.s3.${process.env.AWS_REGION_IMAGES}.amazonaws.com/${params.Key}`;
	} catch (err) {
		console.error("Error uploading to S3", err);
		throw new Error("Error uploading to S3");
	}
};

export default upload;
