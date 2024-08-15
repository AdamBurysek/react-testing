import { Select, Table } from "@radix-ui/themes";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useQuery } from "react-query";
import QuantitySelector from "../components/QuantitySelector";
import { Category, Product } from "../entities";
import { useState } from "react";

function BrowseProducts() {
  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery<Product[], Error>({
    queryKey: ["product"],
    queryFn: () => axios.get<Product[]>("/products").then((res) => res.data),
  });

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery<Category[], Error>({
    queryKey: ["category"],
    queryFn: () => axios.get<Category[]>("/categories").then((res) => res.data),
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >();

  if (productsError) return <div>Error: {productsError.message}</div>;

  const renderCategories = () => {
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

  const renderProducts = () => {
    const skeletons = [1, 2, 3, 4, 5];

    if (productsError) return <div>Error: {productsError}</div>;

    const visibleProducts = selectedCategoryId
      ? products!.filter((p) => p.categoryId === selectedCategoryId)
      : products;

    return (
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body
          role={productsLoading ? "progressbar" : undefined}
          aria-label={productsLoading ? "Loading Products" : undefined}
        >
          {productsLoading &&
            skeletons.map((skeleton) => (
              <Table.Row key={skeleton}>
                <Table.Cell>
                  <Skeleton />
                </Table.Cell>
                <Table.Cell>
                  <Skeleton />
                </Table.Cell>
                <Table.Cell>
                  <Skeleton />
                </Table.Cell>
              </Table.Row>
            ))}
          {!productsLoading &&
            visibleProducts!.map((product) => (
              <Table.Row key={product.id}>
                <Table.Cell>{product.name}</Table.Cell>
                <Table.Cell>${product.price}</Table.Cell>
                <Table.Cell>
                  <QuantitySelector product={product} />
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>
    );
  };

  return (
    <div>
      <h1>Products</h1>
      <div className="max-w-xs">{renderCategories()}</div>
      {renderProducts()}
    </div>
  );
}

export default BrowseProducts;
