import React from 'react';

interface FormFieldProps {
  type: 'email' | 'password' | 'text';
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  showError?: boolean;
  required?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  type,
  placeholder,
  value,
  onChange,
  error,
  showError = true,
  required = true,
}) => {
  return (
    <div className="mb-4">
      <input
        type={type}
        placeholder={placeholder}
        className={`w-full p-2 border rounded bg-gray-700 text-white ${
          showError && error ? 'border-red-500' : 'border-gray-600'
        }`}
        value={value}
        onChange={onChange}
        required={required}
      />
      {showError && error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField; 