import { useNavigate } from "react-router";
import { ChevronLeft, MessageCircle, Mail, Phone, HelpCircle } from "lucide-react";
import { useState } from "react";

export function Support() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Tu mensaje ha sido enviado. Te responderemos pronto.");
    setSubject("");
    setMessage("");
  };

  const faqs = [
    {
      question: "¿Cómo compro un boleto?",
      answer: "Navega por el marketplace, selecciona el boleto que desees y haz clic en 'Comprar'.",
    },
    {
      question: "¿Puedo cancelar mi compra?",
      answer: "Sí, puedes cancelar hasta 24 horas antes del evento desde 'Mis Boletos'.",
    },
    {
      question: "¿Cómo vendo mis boletos?",
      answer: "Usa el botón 'Registrar venta' en el marketplace y completa la información.",
    },
    {
      question: "¿Los boletos son transferibles?",
      answer: "Sí, puedes transferir boletos usando el código QR o el token de confirmación.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#FF5722] text-white px-4 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate("/app/profile")}
          className="w-10 h-10 bg-[#FFA726] rounded-full flex items-center justify-center hover:bg-[#ff9800] transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">Soporte y Ayuda</h1>
      </header>

      <div className="max-w-md mx-auto p-4">
        {/* Quick Contact */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <h2 className="font-semibold mb-4">Contacto rápido</h2>
          <div className="space-y-3">
            <a
              href="mailto:soporte@udlap.mx"
              className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-[#FF5722]/10 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#FF5722]" />
              </div>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-gray-600">soporte@udlap.mx</p>
              </div>
            </a>

            <a
              href="tel:+525512345678"
              className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-[#4CAF50]/10 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-[#4CAF50]" />
              </div>
              <div>
                <p className="font-medium">Teléfono</p>
                <p className="text-sm text-gray-600">+52 55 1234 5678</p>
              </div>
            </a>

            <button
              onClick={() => alert("Chat en vivo próximamente")}
              className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-medium">Chat en vivo</p>
                <p className="text-sm text-gray-600">Disponible 9:00 - 18:00</p>
              </div>
            </button>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <h2 className="font-semibold mb-4">Enviar mensaje</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Asunto</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="¿En qué podemos ayudarte?"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mensaje</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe tu problema o pregunta..."
                rows={5}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5722] resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#FF5722] hover:bg-[#f4511e] text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Enviar mensaje
            </button>
          </form>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-[#FF5722]" />
            <h2 className="font-semibold">Preguntas frecuentes</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <details key={index} className="group">
                <summary className="font-medium cursor-pointer hover:text-[#FF5722] transition-colors list-none flex items-center justify-between p-2">
                  {faq.question}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="text-sm text-gray-600 mt-2 p-2 bg-gray-50 rounded-lg">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
