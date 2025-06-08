import Product from '.';

type ProductListProps = {
  list: Array<{ retailer: string; pointOfSale: string; product: string; date: Date }>;
};

export default function ProductList({ list }: ProductListProps) {
  return (
    <div className="overflow-x-auto">
      <div className="grid grid-rows-2 auto-cols-max grid-flow-col gap-4 min-w-max">
        {list.map((item, index) => (
          <Product
            key={index}
            retailer={item.retailer}
            pointOfSale={item.pointOfSale}
            product={item.product}
            date={item.date}
          />
        ))}
      </div>
    </div>
  );
}
