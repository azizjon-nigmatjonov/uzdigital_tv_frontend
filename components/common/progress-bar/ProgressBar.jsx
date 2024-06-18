import React from 'react'

const ProgressBar = ({ bgcolor, progress, height }) => {
    const Parentdiv = {
        height: height,
        width: '100%',
        backgroundColor: '#C4C4C4',
        borderRadius: 40,
    }

    const Childdiv = {
        height: '100%',
        width: `${progress}%`,
        backgroundColor: bgcolor,
        borderRadius: 40,
        textAlign: 'right',
    }

    const progresstext = {
        padding: 10,
        color: 'black',
        fontWeight: 900,
    }

    return (
        <div style={Parentdiv}>
            <div style={Childdiv}>
                <span style={progresstext}></span>
            </div>
        </div>
    )
}

export default ProgressBar
