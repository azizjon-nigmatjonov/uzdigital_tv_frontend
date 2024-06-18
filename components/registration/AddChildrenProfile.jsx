import { useRef, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import cls from './Index.module.scss'
import { ArrowBackUserIcon } from '../svg.js'
import { useTranslation } from 'i18n'
import InputProfile from 'components/pages/settings/settingsTabs/profilePage/InputProfile'
import axios from '../../utils/axios'
import { useDispatch } from 'react-redux'
import { setProfileType } from 'store/actions/application/profileAction'
import { setRecommendationValue } from 'store/actions/application/recommendationActions'
import router from 'next/router'
const AddChildrenProfile = ({ childrenName, setStep }) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const refClear = useRef()

    useEffect(() => {
        refClear.current.focus()
    }, [])

    const formik = useFormik({
        validationSchema: Yup.object({
            userAge: Yup.number().max(16, t('age should be less than 16')),
        }),
        initialValues: {
            userAge: '',
        },

        onSubmit: (values) => {
            if (values && !formik.errors.userAge) {
                axios
                    .post('/profile', {
                        name: childrenName ? childrenName : '',
                        profile_age:
                            parseInt(values.userAge) > 0
                                ? parseInt(values.userAge)
                                : 1,
                        profile_type: 'children',
                    })
                    .then((res) => {
                        if (res) {
                            dispatch(setRecommendationValue(res?.data))
                            dispatch(setProfileType('adult'))
                            setTimeout(() => {
                                router.push(`/`)
                            }, 300)
                        }
                    })
                    .catch((err) => {
                        console.error(err)
                    })
            }
        },
    })

    return (
        <div className="relative">
            <button
                onClick={() => {
                    setStep('addUser')
                }}
                className={`hidden md:flex absolute left-[-30px] top-[40px] bg-[#100E19] w-[60px] h-[60px] rounded-full items-center justify-center group z-50 ${cls.backUserButton}`}
            >
                <ArrowBackUserIcon />
            </button>

            <form
                className="text-white bg-[#100E19] w-full sm:w-[450px] rounded-[12px] p-[40px]"
                autoComplete="off"
                onSubmit={formik.handleSubmit}
            >
                <h1 className="text-[28px] font-[600]">{t('age?')}</h1>
                <div className={cls.inputUserAge}>
                    <InputProfile
                        refClear={refClear}
                        className={`bg-transparent text-white w-full placehoder:text-[#A9A7B4]`}
                        onChange={formik.handleChange}
                        type="number"
                        name="userAge"
                        value={formik.values.userAge}
                        errors={formik.errors.userAge}
                        placeholder={t('write age')}
                    />
                </div>
                <button
                    className="w-full bg-[#5086EC] py-[14px] rounded-[12px] hover:bg-opacity-[0.48] duration-200 mt-[58px]"
                    type="submit"
                >
                    {t('continue')}
                </button>
            </form>
        </div>
    )
}

export default AddChildrenProfile
