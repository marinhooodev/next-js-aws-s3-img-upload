"use client";

import Uppy from "@uppy/core";
import Dashboard from "@uppy/react/lib/Dashboard";
import { useEffect, useState } from "react";

// @ts-ignore
import pt_BR from "@uppy/locales/lib/pt_BR";

import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import "./uppy-style.css";
import { uploadImageWithUppy } from "./actions";
import toast from "react-hot-toast";

export default function UppyUpload() {
    const [uppy, setUppy] = useState<Uppy | null>(null);

    useEffect(() => {
        // initialize Uppy
        const uppy = new Uppy().on("complete", (result) => {
            const images = result.successful;
            const formData = new FormData();

            images?.forEach((image) => {
                formData.append("images", image.data);
            });

            uploadImageWithUppy(formData).then((actionResponse) => {
                uppy.cancelAll();

                if (!actionResponse?.success) {
                    toast.error("Oops..." + actionResponse?.message);
                }

                toast.success(actionResponse?.message);
            });
        });
        // state change
        setUppy(uppy);
    }, []);

    return (
        <div>
            {uppy && <Dashboard width={"100%"} height={300} uppy={uppy} />}
        </div>
    );
}
