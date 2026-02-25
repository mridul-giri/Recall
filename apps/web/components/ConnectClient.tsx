"use client";
import axios from "axios";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { Spinner } from "@repo/ui";
import { getErrorMessage } from "../utils/getErrorMessage";

export const ConnectClient = ({ token }: any) => {
  const validateToken = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/web/validate-token?token=${token}`,
      );
      if (res.data.status == 200) {
        redirect("/auth/register");
      }
    } catch (error) {
      toast.warning(getErrorMessage(error), { position: "top-center" });
      redirect("/");
    }
  };

  useEffect(() => {
    validateToken();
  }, [token]);

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="flex justify-center items-center gap-2 tertiary-bg py-4 px-10 text-white rounded-2xl">
        <Spinner className="w-10 h-10" />
        <h1 className="text-4xl font-medium">Validating</h1>
      </div>
    </div>
  );
};
