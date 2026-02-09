import AbstractAnimation from "@/components/AbstractAnimation";
import OrbitalMenu from "@/components/OrbitalMenu";

export default function Home() {
    return (
        <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
            {/* 3D Background */}
            <AbstractAnimation />

            {/* Content */}
            <div className="z-10 flex flex-col items-center justify-center w-full h-full">
                <OrbitalMenu />
            </div>
        </main>
    );
}
