import React from "react";

const Footer = () => {
  return (
    <footer className="footer bg-gray-800 text-white text-center p-4 mt-8 flex justify-center">
      <p>© {new Date().getFullYear()} Study Materials. All rights reserved.</p>
    </footer>
  );
};

export default Footer;