import axios from "axios";
import { useEffect, useState } from "react";
import { getErrorMessage } from "../utils/getErrorMessage";
import { toast } from "sonner";

export const useUserTags = () => {
  const [tags, setTags] = useState<any[]>([]);
  const [fetchTagsLoading, setFetchTagsLoading] = useState<boolean>(false);

  const fetchTags = async () => {
    setFetchTagsLoading(true);
    try {
      const res = await axios.get("/api/web/tag");
      setTags(res.data.data);
    } catch (error) {
      toast.error(getErrorMessage(error), { position: "top-center" });
    } finally {
      setFetchTagsLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return { tags, fetchTagsLoading };
};
