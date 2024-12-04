import { getDocumentById } from "@auth/elasticsearch";

export const gigById = async (index: string, gigId: string) => {
  const gig = await getDocumentById(index, gigId);

  return gig;
};
