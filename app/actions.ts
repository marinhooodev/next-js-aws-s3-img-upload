"use server";

import {
    DeleteObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
} from "@aws-sdk/client-s3";
import { s3Client } from "./lib/s3Client";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

export async function uploadImage(formData: FormData) {
    //image that was uploaded in the form
    const image = formData.get("image") as File;

    if (!image.size) {
        return {
            success: false,
            message: "No image uploaded",
        };
    }

    if (!image.type.startsWith("image/")) {
        return {
            success: false,
            message: "Invalid file type",
        };
    }

    // 0.4MB limit
    if (image.size > 0.4 * 1024 * 1024) {
        return {
            success: false,
            message: "File size too large. 400kb limit",
        };
    }
    // verify if the AWS S3 bucket is too large
    if (await bucketHasTooManyObjects()) { 
        return {
            success: false,
            message:
                "This application has too many images. Please delete some images before uploading more.",
        };
    }
    //javascript buffer
    const arrayBuffer = await image.arrayBuffer();
    //node buffer
    const imageBuffer = Buffer.from(arrayBuffer);

    const putObjectParams = new PutObjectCommand({
        Bucket: "codante-photo-upload",
        Key: `${nanoid()}.${image.type.split("/")[1]}`,
        Body: imageBuffer,
        ContentType: image.type,
    });

    try {
        await s3Client.send(putObjectParams);
        revalidatePath("/");

        return {
            success: true,
            message: "Image uploaded successfully",
        };
    } catch (e) {
        return {
            success: false,
            message: "Oops... Something went wrong",
            error: e,
        };
    }
}

export async function uploadImageWithUppy(formData: FormData) {
    const images: File[] = formData.getAll("images") as File[];

    images.forEach(async (image) => {
        if (!image.size) {
            return {
                success: false,
                message: "No image uploaded",
            };
        }

        if (!image.type.startsWith("image/")) {
            return {
                success: false,
                message: "Invalid file type",
            };
        }

        // 0.5MB limit
        if (image.size > 0.4 * 1024 * 1024) {
            return {
                success: false,
                message: "File size too large",
            };
        }
    });

    if (await bucketHasTooManyObjects()) {
        return {
            success: false,
            message:
                "This application has too many images. Please delete some images before uploading more.",
        };
    }

    const promises = images.map(async (image) => {
        const arrayBuffer = await image.arrayBuffer();
        const imageBuffer = Buffer.from(arrayBuffer);
        const putObjectParams = new PutObjectCommand({
            Bucket: "codante-photo-upload",
            Key: `${nanoid()}.${image.type.split("/")[1]}`,
            Body: imageBuffer,
            ContentType: image.type,
        });

        return s3Client.send(putObjectParams);
    });

    await Promise.all(promises);
    revalidatePath("/");

    return {
        success: true,
        message: "Images uploaded successfully",
    };
}

async function bucketHasTooManyObjects() {
    // AWS S3 bucket can have up to 1000 objects

    const listObjectsParams = new ListObjectsV2Command({
        Bucket: "codante-photo-upload",
    });

    const objects = await s3Client.send(listObjectsParams);

    if ((objects.Contents?.length ?? 0) >= 10) {
        return true;
    }

    return false;
}

export async function deleteImage(key: string) {
    const deleteObjectParams = new DeleteObjectCommand({
        Bucket: "codante-photo-upload",
        Key: key,
    });

    try {
        await s3Client.send(deleteObjectParams);
        revalidatePath("/");
        return {
            success: true,
            message: "Image deleted successfully",
        };
    } catch (error) {
        return {
            success: false,
            message: "Oops... Something went wrong",
            error: error,
        };
    }
}
