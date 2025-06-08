import Image from 'next/image';

import productImage from '@/assets/images/product.jpg';
import ProductList from './List';
import { format } from 'date-fns';

const Product = ({
  retailer,
  pointOfSale,
  product,
  date,
}: {
  retailer: string;
  pointOfSale: string;
  product: string;
  date: Date;
}) => {
  return (
    <div className="border border-neutral-200 rounded-md bg-white flex flex-col gap-5 w-fit max-w-[385px] px-5 py-5 shadow-xs">
      <Image src={productImage} alt="Product" />
      <div className="flex flex-col text-sm gap-2">
        <p>
          <span className="text-gray-500">Retailer:</span> {retailer}
        </p>
        <p>
          <span className="text-gray-500">Point of sale:</span> {pointOfSale}
        </p>
        <p>
          <span className="text-gray-500">Product (SKU):</span> {product}
        </p>
        <p>
          <span className="text-gray-500">Date:</span>{' '}
          {format(date, 'dd.MM.yyyy HH:mm:ss')}
        </p>
      </div>
    </div>
  );
};

Product.List = ProductList;

export default Product;
