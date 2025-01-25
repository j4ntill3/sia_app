"use client";

import { useState } from "react";

const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setMessage("Por favor, selecciona una imagen.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64File = reader.result as string;

      // Enviamos el archivo como base64 y el nombre original al backend
      const response = await fetch("/api/uploadImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file: base64File,
          fileName: file.name, // Enviamos el nombre original del archivo
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`Imagen subida con éxito: ${data.fileName}`);
      } else {
        setMessage("Hubo un error al subir la imagen.");
      }
    };

    reader.readAsDataURL(file); // Convertir a base64
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button type="submit">Subir imagen</button>
      <p>{message}</p>
    </form>
  );
};

export default UploadForm;
