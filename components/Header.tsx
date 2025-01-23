import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div>
      <Link href="/dashboard" className="text-2xl">
        Chat to <span className="text-indigo-600">PDF</span>
      </Link>
    </div>
  );
};

export default Header;
