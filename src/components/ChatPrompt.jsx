import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { FaRobot, FaPaperPlane } from 'react-icons/fa'

const MODULES = ['Moda', 'Historia', 'Ciencia', 'Deporte', 'Arte']

const ChatPrompt = () => {
  const [selectedModule, setSelectedModule] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const conversationsEndRef = useRef(null)

  useEffect(() => {
    if (conversationsEndRef.current) {
      conversationsEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [questions])

  const fetchQuestions = async (module) => {
    setIsLoading(true)
    setQuestions([])
    setAnswers({})
    try {
      const res = await axios.post('https://chatgptback.vercel.app/api/chat', {
        prompt: `Genera 5 preguntas en formato simple para un juego sobre el tema de ${module}.`
      })
      const responseText = res.data.response
      const splitQuestions = responseText
        .split('\n')
        .filter(line => line.trim())
        .map((line, i) => line.replace(/^\d+[\).]?\s*/, '').trim())

      setQuestions(splitQuestions.slice(0, 5))
    } catch (err) {
      console.error('Error generando preguntas:', err)
      setQuestions(['Lo siento, no se pudieron generar preguntas.'])
    } finally {
      setIsLoading(false)
    }
  }

  const handleModuleSelect = (module) => {
    setSelectedModule(module)
    fetchQuestions(module)
  }

  const handleAnswerChange = (index, value) => {
    setAnswers({ ...answers, [index]: value })
  }

  const handleSubmitAnswers = (e) => {
    e.preventDefault()
    console.log('Respuestas enviadas:', answers)
    alert('¡Gracias por tus respuestas!')
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-purple-200 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 text-center">
        <h2 className="text-xl font-bold flex items-center justify-center">
          <FaRobot className="mr-2 text-purple-200" /> Juego de Preguntas IA
        </h2>
      </div>

      {/* Módulos */}
      <div className="flex flex-wrap justify-center gap-2 p-4 bg-purple-50 border-b border-purple-200">
        {MODULES.map((mod) => (
          <button
            key={mod}
            onClick={() => handleModuleSelect(mod)}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              selectedModule === mod
                ? 'bg-purple-600 text-white'
                : 'bg-white border border-purple-300 text-purple-600 hover:bg-purple-100'
            }`}
            disabled={isLoading}
          >
            {mod}
          </button>
        ))}
      </div>

      {/* Preguntas y respuestas */}
      <div className="p-4 bg-gradient-to-b from-purple-50 to-white">
        {isLoading && (
          <div className="text-center text-purple-600">⏳ Generando preguntas...</div>
        )}

        {!isLoading && questions.length > 0 && (
          <form onSubmit={handleSubmitAnswers} className="space-y-4">
            {questions.map((q, i) => (
              <div key={i}>
                <label className="block font-medium text-gray-700 mb-1">
                  {i + 1}. {q}
                </label>
                <input
                  type="text"
                  value={answers[i] || ''}
                  onChange={(e) => handleAnswerChange(i, e.target.value)}
                  className="w-full border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
            >
              <FaPaperPlane className="inline mr-2" /> Enviar respuestas
            </button>
          </form>
        )}

        {!isLoading && !selectedModule && (
          <div className="text-center text-purple-700 mt-4">
            Selecciona un módulo para comenzar el juego 🎮
          </div>
        )}

        <div ref={conversationsEndRef} />
      </div>
    </div>
  )
}

export default ChatPrompt
