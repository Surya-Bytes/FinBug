import React, { useContext } from 'react'
import SideMenu from './SideMenu';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import CharAvatar from '../Cards/CharAvatar';
import Modal from './Modal';
import LogoutConfirm from './LogoutConfirm';

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = React.useState(false);
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [openUserMenu, setOpenUserMenu] = React.useState(false);
  const [openLogoutModal, setOpenLogoutModal] = React.useState(false);
  return (
    <>
      <div className='landing-nav w-full flex items-center justify-between px-6 py-4 md:px-12 bg-white/60 backdrop-blur fixed top-0 left-0 right-0 z-30 shadow-sm border-b border-gray-200/40'>
        {/* Menu button only shown on small screens; on desktop sidebar is permanent */}
        <div className='flex items-center gap-4'>
          <button className='block lg:hidden text-gray-800' onClick={() => setOpenSideMenu(!openSideMenu)}>
            {openSideMenu ? (<HiOutlineX className='text-2xl' />) : (<HiOutlineMenu className='text-2xl' />)}
          </button>
        </div>

        {/* Right side: show user avatar/name on desktop */}
        <div className='flex items-center gap-3'>
          {user ? (
            <div className='hidden md:flex items-center gap-2 relative'>
              {user?.profileImageUrl ? (
                <img src={user.profileImageUrl} alt='Profile' className='w-9 h-9 rounded-full' />
              ) : (
                <CharAvatar fullName={user.fullName} width='w-9' height='h-9' />
              )}
              <span className='text-sm font-medium text-gray-900 hidden lg:inline'>{user.fullName}</span>
              <button className='ml-2 text-sm px-3 py-2 rounded-md bg-white border border-gray-200 shadow-sm' onClick={() => setOpenUserMenu(!openUserMenu)}>
                ▾
              </button>

              {openUserMenu && (
                <div className='absolute right-0 top-12 bg-white border rounded shadow-md py-2 w-44 z-50'>
                  <button className='w-full text-left px-4 py-2 text-sm hover:bg-gray-100' onClick={() => { setOpenUserMenu(false); setOpenLogoutModal(true); }}>
                    Logout
                  </button>
                </div>
              )}

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
          ) : null}
        </div>
      </div>

      {/* Mobile side menu */}
      {openSideMenu && (
        <div className='fixed inset-0 z-40 lg:hidden'>
          <div className='fixed inset-0 bg-black/50' onClick={() => setOpenSideMenu(false)}></div>
          <div className='fixed top-0 left-0 h-full w-64 bg-white shadow-xl overflow-y-auto'>
            <SideMenu activeMenu={activeMenu} />
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar