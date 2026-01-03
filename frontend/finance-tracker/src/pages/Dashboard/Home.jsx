import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import InfoCard from "../../components/Cards/InfoCard";
import { addThousandsSeparator } from "../../utils/helper";
import RecentTransactions from "../../components/Dashboard/RecentTransactions";
import FinanceOverview from "../../components/Dashboard/FinanceOverview";
import RecentIncomeWithChart from "../../components/Dashboard/RecentIncomeWithChart";
import RecentIncome from "../../components/Dashboard/RecentIncome";
import ExpenseTransactions from "../../components/Dashboard/ExpenseTransactions";
import Last30DaysExpenses from "../../components/Dashboard/Last30DaysExpenses";

import { LuUsers, LuWalletMinimal } from "react-icons/lu";
import { IoMdCard } from "react-icons/io";

const Home = () => {
  useUserAuth();

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetchingRef = useRef(false);

  const fetchDashboardData = useCallback(async () => {
    if (fetchingRef.current) return;

    fetchingRef.current = true;
    setLoading(true);

    try {
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);

      if (response?.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Handle error appropriately, e.g., show a notification
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="transition-page">
        {/* Info Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <InfoCard
            icon={<IoMdCard />}
            label="Total Balance"
            value={addThousandsSeparator(dashboardData?.totalBalance || 0)}
            color="bg-purple-500"
            index={0}
          />

          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Income"
            value={addThousandsSeparator(dashboardData?.totalIncome || 0)}
            color="bg-orange-500"
            index={1}
          />

          <InfoCard
            icon={<LuUsers />}
            label="Total Expenses"
            value={addThousandsSeparator(dashboardData?.totalExpenses || 0)}
            color="bg-red-500"
            index={2}
          />
        </div>

        {/* Two Column Layout: Recent Transactions and Financial Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div
            className="animate-slide-in-left"
            style={{ animationDelay: "80ms" }}
          >
            <RecentTransactions
              transactions={dashboardData?.recentTransactions}
              onSeeMore={() => navigate("/expense")}
            />
          </div>

          <div
            className="animate-slide-in-right"
            style={{ animationDelay: "80ms" }}
          >
            <FinanceOverview
              totalBalance={dashboardData?.totalBalance || 0}
              totalIncome={dashboardData?.totalIncome || 0}
              totalExpenses={dashboardData?.totalExpenses || 0}
            />
          </div>
        </div>

        {/* Two Column Layout: Last 60 Days Income and Income List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div
            className="animate-slide-in-left"
            style={{ animationDelay: "160ms" }}
          >
            <RecentIncomeWithChart
              data={dashboardData?.last60DaysIncome?.transactions || []}
              totalIncome={dashboardData?.totalIncome || 0}
            />
          </div>

          <div
            className="animate-slide-in-right"
            style={{ animationDelay: "160ms" }}
          >
            <RecentIncome
              transactions={dashboardData?.last60DaysIncome?.transactions || []}
              onSeeMore={() => navigate("/income")}
            />
          </div>
        </div>

        {/* Two Column Layout: Expenses List and Last 30 Days Expenses Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div
            className="animate-slide-in-left"
            style={{ animationDelay: "240ms" }}
          >
            <ExpenseTransactions
              transactions={
                dashboardData?.last30DaysExpenses?.transactions || []
              }
              onSeeMore={() => navigate("/expense")}
            />
          </div>

          <div
            className="animate-slide-in-right"
            style={{ animationDelay: "240ms" }}
          >
            <Last30DaysExpenses
              data={dashboardData?.last30DaysExpenses?.transactions || []}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
