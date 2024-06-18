import React, { useState } from 'react'
import { ProgramMenuIcon } from 'components/svg'
import moment from 'moment'
import { ClickAwayListener } from '@material-ui/core'
import { useTranslation } from 'i18n'
import Marquee from 'react-fast-marquee'

export default function ProgramChannel({
    data,
    refProgram,
    program_id,
    setProgram_id,
}) {
    const [openProgramList, setOpenProgramList] = useState(false)
    const { t } = useTranslation()
    const [currentData, setCurrentData] = useState(1)
    const datetime = new Date()

    return (
        <div ref={refProgram} className="containerProgramChannal">
            {openProgramList && (
                <div className="cont">
                    <ClickAwayListener
                        onClickAway={() => setOpenProgramList(false)}
                    >
                        <div
                            className={
                                !openProgramList
                                    ? 'program fade-out-right'
                                    : 'program fade-in-right'
                            }
                        >
                            <div className="header">
                                <h2>{t('tvShows')}</h2>
                                <div className="text-lg mt-5 flex items-center justify-between">
                                    <span
                                        onClick={() => setCurrentData(0)}
                                        className={`cursor-pointer ${
                                            currentData === 0
                                                ? 'text-white font-medium'
                                                : 'opacity-60 text-white'
                                        }`}
                                    >
                                        {t(`${data?.programs_info[0]?.day}`)}
                                    </span>
                                    <span
                                        onClick={() => setCurrentData(1)}
                                        className={`cursor-pointer ${
                                            currentData === 1
                                                ? 'text-white font-medium'
                                                : 'opacity-60 text-white'
                                        }`}
                                    >
                                        {t(`${data?.programs_info[1]?.day}`)}
                                    </span>
                                    <span
                                        onClick={() => setCurrentData(2)}
                                        className={`cursor-pointer ${
                                            currentData === 2
                                                ? 'text-white font-medium'
                                                : 'opacity-60 text-white'
                                        }`}
                                    >
                                        {t(`${data?.programs_info[2]?.day}`)}
                                    </span>
                                </div>
                            </div>
                            <div className="px-[24px] pt-3 overflow-y-scroll h-full">
                                {data?.programs_info &&
                                    data?.programs_info[
                                        currentData ? currentData : 0
                                    ]?.programme?.map((item) => (
                                        <div
                                            key={item.id}
                                            className="text-[#F6F8F9] text-[15px] border-b border-[#fff] border-opacity-[0.1] min-h-[60px] flex justify-center flex-col py-3"
                                        >
                                            <div className="flex">
                                                <span
                                                    className={`w-2 h-2 mr-3 bg-[#fff] bg-opacity-[0.3] rounded-full mt-2  ${
                                                        currentData === 1 &&
                                                        moment(
                                                            item.start_time,
                                                        ).format('A') ===
                                                            moment(
                                                                datetime,
                                                            ).format('A') &&
                                                        moment(
                                                            item.start_time,
                                                        ).format('LT A') <=
                                                            moment(
                                                                datetime,
                                                            ).format('LT A') &&
                                                        moment(
                                                            item.end_time,
                                                        ).format('LT A') >=
                                                            moment(
                                                                datetime,
                                                            ).format('LT A') &&
                                                        'bg-[#38EF7D] bg-opacity-[1]'
                                                    }`}
                                                ></span>
                                                <div className="w-[90%] flex flex-col">
                                                    <div className="flex space-x-3">
                                                        <span className="font-medium text-base">
                                                            {moment(
                                                                item.start_time,
                                                            ).format('LT')}
                                                        </span>
                                                        {/* <Marquee
                                                            play={false}
                                                            gradient={false}
                                                            speed={60}
                                                            className="text-white hover:text-opacity-[0.7] duration-300"
                                                        > */}
                                                        <span className="leading-10">
                                                            {item.title}
                                                        </span>
                                                        {/* </Marquee> */}
                                                    </div>

                                                    {currentData === 1 &&
                                                        moment(
                                                            item.start_time,
                                                        ).format('A') ===
                                                            moment(
                                                                datetime,
                                                            ).format('A') &&
                                                        moment(
                                                            item.start_time,
                                                        ).format('LT A') <=
                                                            moment(
                                                                datetime,
                                                            ).format('LT A') &&
                                                        moment(
                                                            item.end_time,
                                                        ).format('LT A') >=
                                                            moment(
                                                                datetime,
                                                            ).format(
                                                                'LT A',
                                                            ) && (
                                                            <p className="text-sm text-[#A9A7B4]">
                                                                Сейчас в эфире
                                                            </p>
                                                        )}
                                                </div>
                                            </div>
                                            {/* {moment(item.start_time).format('LT') <=
                        moment(datetime).format('LT') && moment(item.end_time).format('LT') >=
                        moment(datetime).format('LT') && (
                            'aaaa'
                        )} */}
                                            {/* <span className="mt-2">
                                                {moment(item.start_time).format('A')}
                                            </span> */}
                                            {/* <span className="mt-2">
                                                {moment(datetime).format('H')} a
                                            </span> */}
                                            {/* <span className="mt-2">
                                                {moment(item.end_time).format('H')}
                                            </span> */}
                                        </div>
                                    ))}
                            </div>
                            {/* <div className="body">
                                {data?.programs_info?.map((item, index) => (
                                    <div key={index}>
                                        <h3 className="program_title px-4 py-[13px] text-[17px] leading-[22px] text-[#fff] font-semibold">
                                            {item?.day}
                                        </h3>
                                        <div>
                                            {item?.Programme?.map((elem, i) => (
                                                <div
                                                    key={i}
                                                    className={
                                                        elem?.is_available
                                                            ? 'program_item'
                                                            : 'program_item opacity-50'
                                                    }
                                                    onClick={() =>
                                                        elem?.is_available
                                                            ? setProgram_id(
                                                                  elem?.id,
                                                              )
                                                            : setProgram_id(
                                                                  program_id,
                                                              )
                                                    }
                                                >
                                                    <span className="w-10 mr-[34px] block text-[17px] leading-[22px] font-normal text-[#8D8D8D]">
                                                        {moment(
                                                            elem?.start_time,
                                                        ).format('HH:mm')}
                                                    </span>
                                                    <span
                                                        className={
                                                            elem?.is_available
                                                                ? ' w-2 rounded-full h-2 bg-[#42BE65]'
                                                                : 'hidden'
                                                        }
                                                    />
                                                    <span
                                                        className={`${
                                                            elem?.is_available
                                                                ? 'pl-2'
                                                                : ''
                                                        } block w-full  text-[17px] leading-[22px] font-normal`}
                                                    >
                                                        {elem?.title}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div> */}
                        </div>
                    </ClickAwayListener>
                </div>
            )}
            <button
                className="cursor-pointer"
                onClick={() => setOpenProgramList(true)}
            >
                <ProgramMenuIcon />
            </button>
        </div>
    )
}
