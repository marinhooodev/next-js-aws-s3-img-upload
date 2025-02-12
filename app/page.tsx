import { uploadImage } from "./actions";
import ImageGallery from "./image-gallery";
import UploadForm from "./uploadForm";
import UppyUpload from "./uppyUpload";

export default function Home() {
    return (
        <>
            <main className="max-w-[900px] mx-auto px-4 py-8 text-center flex-1 ">
                <header>
                    <h1 className="text-3xl font-black text-slate-600 mb-2">
                        Photo Upload
                    </h1>
                    <p className="text-gray-500 mb-8 font-light">
                        Next.js Photo Gallery, image upload and AWS S3
                    </p>
                </header>

                {/* Upload Form */}
                <UppyUpload />
                {/* <UploadForm /> */}

                {/* Image Gallery */}
                <hr />
                <ImageGallery />
            </main>
            <footer className="bg-slate-600 py-4 w-full"></footer>
        </>
    );
}
