import { useEffect, useState } from 'react'
import { useIsMobile } from '../../hooks/useIsMobile'
import MobileHeader from './MobileHeader'
import DesktopHeader from './DesktopHeader'
import { useSelector } from 'react-redux'

const Header = ({
    categories,
    profile,
    notifications,
    notificationsUnread,
}) => {
    const [isMobile] = useIsMobile()
    const [searchOpen, setSearchOpen] = useState(false)
    const [navbarActive, setNavbarActive] = useState(false)

    const changeBackground = () => {
        if (window.scrollY >= 96) {
            setNavbarActive(true)
        } else {
            setNavbarActive(false)
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', changeBackground)
    }, [])

    return (
        <div id="header" className="sticky top-0 z-[999]">
            <div className="mobile-header">
                <MobileHeader
                    searchOpen={searchOpen}
                    setSearchOpen={setSearchOpen}
                    categories={categories ? categories : []}
                    profile={profile?.customer}
                    navbarActive={navbarActive}
                    notifications={notifications}
                    notificationsUnread={notificationsUnread}
                />
            </div>
            <div className="desktop-header">
                <DesktopHeader
                    notifications={notifications}
                    searchOpen={searchOpen}
                    setSearchOpen={setSearchOpen}
                    profile={profile?.customer}
                    categories={categories ? categories : []}
                    navbarActive={navbarActive}
                    notificationsUnread={notificationsUnread}
                />
            </div>
        </div>
    )
}

export default Header
