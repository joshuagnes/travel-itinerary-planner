import React from 'react'

type Props = {
    htmlFor: string,
    label: string,
    value: string,
    setValue: (email: string) => void,
    id: string,
    name: string,
    autoComplete: string,
    required: boolean,
    type: string,
    placeholder: string,
}

export default function Input({ 
    htmlFor,
    label,
    value, 
    setValue,
    id,
    name,
    autoComplete,
    required,
    type,
    placeholder,
  
}: Props) {
    return (
        <div className="space-y-1">
            <label
                htmlFor={htmlFor}
                className="block text-sm font-medium text-gray-700"
            >
                {label}
            </label>
            <input
                id={id}
                name={name}
                type={type}
                autoComplete={autoComplete}
                required={required}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={placeholder}
            />
        </div>
    )
}