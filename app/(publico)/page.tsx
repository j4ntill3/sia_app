import Link from "next/link";
import Image from "next/image";
import { Building2, Search, Home, MapPin, Phone, Mail } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] text-white overflow-hidden">
        {/* Imagen de fondo */}
        <Image
          src="/img/broker-inmobiliario-1.jpg"
          alt="Broker Inmobiliario"
          fill
          className="object-cover"
          priority
        />

        {/* Overlay oscuro para legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#083C2C]/80 to-[#05271d]/70"></div>

        {/* Contenido */}
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Encuentra tu Hogar Ideal
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-[#6FC6D1]">
              Sistema Inmobiliario - Tu socio de confianza en la búsqueda de propiedades
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/propiedades"
                className="bg-[#6FC6D1] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#5ab5c1] transition-colors inline-flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Ver Propiedades
              </Link>
              <a
                href="#contacto"
                className="border-2 border-[#6FC6D1] text-[#6FC6D1] px-8 py-3 rounded-lg font-semibold hover:bg-[#6FC6D1] hover:text-white transition-colors"
              >
                Contactanos
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            ¿Por qué elegirnos?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-[#6FC6D1]/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-[#083C2C]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#083C2C]">
                Amplia Variedad
              </h3>
              <p className="text-gray-600">
                Casas, departamentos, terrenos, locales comerciales y oficinas en las mejores ubicaciones.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-[#6FC6D1]/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-[#083C2C]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#083C2C]">
                Búsqueda Inteligente
              </h3>
              <p className="text-gray-600">
                Filtra y encuentra propiedades por ubicación, tipo, precio y características específicas.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-[#6FC6D1]/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Home className="w-6 h-6 text-[#083C2C]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#083C2C]">
                Asesoramiento Profesional
              </h3>
              <p className="text-gray-600">
                Nuestros agentes especializados te acompañan en cada paso del proceso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#083C2C]">
            Comienza tu búsqueda hoy
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Explora nuestro catálogo de propiedades disponibles y encuentra el lugar perfecto para ti.
          </p>
          <Link
            href="/propiedades"
            className="bg-[#6FC6D1] text-white px-10 py-4 rounded-lg font-semibold hover:bg-[#5ab5c1] transition-colors inline-flex items-center gap-2"
          >
            <Search className="w-5 h-5" />
            Explorar Propiedades
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-[#083C2C] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <p className="text-[#6FC6D1]">Propiedades Disponibles</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">1000+</div>
              <p className="text-[#6FC6D1]">Clientes Satisfechos</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">15+</div>
              <p className="text-[#6FC6D1]">Años de Experiencia</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#083C2C]">
            Contacto
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-start gap-4">
                <div className="bg-[#6FC6D1]/20 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#083C2C]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-[#083C2C]">Ubicación</h3>
                  <p className="text-gray-600">
                    Av. Randommeme 1234<br />
                    Santa Fe, Argentina
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-start gap-4">
                <div className="bg-[#6FC6D1]/20 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-[#083C2C]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-[#083C2C]">Teléfono</h3>
                  <p className="text-gray-600">
                    +54 11 1234-5678<br />
                    Lun - Vie: 9:00 - 18:00
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
              <div className="flex items-start gap-4">
                <div className="bg-[#6FC6D1]/20 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-[#083C2C]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-[#083C2C]">Email</h3>
                  <p className="text-gray-600">
                    contacto@siainmobiliaria.com<br />
                    info@siainmobiliaria.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
