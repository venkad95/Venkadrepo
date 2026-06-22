import Header from "./Header";
import Footer from "./Footer";
import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header title="VSV Smart Milk App" />

      <main className="content">
        {children}
      </main>

      <Footer />
    </>
  );
}

export default Layout;