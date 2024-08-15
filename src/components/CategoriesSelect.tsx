import { Select } from "@radix-ui/themes";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import { useQuery } from "react-query";
import { Category } from "../entities";

interface Props {
  setSelectedCategoryId: (categoryId: number | undefined) => void;
}

const CategoriesSelect = ({ setSelectedCategoryId }: Props) => {
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery<Category[], Error>({
    queryKey: ["category"],
    queryFn: () => axios.get<Category[]>("/categories").then((res) => res.data),
  });

  if (categoriesLoading)
    return (
      <div role="progressbar" aria-label="Loading Categories">
        <Skeleton />
      </div>
    );
  if (categoriesError) return null;
  return (
    <Select.Root
      onValueChange={(categoryId) =>
        setSelectedCategoryId(parseInt(categoryId))
      }
    >
      <Select.Trigger placeholder="Filter by Category" />
      <Select.Content>
        <Select.Group>
          <Select.Label>Category</Select.Label>
          <Select.Item value="all">All</Select.Item>
          {categories?.map((category) => (
            <Select.Item key={category.id} value={category.id.toString()}>
              {category.name}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};

export default CategoriesSelect;
