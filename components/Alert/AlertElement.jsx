import { Alert } from '@material-ui/lab'
import { SuccessAlertIcon } from 'components/svg'

const AlertElement = ({ id, title, type }) => {
    return (
        <div>
            <Alert
                iconMapping={{ success: <SuccessAlertIcon /> }}
                severity={type}
                style={{ padding: '30px 30px' }}
                className="shake-animation"
            >
                {title}
            </Alert>
        </div>
    )
}

export default AlertElement
