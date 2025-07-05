// address-input.tsx
'use client';

import React from 'react';
import { AddressSuggestions, type DaDataSuggestion, type DaDataAddress } from 'react-dadata';

interface Props {
  value?: DaDataSuggestion<DaDataAddress> | null;
  onChange?: (value: DaDataSuggestion<DaDataAddress> | null) => void;
}

export const AdressInput: React.FC<Props> = ({ value, onChange }) => {
  const handleChange = (suggestion?: DaDataSuggestion<DaDataAddress>) => {
    onChange?.(suggestion || null);
  };

  return (
    <AddressSuggestions
      token={import.meta.env.VITE_APPWRITE_DADATA_API_KEY}
      value={value || undefined}
      onChange={handleChange}
    />
  );
};