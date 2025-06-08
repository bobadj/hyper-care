import Product from '.';

export default function ProductList() {
  return (
    <div className="overflow-x-auto">
      <div className="grid grid-rows-2 auto-cols-max grid-flow-col gap-4 min-w-max">
        <Product />
        <Product />
        <Product />
        <Product />
        <Product />
        <Product />
        <Product />
        <Product />
        <Product />
      </div>
    </div>
  );
}
