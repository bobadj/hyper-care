import Image from 'next/image';

import productImage from '@/assets/images/product.jpg';
import ProductList from './List';

const Product = () => {
  return (
    <div className="border border-neutral-200 rounded-md bg-white flex flex-col gap-5 w-fit max-w-[385px] px-5 py-5 shadow-xs">
      <Image src={productImage} alt="Product" />
      <div className="flex flex-col text-sm gap-2">
        <p>
          <span className="text-gray-500">Retailer:</span> WORTEN
        </p>
        <p>
          <span className="text-gray-500">Point of sale:</span> WORTEN, Anaza
        </p>
        <p>
          <span className="text-gray-500">Product (SKU):</span> 65E0QN
          (767123867)
        </p>
        <p>
          <span className="text-gray-500">Date:</span> 22.05.2025. 12:09:03
        </p>
      </div>
    </div>
  );
};

Product.List = ProductList;

export default Product;
