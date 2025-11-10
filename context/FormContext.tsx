'use client';
import React, { createContext, ReactNode, useContext, useState } from 'react';

type QuestionOption = {
  idOption: string;
  text: string;
  value?: number;
};

type Question = {
  idQuestion: string;
  text: string;
  type: 'MULTIPLE_CHOICE' | 'CHECKBOXES' | 'SHORT_TEXT' | 'PARAGRAPH';
  options?: QuestionOption[];
  required?: boolean;
};

export type FormType = {
  idForm: string;
  title: string;
  description?: string;
  questions: Question[];
};

type FormContextType = {
  selectedForm: FormType | null;
  setSelectedForm: (form: FormType | null) => void;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [selectedForm, setSelectedForm] = useState<FormType | null>(null);

  return (
    <FormContext.Provider value={{ selectedForm, setSelectedForm }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext deve ser usado dentro de um FormProvider');
  }
  return context;
};
