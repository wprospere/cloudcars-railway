import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">

      <Header />

      <main className="flex-1">{children}</main>

      <Footer />

    </div>
  );
}