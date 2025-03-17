import { Link } from 'react-router-dom';

type Props = {
    to: string,
    text: string,
    className?: string,
}

export default function LinkComponent({
    to,
    text,
    className = 'text-blue-600 hover:text-blue-800 font-medium',
}: Props) {
    return (
        <Link
            to={to}
            className={`${className ? className : 'text-blue-600 hover:text-blue-800 font-medium'}`}
        >
            {text}
        </Link>
    )
}