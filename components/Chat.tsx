"use client";

import { FormEvent, useEffect, useRef, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loader2Icon } from "lucide-react";
import { useCollection } from "react-firebase-hooks/firestore";
import { useUser } from "@clerk/nextjs";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";

export type Message = {
  id: string;
  role: "human" | "ai" | "placeholder";
  message: string;
  createdAt: Date;
};

const Chat = ({ id }: { id: string }) => {
  const { user } = useUser();

  const [input, setInput] = useState("");
  const [message, setMessage] = useState<Message[]>([]);
  const [isPending, setIsPending] = useTransition();

  return (
    <div className=" flex flex-col h-full overflow-scroll">
      {/* {chat} */}

      <div className="flex-1 w-full">{/* chat message */}</div>

      <form action=""></form>
    </div>
  );
};

export default Chat;
