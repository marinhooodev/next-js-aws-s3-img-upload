import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import Image from "next/image";
import { s3Client } from "./lib/s3Client";
import DeleteImageForm from "./deleteImageForm";

export default async function ImageGallery() {
    const objectListParams = new ListObjectsV2Command({
        Bucket: "codante-photo-upload",
    });

    const objectList = await s3Client.send(objectListParams);
    objectList.Contents?.sort((a: any, b: any) => {
        return (
            new Date(b.LastModified).getTime() -
            new Date(a.LastModified).getTime()
        );
    });

    const imageList = objectList.Contents?.map((object) => object.Key);

    return (
        <>
            <h2 className="text-2xl font-bold text-slate-600 mb-4 mt-4">
                Image Gallery
            </h2>

            <div className="grid grid-cols-3 gap-4">
                {imageList?.map((filename, index) => (
                    <div
                        key={index}
                        className="rounded-md overflow-hidden  bg-white shadow-md h-[280px] w-[280px]"
                    >
                        <div className="relative group w-[90%] h-[90%] mx-auto mt-[5%]">
                            <div
                                className="absolute flex items-center justify-center inset-0 
                            invisible 
                            group-hover:visible group-hover:bg-gray-800 group-hover:bg-opacity-60 transition-colors"
                            >
                                <DeleteImageForm imageKey={filename || ""} />
                            </div>

                            <Image
                                className="w-full h-full object-cover"
                                width={280}
                                height={280}
                                src={`https://codante-photo-upload.s3.sa-east-1.amazonaws.com/${filename}`}
                                alt="Dog image"
                            ></Image>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
