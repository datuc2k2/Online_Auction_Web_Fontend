// /layout/CommonLayout.js
import Footer from '@/components/footer/Footer';
import Header1 from '@/components/header/Header1';
import React, { MemoExoticComponent } from 'react';

export const CommonLayout = (WraperContent: MemoExoticComponent<() => JSX.Element>) => {
  // Return a new component that wraps the content with Header and Footer
  const LayoutWrapper = (props: any) => {
    return (
      <>
        <Header1 />
        <div style={{ padding: "0px 70px" }}>
          <WraperContent {...props} />
        </div>
        <Footer />
      </>
    );
  };

  return LayoutWrapper;
};
