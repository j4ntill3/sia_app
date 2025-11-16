import Link from "next/link";
import { Mail, Phone, MapPin, Building2 } from "lucide-react";

const PublicFooter = () => {
  return (
    <footer className="bg-[#083C2C] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Columna 1: Brand e Información */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Building2 className="w-8 h-8 text-[#6FC6D1]" />
              <span className="text-2xl font-bold text-white">Inmobiliaria</span>
            </div>
            <p className="text-sm text-[#6FC6D1]/80">
              Tu socio de confianza en la búsqueda de propiedades.
              Encuentra tu hogar ideal con nosotros.
            </p>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h3 className="text-white font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-[#6FC6D1]/80 hover:text-[#6FC6D1] transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/propiedades" className="text-sm text-[#6FC6D1]/80 hover:text-[#6FC6D1] transition-colors">
                  Propiedades
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-[#6FC6D1]" />
                <span className="text-sm text-[#6FC6D1]/80">
                  Av. Principal 1234<br />
                  Buenos Aires, Argentina
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0 text-[#6FC6D1]" />
                <span className="text-sm text-[#6FC6D1]/80">+54 11 1234-5678</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0 text-[#6FC6D1]" />
                <span className="text-sm text-[#6FC6D1]/80">contacto@siainmobiliaria.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#6FC6D1]/20 mt-8 pt-8 text-center">
          <p className="text-sm text-[#6FC6D1]/80">
            © {new Date().getFullYear()} Inmobiliaria. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
