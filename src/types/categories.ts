export type CategoryType = "income" | "expense";


export interface Category {
  id: string
  name: string
  type: "income" | "expense"
  color?: string
}

export interface CreateCategoryDTO {
  name: string;
  type: CategoryType;
  userId: string;
}

export interface UpdateCategoryDTO {
  name?: string;
  type: CategoryType;
}