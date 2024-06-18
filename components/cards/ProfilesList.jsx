import { useTranslation, Router } from 'i18n'
import {
    CheckboxIconUnchecked,
    CheckboxIconChecked,
    PlusIconWhite,
} from '../svg'
import axios from '../../utils/axios'
import { useSelector } from 'react-redux'
import {
    setRecommendationValue,
    setRecommendationActivator,
} from 'store/actions/application/recommendationActions'
import { useDispatch } from 'react-redux'

const ProfilesList = ({ profiles, ProfilesList }) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()

    const RecommendationActive = useSelector(
        (state) => state.recommend.recommendation_active,
    )

    const handleCheckbox = () => {
        if (RecommendationActive) {
            dispatch(setRecommendationActivator(false))
        } else {
            dispatch(setRecommendationActivator(true))
        }
    }

    const getMovieData = (ID) => {
        axios
            .get(`/profiles/${ID}`)
            .then((res) => {
                dispatch(setRecommendationValue(res?.data))
                sessionStorage.setItem('listSelected', 'active')
                Router.push('/')
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <>
            <div className="text-white wrapper flex items-center justify-center h-[100vh] flex-col">
                <h1 className="font-medium text-2xl sm:text-[48px]">
                    {t('whoIsHere?')}
                </h1>
                <div className="flex space-x-[10px] md:space-x-[28px] mt-[45px] mb-[40px] w-full justify-center">
                    {profiles &&
                        profiles?.map((item) => (
                            <div
                                className="w-[70px] md:w-[145px]"
                                key={item.id}
                            >
                                <div onClick={() => getMovieData(item?.id)}>
                                    <span className="cursor-pointer">
                                        {item?.profile_type === 'children' ||
                                        item?.profile_image ? (
                                            <div className="h-[70px] md:h-[145px] w-full object-cover rounded-[12px] flex items-center justify-center overflow-hidden hover:scale-105 duration-300 relative">
                                                <img
                                                    className="w-full h-[70px] md:h-[145px] object-cover"
                                                    src={
                                                        item?.profile_type ===
                                                            'children' &&
                                                        item?.profile_image ===
                                                            ''
                                                            ? '../vectors/childrenProfile.svg'
                                                            : item?.profile_image
                                                    }
                                                    alt="avatar"
                                                />
                                                {item?.profile_type ===
                                                    'children' &&
                                                    !item?.profile_image && (
                                                        <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 leading-25 font-bold text-[24px] sm:text-[36px]">
                                                            {t('child')}
                                                        </div>
                                                    )}
                                            </div>
                                        ) : (
                                            <div
                                                className={`h-[70px] md:h-[145px] w-full object-cover rounded-[12px] flex items-center justify-center uppercase font-[600] text-[24px] md:text-[72px] hover:scale-105 duration-300 ${
                                                    item?.profile_image
                                                        ? ''
                                                        : item.is_main
                                                        ? 'profileImage'
                                                        : 'profileImageUser'
                                                }`}
                                            >
                                                {item?.name
                                                    ?.trim()
                                                    ?.substr(0, 1)}
                                            </div>
                                        )}
                                    </span>
                                </div>
                                <p className="text-[12px] md:text-[17px] text-[#A9A7B4] break-words text-center mt-[10px]">
                                    {item.name}
                                </p>
                            </div>
                        ))}

                    {ProfilesList?.profile_limit !== ProfilesList?.count && (
                        <div>
                            <div
                                onClick={() =>
                                    Router.push(
                                        '/registration?from=profileCreate',
                                    )
                                }
                                className="h-[70px] md:h-[145px] w-[70px] md:w-[145px] object-cover bg-[#1C192C] rounded-[12px] flex items-center justify-center cursor-pointer hover:scale-105 duration-300"
                            >
                                <PlusIconWhite width="50px" height="50px" />
                            </div>
                            <p className="text-[12px] md:text-[17px] text-[#A9A7B4] break-words text-center mt-[10px]">
                                {t('add')}
                            </p>
                        </div>
                    )}
                </div>
                <div
                    onClick={() => handleCheckbox()}
                    className="flex items-center space-x-[13px] cursor-pointer font-medium"
                >
                    {!RecommendationActive ? (
                        <CheckboxIconUnchecked />
                    ) : (
                        <CheckboxIconChecked />
                    )}
                    <p>{t('DontAskAgain')}</p>
                </div>
            </div>
        </>
    )
}

export default ProfilesList
