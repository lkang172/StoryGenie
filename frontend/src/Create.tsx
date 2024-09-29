import React from "react";
import Input from "./Input";
import { User as UserType } from "./types";

interface User {
  username: string;
  _id: string; // Include _id if you are referencing it in Input
  // Add other user properties as needed
}

interface CreateProps {
  user: UserType | null;
}

const Create: React.FC<CreateProps> = ({ user }) => {
  return (
    <>
      <Input user={user} />
    </>
  );
};

export default Create;
