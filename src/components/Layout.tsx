import Header from "./Header";
import Footer from "./Footer";
import React from "react";
import { Link } from "react-router-dom";

type LayoutProps = {
  children: React.ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <>
    {/* <Link to ='/'> */}
      <Header title="VSV Smart Milk App" />
    {/* </Link> */}

      <main className="content">
        {children}
      </main>

      <Footer />
    </>
  );
}

export default Layout;