import FlashMessages from '@/Components/FlashMessages';
import Footer from '@/Components/Footer';
import Navbar from '@/Components/Navbar';

export default function AppLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50">
            <Navbar />
            <FlashMessages />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
