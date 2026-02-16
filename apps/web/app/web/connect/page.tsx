"use client";
import axios from "axios";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ConnectPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const router = useRouter();
  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/web/validate-token?token=${token}`)
      .then((res) => {
        if (res.data.status == 200) {
          router.push("/api/auth/signin");
        }
      });
  }, [token]);

  return (
    <>
      <div>Connect To web</div>
    </>
  );
}
