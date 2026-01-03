import {
  LuLayoutGrid,
  LuWalletMinimal,
  LuUsers,
  LuLogOut,
  LuBrain,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutGrid,
    path: "/dashboard",
  },
  {
    id: "02",
    label: "Income",
    icon: LuWalletMinimal,
    path: "/income",
  },
  {
    id: "03",
    label: "Expense",
    icon: LuUsers,
    path: "/expense",
  },
  {
    id: "04",
    label: "AI Insights",
    icon: LuBrain,
    path: "/ai-insights",
  },
  {
    id: "06",
    label: "Logout",
    icon: LuLogOut,
    path: "/logout",
  },
];
