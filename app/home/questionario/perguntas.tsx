'use client';
import { useEffect, useState } from 'react';

interface Option {
  idOption: string;
  text: string;
  value?: number;
}

interface Question {
  idQuestion: string;
  text: string;
  type: string;
  required: boolean;
  options: Option[];
}

interface FormDetail {
  idForm: string;
  title: string;
  description?: string;
  questions: Question[];
}

export default function Perguntas() {
  const [form, setForm] = useState<FormDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idForm = params.get('id');
    if (!idForm) return;

    async function fetchForm() {
      try {
        const res = await fetch(`/api/forms/${idForm}`); // seu endpoint real
        const data = await res.json();
        setForm(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchForm();
  }, []);

  if (loading) return <p>Carregando perguntas...</p>;
  if (!form) return <p>Formulário não encontrado.</p>;

  return (
    <div>
      <h1>{form.title}</h1>
      {form.description && <p>{form.description}</p>}
      <ul>
        {form.questions.map((q) => (
          <li key={q.idQuestion}>
            <strong>{q.text}</strong> ({q.type})
            {q.options.length > 0 && (
              <ul>
                {q.options.map((opt) => (
                  <li key={opt.idOption}>
                    {opt.text} {opt.value != null && `(valor: ${opt.value})`}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
