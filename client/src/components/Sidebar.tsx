import { CalendarDaysIcon, LayoutDashboardIcon, LogOutIcon, UsersIcon, Wand2Icon } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';

function Sidebar({isOpen, setIsOpen}: {isOpen: boolean, setIsOpen: (val: boolean) => void}) {

    const {logout, user} = useAuth();
    const location = useLocation();

    const [isDesktop, setIsDesktop] = useState(false)

    useEffect(() => {
        const mq = window.matchMedia('(min-width: 768px)')
        setIsDesktop(mq.matches)
        const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
        mq.addEventListener('change', handler)
        return () => mq.removeEventListener('change', handler)
    }, [])

    const navItems = [

        {name: 'Dashboard', icon: LayoutDashboardIcon, path: '/dashboard'},
        {name: 'Accounts', icon: UsersIcon, path: '/accounts'},
        {name: 'Schedular', icon: CalendarDaysIcon, path: '/schedule'},
        {name: 'AI Generator', icon: Wand2Icon, path: '/ai-composer'},
    ]
  return (
    <div
        id="sidebar-nav"
        inert={!isDesktop && !isOpen ? true : undefined}
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col h-full transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Logo */}
        <div className='p-6 pb-4'>
            <div className='text-xl tracking-tight text-slate-800 flex items-center gap-1.5'>
                <img src="/logo.svg" alt="logo" className='size-6'/>
                Scheduler
            </div>
        </div>

        {/* Nav section label */}
        {/* <div className='px-6 py-2'>
            <span className='text-xs text-slate-500 uppercase tracking-wider'>Menu</span>
        </div> */}

        {/* Nav Links */}
        <nav className='flex-1 px-3 space-y-1'>
            {navItems.map((item) => {
                const IsActive = location.pathname === item.path;

                return(
                    <NavLink key={item.name} to={item.path} end = {item.path === "/dashboard"}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${IsActive ? "bg-indigo-50 text-indigo-600 font-medium border border-indigo-100/60" : "text-slate-500 hover:bg-slate-50 border-transparent hover:text-slate-700"}`}>
                        <item.icon className={`size-4.5 shrink-0 ${IsActive ? "text-indigo-600" : "text-slate-400"}`}/>
                        {item.name}
                        {IsActive && <span className='ml-auto w-[4px] h-4 rounded-full bg-indigo-600'/>}
                    </NavLink>
                )
            })}
        </nav>


        {/* User footer */}

        <div className='p-4 border-t border-slate-100'>
            <div className='flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors'>

            <div className='size-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-medium shrink-0 shadow-xs'>
                {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>

            <div className='flex-1 min-w-0'>
                <div className='text-sm text-slate-800 font-medium truncate'>{user?.name}</div>
                <div className='text-xs text-slate-500 truncate'>{user?.email}</div>
            </div>
            </div>

            <button onClick={logout} className='mt-1 flex items-center gap-2 px-3 py-2 w-full rounded-lg text-sm text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-150 font-medium'>
                <LogOutIcon className='size-4'/>
                Sign Out
            </button>
        </div>


    
        
    </div>
  )
}

export default Sidebar