'use client';

import Product from '../components/Product';
import BrandShare from '../components/BrandShare';
import RetailerChart from '../components/RetailerChart';
import Lineup from '../components/Lineup';
import Tabs from '@/components/Tabs';

const sdaData = [
  { name: 'Philips', value: 11.9 },
  { name: 'Gorenje', value: 17.8 },
  { name: 'Bosch', value: 14.7 },
  { name: 'Other', value: 24.0 },
  { name: 'Tefal', value: 8.8 },
  { name: 'VOX', value: 7.8 },
  { name: 'Beko', value: 4.8 },
  { name: 'Sencor', value: 2.9 },
  { name: 'Rowenta', value: 2.8 },
  { name: 'ECG', value: 2.2 },
  { name: 'Braun', value: 2.1 },
];

const mdaData = [
  { name: 'Gorenje', value: 23.4 },
  { name: 'VOX', value: 21.0 },
  { name: 'Beko', value: 12.7 },
  { name: 'Bosch', value: 9.0 },
  { name: 'Candy', value: 8.5 },
  { name: 'Midea', value: 5.9 },
  { name: 'Whirlpool', value: 4.9 },
  { name: 'Samsung', value: 4.4 },
  { name: 'Haier', value: 3.7 },
  { name: 'Hisense', value: 2.4 },
  { name: 'Other', value: 4.1 },
];

const customerSellInData = [
  { name: 'Jan 2024', customer: [{ name: 'Tehnomania', value: 1200 }] },
  { name: 'Feb 2024', customer: [{ name: 'Tehnomania', value: 900 }] },
  { name: 'Mar 2024', customer: [{ name: 'Tehnomania', value: 1100 }] },
  { name: 'Apr 2024', customer: [{ name: 'Tehnomania', value: 800 }] },
  { name: 'May 2024', customer: [{ name: 'Tehnomania', value: 1600 }] },
  { name: 'Jun 2024', customer: [{ name: 'Tehnomania', value: 1300 }] },
  { name: 'Jul 2024', customer: [{ name: 'Tehnomania', value: 300 }] },
  { name: 'Aug 2024', customer: [{ name: 'Tehnomania', value: 2000 }] },
  { name: 'Sep 2024', customer: [{ name: 'Tehnomania', value: 1434 }] },
  { name: 'Oct 2024', customer: [{ name: 'Tehnomania', value: 961 }] },
  { name: 'Nov 2024', customer: [{ name: 'Tehnomania', value: 2135 }] },
  { name: 'Dec 2024', customer: [{ name: 'Tehnomania', value: 1898 }] },
];

const lineupData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
];

const lineupTableData = [
  {
    rank: 1,
    retailer: 'SINERSIS',
    pointOfSale: 'SINERSIS, TRADACETE, S.L., LA PUEBLA DE ALMORADIEL',
    percentage: 900,
  },
  {
    rank: 2,
    retailer: 'ALCAMPO',
    pointOfSale: 'ALCAMPO, Alcobendas',
    percentage: 750,
  },
  {
    rank: 3,
    retailer: 'MEDIAMARKT',
    pointOfSale: 'MEDIAMARKT, Huelva',
    percentage: 600,
  },
  {
    rank: 4,
    retailer: 'CARREUFOR',
    pointOfSale: 'CARREUFOR, Larin',
    percentage: 400,
  },
  {
    rank: 5,
    retailer: 'MEDIAMARKT',
    pointOfSale: 'MEDIAMARKT, La Maquinista',
    percentage: 388,
  },
];

export default function Home() {
  const tabData = [
    {
      label: 'Sales Report',
      content: <div>This is the overview tab.</div>,
    },
    {
      label: 'Stock Status',
      content: <div>Sales data will appear here.</div>,
    },
    {
      label: 'Lineup Sample Placement',
      content: <div>Here are your reports.</div>,
    },
    {
      label: 'Trade Marketing Activity',
      content: <div>Here are your reports.</div>,
    },
    {
      label: 'Brand Share',
      content: <div>Here are your reports.</div>,
    },
  ];

  return (
    <div className="">
      <Tabs tabs={tabData} />
    </div>
  );
  // return (
  //   <div className="grid grid-cols-2 gap-4 pt-4">
  //     <BrandShare data={sdaData} title="SDA" />
  //     <BrandShare data={mdaData} title="MDA" />
  //     <div className="col-span-2 bg-white px-4 py-2">
  //       <BrandShare.Bar data={sdaData} />
  //       <BrandShare.Bar data={sdaData} />
  //       <BrandShare.Bar data={sdaData} />
  //       <BrandShare.Bar data={sdaData} />
  //     </div>
  //     <div className="col-span-2">
  //       <RetailerChart data={customerSellInData} />
  //     </div>
  //     <div className="col-span-2">
  //       <RetailerChart type="line" data={customerSellInData} />
  //     </div>
  //     <div className="col-span-2">
  //       <Product.List />
  //     </div>
  //     <div className="col-span-2">
  //       <div className="grid grid-cols-3 gap-2 mb-4">
  //         <Lineup title="Lineup sample placement" data={lineupData} />
  //         <Lineup title="Sample placement" data={lineupData} />
  //         <Lineup title="Non-lineup products" data={lineupData} />
  //       </div>
  //       <Lineup.Table data={lineupTableData} />
  //     </div>
  //   </div>
  // );
}
