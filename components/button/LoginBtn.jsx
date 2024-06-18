import React from 'react'
import { Link } from 'i18n'

const LoginButton = ({ text }) => (
    <Link href="/registration">
        <a>
            <button
                type="button"
                className="bg-mainColor text-white h-11 px-4 py-2.5 rounded-xl tracking-wide hover:bg-opacity-[0.85] duration-100"
            >
                <span className="font-medium text-8 leading-11">{text}</span>
            </button>
        </a>
    </Link>
)

export default LoginButton
