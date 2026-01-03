import React from "react";
import { Link } from "react-router-dom";
import finbugLogo from '../../assets/finbug.png';
import IN_IMG from '../../assets/images/in.jpg';

const AuthLayout = ({ children, showRight = true }) => {
  return (
    <div className="min-h-screen flex bg-white">
      <div className="w-full md:w-[60vw] px-6 md:px-12 py-8 flex flex-col">
        <Link to="/" className="flex items-center gap-2 mb-12">
          <img src={finbugLogo} alt="FinBug" className="w-10 h-10" />
          <span className="text-xl font-semibold">FinBug</span>
        </Link>
        {children}
      </div>

      {showRight && (
        <div className="hidden md:block w-[40vw] h-screen relative">
          <img src={IN_IMG} alt="right-side" className="absolute inset-0 w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
};

export default AuthLayout;