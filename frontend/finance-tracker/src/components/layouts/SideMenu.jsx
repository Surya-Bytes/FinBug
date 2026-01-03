import React, { useContext } from 'react';
import { SIDE_MENU_DATA } from '../../utils/data';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import CharAvatar from '../Cards/CharAvatar';
import Modal from './Modal';
import LogoutConfirm from './LogoutConfirm';

const SideMenu = ({ activeMenu }) => {
    const { user, clearUser } = useContext(UserContext);

    const navigate = useNavigate();

    const [openLogoutModal, setOpenLogoutModal] = React.useState(false);

    const handleClick = (route) => {
        const normalized = String(route || '').toLowerCase();
        if (normalized === "logout" || normalized === "/logout") {
            setOpenLogoutModal(true);
            return;
        }

        navigate(route);
    };

    return (
        <div className="fixed left-0 top-0 w-64 h-screen bg-white border-r border-gray-200 p-6 z-20 flex flex-col overflow-y-auto">
            {/* FINBUG Title */}
            <h1 className="text-xl font-bold text-gray-900 mb-6">FINBUG</h1>

            {/* User Profile Section */}
            <div className="flex flex-col items-center gap-3 mb-8">
                {user?.profileImageUrl ? (
                    <img
                        src={user?.profileImageUrl || ""}
                        alt="Profile Image"
                        className='w-16 h-16 bg-slate-400 rounded-full object-cover'
                    />
                ) : (
                    <CharAvatar
                        fullName={user?.fullName}
                        width="w-16"
                        height="h-16"
                        style="text-lg"
                    />
                )}
                <h5 className="text-gray-900 font-bold text-lg text-center">
                    {user?.fullName || "Mike William"}
                </h5>
            </div>

            {/* Navigation Menu */}
            <div className="flex flex-col gap-2">
                {SIDE_MENU_DATA.map((item, index) => (
                    <button
                        key={`menu_${index}`}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${activeMenu === item.label
                            ? "bg-purple-600 text-white shadow-md"
                            : "text-gray-700 hover:bg-gray-50"
                            }`}
                        onClick={() => handleClick(item.path)}
                    >
                        <item.icon className="text-xl" />
                        <span>{item.label}</span>
                    </button>
                ))}
            </div>

            <Modal isOpen={openLogoutModal} onClose={() => setOpenLogoutModal(false)} title="Logout">
                <LogoutConfirm
                    onCancel={() => setOpenLogoutModal(false)}
                    onLogout={() => {
                        try {
                            localStorage.clear();
                        } catch {
                            // Ignore localStorage errors
                        }
                        clearUser();
                        setOpenLogoutModal(false);
                        navigate('/');
                    }}
                />
            </Modal>
        </div>
    );
};

export default SideMenu