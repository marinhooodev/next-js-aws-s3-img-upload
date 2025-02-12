"use client";

import toast from "react-hot-toast";
import { deleteImage } from "./actions";
import { BiTrash } from "react-icons/bi";

export default function DeleteImageForm({ imageKey }: { imageKey: string }) {
    return (
        <form
            action={async (): Promise<any> => {
                const actionResponse = await deleteImage(imageKey as string);

                if (!actionResponse.success) {
                    return toast.error(actionResponse.message);
                }

                return toast.success(actionResponse.message);
            }}
        >
            <button className="bg-red-50 text-red-700 rounded p-4">
                <BiTrash className="w-6 h-6" />
            </button>
        </form>
    );
}
