'use client';

import { Card } from '@heroui/card';
import { useEffect, useState } from 'react';

// import RafiHadiyasa from "@/components/copyright";
// import DashboardCard from "./_components/dashboard-card";

// import { useEffect, useState } from "react";

// import TableTransaksi from "./_components/table";
// import formatRupiah from "@/lib/helpers/formatRupiah";
// import HeaderPage from "@/components/header/header";
// import useBankSampahData from "@/hooks/useBankSampahData";
// import formatNumber from "@/lib/helpers/formatNumber";
// import Slogan from "./_components/slogan";
// import TopCustomers from "./_components/topCustomers";

// import { CoinsIcon } from "lucide-react";
// import { FaTrashRestoreAlt } from "react-icons/fa";
// import { MdOutlineEnergySavingsLeaf } from "react-icons/md";
// import { BiMoneyWithdraw } from "react-icons/bi";
// import { GrTransaction } from "react-icons/gr";
// import { IoPeopleSharp } from "react-icons/io5";

// import { getAllCustomers } from "@/modules/services/customer.service";
// import { getTransactions } from "@/modules/services/transaction.service";

export const DashboardComponent = () => {
  const [customersData, setCustomersData] = useState([]);
  const [transactionsData, setTransactionsData] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  //   const { bankSampahProfile } = useBankSampahData();

  // Fungsi untuk menghitung total berat sampah per customer dan mengambil top 5
  const calculateTopCustomers = (transactions) => {
    const customerMap = {};

    transactions?.forEach((transaction) => {
      if (transaction.customer) {
        const customerId = transaction.customer._id;
        const customerName = transaction.customer.fullName;

        if (!customerMap[customerId]) {
          customerMap[customerId] = {
            id: customerId,
            name: customerName,
            totalWeight: 0,
          };
        }

        customerMap[customerId].totalWeight += transaction.trashWeight;
      }
    });

    const sortedCustomers = Object.entries(customerMap)
      .map(([id, customer]) => customer)
      .sort((a, b) => b.totalWeight - a.totalWeight)
      .slice(0, 10);

    return sortedCustomers;
  };

  // Customer Deposit -> Jumlah deposit yang sudah dilakukan customers
  const totalCustomerDeposit = (customersData || []).reduce((total, deposit) => {
    return total + (deposit?.totalDeposit || 0);
  }, 0);

  // Jumlah withdraw yang dilakukan oleh customers
  const totalCustomerWithdraw = (customersData || []).reduce((total, withdraw) => {
    return total + (withdraw?.totalWithdraw || 0);
  }, 0);
  // Jumlah saldo customer yang tersedia di bank Sampah
  const availableBalance = (customersData || []).reduce((total, balance) => {
    return total + (balance?.balance || 0);
  }, 0);

  const fetchAllData = async () => {
    try {
      const dataCustomers = []; //"await getAllCustomers();"
      const dataTransactions = []; //"await getTransactions();"

      setTransactionsData(dataTransactions);
      setCustomersData(dataCustomers);

      // Hitung top 5 customer berdasarkan berat sampah
      const topCustomersData = calculateTopCustomers(dataTransactions);

      setTopCustomers(topCustomersData);
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <div className="min-w-screen bg-fuchsia-300">
      {/* <HeaderPage /> */}
      <div className="w-full flex flex-col items-center">
        <div className="w-full">
          <Card className="w-full">
            <h1>Hallo!</h1>
            {/* <DashboardCard
              title={"Saldo Bank Sampah"}
              number={formatRupiah(availableBalance)}
              type={",-"}
              icon={<CoinsIcon />}
              footer={"Saldo nasabah yang tersedia di bank Sampah"}
            /> */}
          </Card>
          {/* <Slogan /> */}
        </div>
        <div className="px-5 md:px-10">
          <div className="flex flex-col xl:flex-row justify-between gap-5 mt-5">
            <div className="grid lg:flex gap-5 w-full">
              {/* <TableTransaksi
                transactionData={transactionsData}
                isLoading={loading}
              />
              <TopCustomers topCustomers={topCustomers} /> */}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 xl:w-auto xl:flex-row py-5 gap-5">
            {/* <DashboardCard
              title={"Akumulasi Deposit"}
              number={formatRupiah(totalCustomerDeposit)}
              type={",-"}
              footer={"Nilai setor tunai yang sudah dilakukan oleh nasabah"}
              icon={<MdOutlineEnergySavingsLeaf />}
            />
            <DashboardCard
              title={"Akumulasi Tarik Tunai"}
              number={formatRupiah(totalCustomerWithdraw)}
              type={",-"}
              icon={<BiMoneyWithdraw />}
              footer={"Tarik tunai yang sudah dilakukan oleh nasabah"}
            />
            <DashboardCard
              title={"Akumulasi Sampah"}
              number={formatNumber(bankSampahProfile?.totalTrashWeight ?? 0)}
              type={"kilogram"}
              icon={<FaTrashRestoreAlt size={18} />}
              footer={"Total sampah yang berhasil dikurangi"}
            /> */}
          </div>

          <div className="basis-1/3">
            <div className="grid md:flex xl:grid gap-2 pb-2">
              <div className="flex md:w-1/2 lg:w-full gap-3">
                {/* <DashboardCard
                  title={"Total Nasabah"}
                  number={customersData?.length}
                  type={"Nasabah"}
                  icon={<IoPeopleSharp size={20} />}
                />
                <DashboardCard
                  title={"Total Transaksi"}
                  number={transactionsData?.length}
                  type={"Transaksi"}
                  icon={<GrTransaction size={18} />}
                /> */}
              </div>
            </div>
          </div>
          {/* <RafiHadiyasa /> */}
        </div>
      </div>
    </div>
  );
};
