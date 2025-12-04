import Navbar from "../common/Navbar";
import Footer from "../common/Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="ll-shell">
      <Navbar />
      <main className="ll-main">
        <div className="ll-main-inner">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
