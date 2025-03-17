import React from 'react';
import { Calendar } from 'lucide-react';

interface FormControlProps {
  label: string;
  id: string;
  type: string;
  value: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isEditing: boolean;
}

const FormControl: React.FC<FormControlProps> = ({
  label,
  id,
  type,
  value,
  handleInputChange,
  isEditing,
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {type === 'date' && (
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        )}
        {type === 'textarea' ? (
          <textarea
            className={`w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition resize-none h-32 ${
              isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
            }`}
            id={id}
            value={value}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        ) : (
          <input
            className={`w-full ${type === 'date' ? 'pl-10' : 'pl-3'} p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${
              isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
            }`}
            type={type}
            id={id}
            value={value}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        )}
      </div>
    </div>
  );
};

export default FormControl;
