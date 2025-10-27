"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import InmuebleForm from "@/components/InmuebleForm"
import { InmuebleCreate } from "@/types/inmueble"

export default function CrearInmueble() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  return (
    <div className="min-h-[calc(100vh-80px-56px)] flex flex-col items-center bg-gray-100 p-4 md:p-8">
        <InmuebleForm
          mode="create"
          loading={loading}
          onSubmit={async (data: InmuebleCreate) => {
            setLoading(true)
            try {
              const response = await fetch("/api/inmuebles", {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
              })
              const resData = await response.json()
              if (!response.ok || !resData.data || !resData.data.id) {
                alert(resData.error || "Error desconocido al crear el inmueble.")
                setLoading(false)
                return
              }
              alert("Inmueble creado con éxito.")
              setLoading(false)
              router.push("/inmuebles")
            } catch (error) {
              alert("Hubo un error al intentar crear el inmueble.")
              setLoading(false)
            }
          }}
        />
      </div>
  )
}

