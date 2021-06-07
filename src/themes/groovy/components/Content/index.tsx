import React, { useEffect, useRef } from "react";
import * as styles from "./content.module.css";

interface IContentProps {
  currentPage: string | undefined;
  pages: any;
}

const Content: React.FC<IContentProps> = ({ children, currentPage, pages }): JSX.Element => {
  const contentRef = useRef(null);
  useEffect(() => {
    if (!pages[currentPage]) return;
    const { offsetTop } = pages[currentPage];
    contentRef.current.scrollTo({
      top: offsetTop,
      left: 0,
      behavior: 'smooth'
    });
  }, [pages, currentPage]);
  return (
    <div className={styles.Content} ref={contentRef}>
      {children}
    </div>
  )
}

export default Content;