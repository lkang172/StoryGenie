import React from "react";
import Input from "./Input";

interface User {
  // Define the User type here
  username: string;
  // Add other user properties as needed
}

interface CreateProps {
  user: User | null;
}

const Create: React.FC<CreateProps> = ({ user }) => {
  return (
    <>
      <Input />
    </>
  );
};

export default Create;
