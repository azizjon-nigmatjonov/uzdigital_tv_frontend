import React from 'react'
import { useTranslation } from 'i18n'
import { Link } from 'i18n'
import {
    AppGalleryTextIcon,
    AppGalleryLogoIcon,
    AppleIcon,
    AppStoreTextIcon,
    AppStoreLogoIcon,
    GooglePlayIcon,
    LogoIcon,
    FacebookIconFill,
    TelegramIconFill,
    YoutubeIconFill,
    TiktokFill,
    TVFooterTextIcon,
    TVFooterLogoIcon,
    LogoIconFooter,
    InstagramIcon,
    EnglishFlagIcon,
    RussianIcon,
    UzFlagIcon,
    GoogleTextIcon,
    GoogleLogoIcon,
    UzDigitalSvgIcon,
} from 'components/svg'
import cls from './Footer.module.scss'
import router, { useRouter } from 'next/router'
import NextLink from 'components/common/link'
import { i18n } from 'i18n'
import axios from 'utils/axios'
import { parseCookies } from 'nookies'
// import InstagramIcon from '@mui/icons-material/Instagram'

function Footer({ categories }) {
    const { t } = useTranslation()
    const Router = useRouter()
    const { user_id } = parseCookies()
    const changeLanguage = (lang) => {
        axios.put(`/customer/change-lang`, {
            params: {
                customer_id: user_id,
                lang: lang,
            },
        })

        i18n.changeLanguage(lang)
    }

    return (
        <>
            <div className="footer bg-[#1C192C] wrapper mt-16 sm:mt-28">
                <div className="py-6 hidden md:block">
                    <div className="flex justify-between mb-8">
                        <div>
                            <span className="hidden lg:block mb-2 text-white font-medium">
                                {t('navigation')}
                            </span>
                            <ul className="flex gap-y-3 mt-4 list">
                                <div className="flex flex-col gap-y-3">
                                    <p key={'/'}>
                                        <NextLink href={'/'}>
                                            <a
                                                className={`${cls.footer__link}`}
                                            >
                                                {t('home')}
                                            </a>
                                        </NextLink>
                                    </p>
                                    {categories?.slice(0, 3).map((elem) => (
                                        <p key={elem.id}>
                                            <NextLink
                                                href={`/movies/${elem.id}?type=${elem?.slug}`}
                                            >
                                                <a
                                                    className={
                                                        router.query
                                                            .category ===
                                                        elem.id
                                                            ? ` ${cls.footer__link}`
                                                            : cls.footer__link
                                                    }
                                                >
                                                    {t(elem.title)}
                                                </a>
                                            </NextLink>
                                        </p>
                                    ))}
                                </div>
                                <div className="flex flex-col ml-20 gap-y-3">
                                    {categories?.slice(3, 4).map((elem) => (
                                        <p key={elem.id}>
                                            <NextLink
                                                href={`/movies/${elem.id}?type=${elem?.slug}`}
                                            >
                                                <a
                                                    className={
                                                        router.query
                                                            .category ===
                                                        elem.id
                                                            ? ` ${cls.footer__link}`
                                                            : cls.footer__link
                                                    }
                                                >
                                                    {t(elem.title)}
                                                </a>
                                            </NextLink>
                                        </p>
                                    ))}
                                    <p key={'/selected'}>
                                        <NextLink href={'/selected'}>
                                            <a
                                                className={`${cls.footer__link}`}
                                            >
                                                {t('selected')}
                                            </a>
                                        </NextLink>
                                    </p>
                                    <p key={'/tv'}>
                                        <NextLink href={'/tv'}>
                                            <a
                                                className={`${cls.footer__link}`}
                                            >
                                                {t('tv_channels')}
                                            </a>
                                        </NextLink>
                                    </p>
                                </div>
                            </ul>
                        </div>
                        <div
                            className={`${cls.footer_left_text} logo hidden md:flex md:flex-col`}
                        >
                            <Link href="/">
                                <a>
                                    <UzDigitalSvgIcon />
                                </a>
                            </Link>
                            <p className="text-[#BDBDBD] mt-[13px] max-w-[250px]">
                                {t('footer_subtitle')}
                            </p>
                        </div>
                    </div>
                    <div className="flex xl:items-center flex-col xl:flex-row xl:justify-between gap-4">
                        <div className="flex flex-wrap w-full gap-5">
                            <a
                                // href=""
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <div className="flex items-center text-white bg-[#000] h-[60px] overflow-hidden px-[16px] rounded-[5px]">
                                    <GoogleLogoIcon />
                                    <span className="ml-3">
                                        <span className="text-[10px] uppercase tracking-wider">
                                            {t('Get it on')}
                                        </span>
                                        <GoogleTextIcon />
                                    </span>
                                </div>
                            </a>
                            <a
                                // href=""
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <div className="flex items-center text-white bg-[#000] h-[60px] overflow-hidden px-[16px] rounded-[5px]">
                                    <AppStoreLogoIcon />
                                    <span className="ml-3">
                                        <span className="text-[10px] uppercase tracking-wider">
                                            {t('downloadOnthe')}
                                        </span>
                                        <AppStoreTextIcon />
                                    </span>
                                </div>
                            </a>
                            <a
                                // href=""
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <div className="flex items-center text-white bg-[#000] h-[60px] overflow-hidden px-[16px] rounded-[5px]">
                                    <AppGalleryLogoIcon />
                                    <span className="ml-3">
                                        <span className="text-[10px] uppercase tracking-wider">
                                            {t('downloadOnthe')}
                                        </span>
                                        <AppGalleryTextIcon />
                                    </span>
                                </div>
                            </a>
                            <a
                                // href=""
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <div className="flex items-center text-white bg-[#000] h-[60px] overflow-hidden px-[16px] rounded-[5px]">
                                    <TVFooterLogoIcon />
                                    <span className="ml-3">
                                        <span className="text-[10px] uppercase tracking-wider">
                                            {t('watch it on')}
                                        </span>
                                        <TVFooterTextIcon />
                                    </span>
                                </div>
                            </a>
                        </div>
                        <div className="text-white text-opacity-[0.6] text-[17px]">
                            <ul className="flex items-center gap-x-5">
                                <li
                                    onClick={() => changeLanguage('ru')}
                                    className={`cursor-pointer flex items-center gap-x-2 leading-5 ${
                                        i18n?.language === 'ru'
                                            ? 'text-white font-semibold'
                                            : 'font-normal'
                                    }`}
                                >
                                    <RussianIcon />
                                    Русский
                                </li>
                                <li
                                    onClick={() => changeLanguage('uz')}
                                    className={`cursor-pointer flex items-center gap-x-2 leading-5 ${
                                        i18n?.language === 'uz'
                                            ? 'text-white font-semibold'
                                            : 'font-normal'
                                    }`}
                                >
                                    <UzFlagIcon />
                                    O'zbekcha
                                </li>
                                <li
                                    onClick={() => changeLanguage('en')}
                                    className={`cursor-pointer flex items-center gap-x-2 leading-5 ${
                                        i18n?.language === 'en'
                                            ? 'text-white font-semibold'
                                            : 'font-normal'
                                    }`}
                                >
                                    <EnglishFlagIcon />
                                    English
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-between">
                    <div className="md:border-t md:border-white/[0.1] flex justify-between items-center w-full py-5">
                        <div className="flex flex-col md:hidden ">
                            <div className="flex items-start justify-start">
                                <ul className="flex flex-col w-[140px]">
                                    {categories?.map((elem) => (
                                        <li
                                            key={elem.id}
                                            className="text-8 text-white leading-10 font-normal mb-4"
                                        >
                                            <NextLink
                                                href={
                                                    elem.slug === 'integration'
                                                        ? `/premier?category=${elem.id}`
                                                        : `/movies/${elem.id}`
                                                }
                                            >
                                                <a
                                                    className={
                                                        router.query
                                                            .category ===
                                                        elem.id
                                                            ? `${cls.footer_active} ${cls.footer__link}`
                                                            : cls.footer__link
                                                    }
                                                >
                                                    {t(elem.title)}
                                                </a>
                                            </NextLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex flex-wrap justify-between w-full gap-2">
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-[48%]"
                                >
                                    <div className="flex items-center text-white bg-[#000] h-[60px] overflow-hidden px-[16px] rounded-[5px]">
                                        <GoogleLogoIcon />
                                        <span className="ml-3">
                                            <span className="text-[10px] uppercase tracking-wider">
                                                {t('Get it on')}
                                            </span>
                                            <GoogleTextIcon />
                                        </span>
                                    </div>
                                </a>
                                <a
                                    // href=""
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-[48%]"
                                >
                                    <div className="flex items-center text-white bg-[#000] h-[60px] overflow-hidden px-[16px] rounded-[5px]">
                                        <AppStoreLogoIcon />
                                        <span className="ml-3">
                                            <span className="text-[10px] uppercase tracking-wider">
                                                {t('downloadOnthe')}
                                            </span>
                                            <AppStoreTextIcon />
                                        </span>
                                    </div>
                                </a>
                                <a
                                    // href=""
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-[48%]"
                                >
                                    <div className="flex items-center text-white bg-[#000] h-[60px] overflow-hidden px-[16px] rounded-[5px]">
                                        <AppGalleryLogoIcon />
                                        <span className="ml-3">
                                            <span className="text-[10px] uppercase tracking-wider">
                                                {t('downloadOnthe')}
                                            </span>
                                            <AppGalleryTextIcon />
                                        </span>
                                    </div>
                                </a>
                                <a
                                    // href=""
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-[48%]"
                                >
                                    <div className="flex items-center text-white bg-[#000] h-[60px] overflow-hidden px-[16px] rounded-[5px]">
                                        <TVFooterLogoIcon />
                                        <span className="ml-3">
                                            <span className="text-[10px] uppercase tracking-wider">
                                                {t('watch it on')}
                                            </span>
                                            <TVFooterTextIcon />
                                        </span>
                                    </div>
                                </a>
                            </div>
                        </div>
                        <div className="hidden lg:flex justify-between w-full items-center">
                            <p className="text-white text-opacity-[0.6]">
                                © {t('rights_Reserved')}{' '}
                                <span
                                    className="text-white opacity-[0.6] ml-5 pb-3 cursor-pointer"
                                    onClick={() => router.push('/Privacy')}
                                >
                                    {t('privacy_policy')}
                                </span>
                            </p>
                            <ul className="hidden lg:flex items-center gap-4 flex-wrap pb-[20px] md:pb-0">
                                <li>
                                    <a
                                        href="#"
                                        className="bg-[#fff] bg-opacity-[0.1] hover:scale-110 hover:bg-opacity-[0.2] duration-200 w-[55px] h-[55px] flex items-center justify-center rounded-full"
                                    >
                                        <InstagramIcon />
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="bg-[#fff] bg-opacity-[0.1] hover:scale-110 hover:bg-opacity-[0.2] duration-200 w-[55px] h-[55px] flex items-center justify-center rounded-full"
                                    >
                                        <FacebookIconFill />
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="bg-[#fff] bg-opacity-[0.1] hover:scale-110 hover:bg-opacity-[0.2] duration-200 w-[55px] h-[55px] flex items-center justify-center rounded-full"
                                    >
                                        <TelegramIconFill />
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="bg-[#fff] bg-opacity-[0.1] hover:scale-110 hover:bg-opacity-[0.2] duration-200 w-[55px] h-[55px] flex items-center justify-center rounded-full"
                                    >
                                        <YoutubeIconFill />
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="bg-[#fff] bg-opacity-[0.1] hover:bg-opacity-[0.2] duration-200 w-[55px] h-[55px] flex items-center justify-center rounded-full"
                                    >
                                        <TiktokFill />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <span
                        className="text-white opacity-[0.6] pb-3 cursor-pointer"
                        onClick={() =>
                            window.open(' https://udevs.io/', '_blank')
                        }
                    >
                        Created by Udevs
                    </span>
                </div>
            </div>
            <div className="flex justify-center items-center md:hidden bg-[#100E19] text-white text-8s w-full p-4 text-center md:text-left">
                © {t('rights_Reserved')}
            </div>
        </>
    )
}
export default Footer
