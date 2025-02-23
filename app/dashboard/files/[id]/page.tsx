"use client"; // Mark this as a Client Component

import React from "react";
import { useParams } from "next/navigation";

function ChatToFilePage() {
  const { id } = useParams(); // Get dynamic id

  if (!id) {
    return <div>Loading...</div>; // Handle case when id is not yet available
  }

  return <div>ChatToFilePage: {id}</div>;
}

export default ChatToFilePage;
