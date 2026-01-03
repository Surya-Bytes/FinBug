export const BASE_URL = "http://localhost:8000";

//utils/apiPaths.js
export const API_PATHS = {
    AUTH: {
        LOGIN: "/api/v1/auth/login",
        REGISTER: "/api/v1/auth/register",
        GET_USER_INFO: "/api/v1/auth/getUser",
    },
    DASHBOARD: {
        GET_DATA: "/api/v1/dashboard",
    },
    INCOME: {
        ADD_INCOME: "/api/v1/income/add",
        GET_INCOME: "/api/v1/income/get",
        GET_ALL_INCOME: "/api/v1/income/get",
        DELETE_INCOME: (incomeId) => `/api/v1/income/${incomeId}`,
        DOWNLOAD_INCOME: '/api/v1/income/downloadexcel',
        BULK_UPLOAD_INCOME: '/api/v1/income/bulk-upload',
    },
    EXPENSE: {
        ADD_EXPENSE: "/api/v1/expense/add",
        GET_ALL_EXPENSE: "/api/v1/expense/get",
        DELETE_EXPENSE: (expenseId) => `/api/v1/expense/${expenseId}`,
        DOWNLOAD_EXPENSE: '/api/v1/expense/downloadexcel',
        BULK_UPLOAD_EXPENSE: '/api/v1/expense/bulk-upload',
    },
    IMAGE: {
        UPLOAD_IMAGE: "/api/v1/auth/upload-image",
    },
    AI: {
        ANALYZE: "/api/v1/ai/analyze",
        PREDICT_EXPENSES: "/api/v1/ai/predict-expenses",
        ANALYZE_SPENDING: "/api/v1/ai/analyze-spending",
        HEALTH_SCORE: "/api/v1/ai/health-score",
    },
    BILL: {
        SCAN: "/api/v1/bill/scan",
    },
};