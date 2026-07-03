import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 px-4">
        <p className="text-7xl font-bold text-amber-500">404</p>
        <h1 className="text-2xl font-bold text-white">Page Not Found</h1>
        <p className="text-gray-400 text-center">
          The page you are looking for does not exist.
        </p>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
      <Footer />
    </div>
  );
}
