import { api } from "@/lib/axios";

export interface Addiction {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  name: string;
  userId: string;
  partnerId: string | null;
}

export interface GetAllAddictionsResponse {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  id: string;
  name: string;
  userId: string;
  partnerId: string | null;
}
export interface CreateAddictionResponse {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  name: string;
  userId: string;
  partnerId: string | null;
}

export const createAddiction = async (
  name: string,
): Promise<CreateAddictionResponse> => {
  const response = await api.post("/addictions", { name });
  return response.data.data;
};

export const getAllAddictions = async (): Promise<
  GetAllAddictionsResponse[]
> => {
  const response = await api.get("/addictions");
  return response.data.data;
};

export const getAllPartneredAddictions = async (): Promise<
  GetAllAddictionsResponse[]
> => {
  const response = await api.get("/addictions/partnered");
  return response.data.data;
};

export const deleteAddictionById = async (addictionId: string) => {
  const response = await api.delete(`/addictions/${addictionId}`);
  return response.data.message;
};

export const renameAddictionById = async ({
  addictionId,
  name,
}: {
  addictionId: string;
  name: string;
}): Promise<Addiction> => {
  const response = await api.patch(`/addictions/${addictionId}`, { name });
  return response.data.data;
};
